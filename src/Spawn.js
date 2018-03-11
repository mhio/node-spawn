const cp = require('child_process')
const debug = require('debug')('mhio:spawn:Spawn')
const { Exception } = require('@mhio/exception')

/* SpawnException for wrapping any Error objects raised here */
class SpawnException extends Exception {
  constructor( message, opts = {} ){
    super(message, opts)
    this.command = opts.command
    this.error = opts.error
    this.arguments = opts.arguments
    this.cwd = process.cwd()
    this.path = process.env.PATH
  }
}

/* Spawn */
class Spawn {
  
  static _classInit(){
    this.ms_minute = 60000  // 60 * 1000
    this.ms_hour = 3600000  // 60 * 60 * 1000
    this.ms_day = 86400000  // 24 * 60 * 60 * 1000
  }

  static run( command, opts = {}){
    opts.command = command
    let proc = new this(opts)
    return proc.run()
  }

  constructor( options = {} ){
    this._errors = []
    this._output = []
    this._running = false
    this._started = false
    this._finished = false

    this._expected_exit_code = options.expected_exit_code || 0
    this._timeout_in = options.timeout_in
    this._timeout_at = options.timeout_at
    this._error_cb = options.error_cb
    this._exit_cb = options.exit_cb
    this._stdout_cb = options.stdout_cb
    this._stderr_cb = options.stderr_cb
    
    this._ignore_exit_code = (options.ignore_exit_code !== undefined)
      ? Boolean(options.ignore_exit_code)
      : false

    if ( options.command ) this.setCommand(options.command) // array of [ cmd, ...arg ]
  }

  get command(){ return this._command }
  setCommand( command_arr ){
    if ( command_arr instanceof Array === false ) throw new SpawnException('command not an Array')
    return this._command = command_arr
  }

  get spawn_cmd(){  return this._command[0] }
  get spawn_args(){ return this._command.slice(1) }
  
  get output(){     return this._output }
  get errors(){     return this._errors }
  get running(){    return this._running }
  get started(){    return this._started }
  get finished(){    return this._finished }

  get timeout_in(){ return this._timeout_in }
  setTimeoutIn( ms_val ){
    return this._timeout_in = ms_val
  }
  
  get timeout_at(){ return this._timeout_at }
  setTimeoutAt( ts_val ){
    return this._timeout_at = ts_val
  }

  get stdout_cb(){ return this._stdout_cb }
  setStdoutCb( cb ){
    if ( typeof cb !== 'function' ) throw new SpawnException('Callback must be a function')
    return this._stdout_cb = cb
  }

  get stderr_cb(){ return this._stderr_cb }
  setStderrCb( cb ){
    if ( typeof cb !== 'function' ) throw new SpawnException('Callback must be a function')
    return this._stderr_cb = cb
  }
  
  get close_cb(){ return this._close_cb }
  setCloseCb( cb ){
    if ( typeof cb !== 'function' ) throw new SpawnException('Callback must be a function')
    return this._close_cb = cb
  }
  
  get error_cb(){ return this._error_cb }
  setErrorCb( cb ){
    if ( typeof cb !== 'function' ) throw new SpawnException('Callback must be a function')
    return this._error_cb = cb
  }

  get ignore_exit_code(){ return this._ignore_exit_code }
  ignoreExitCode( bool = true ){
    return this._ignore_exit_code = Boolean(bool)
  }

  get expected_exit_code(){ return this._expected_exit_code }
  setExpectedExitCode( int ){
    if ( ! `${int}`.match(/^\d+$/) ) {
      throw new SpawnException(`Expected exit code should be an integer. Got ${int}`)
    }
    return this._expected_exit_code = int
  }


  /*
   *  @summary Handle `spawn` stdout processing
   */
  handleStdout(data){
    this.output.push([ 1, data.toString() ])
    if ( this.stdout_cb ) this.stdout_cb(data)
  }


  /*
   *  @summary Handle `spawn` stderr processing
   */
  handleStderr(data){
    this.output.push([ 2, data.toString() ])
    if ( this.stderr_cb ) this.stderr_cb(data)
  }

  /*
   *  @summary Run a process with spawn, turn it into a promise
   *  @returns {promise}
   */
  run(){
    return new Promise((resolve, reject)=>{
      if ( this._started ) throw new SpawnException('Command already running', this)
      let proc = this.proc = cp.spawn(this.spawn_cmd, this.spawn_args)

      // Setup
      this._running = true
      this._started = true
      let output = this._output
      
      // Timeouts
      if ( this._timeout_in ) this.setTimeoutAt( Date.now() + this._timeout_in )

      if ( this._timeout_at ) {
        let ms_till_timeout = this._timeout_at - Date.now()
        if ( ms_till_timeout <= 0 ) {
          return reject(new Error('Timeout time in the past: ' + this._timeout_at))
        }
        this._kill_timer = setTimeout(()=>{
          if ( this._running === true ) {
            let err = new Error('Spawn process timed out, killing')
            this._errors.push(err)
            proc.kill('SIGTERM')
          }
        }, ms_till_timeout)
      }

      // Handle output
      proc.stdout.on('data', this.handleStdout.bind(this))
      proc.stderr.on('data', this.handleStderr.bind(this))
      
      // Handle process close
      proc.on('close', (exit_code, signal) => {
        this._running = false
        this._finished = true

        // `process.kill` somehow caused a `null` exit code
        if ( exit_code === null && proc.killed ) {
          debug('signal', signal)
          exit_code = 128 + 15
        }

        this.exit_code = exit_code
        output.push([ 3, exit_code ])

        // Cancel timeouts
        if ( this._kill_timer ) clearTimeout(this._kill_timer)
        
        if ( exit_code === this.expected_exit_code || this.ignore_exit_code ) {
          resolve(this)
        } else {
          let err = this.errors[0]
          if (!err) err = new SpawnException(`Command exited with: "${exit_code}"`)
          reject(err)
        }
        if ( this.close_cb ) this.close_cb(exit_code)
      })
      
      // Handle error events into `SpawnException`s
      proc.on('error', err => {
        let error = null
        if ( err.code === 'ENOENT' && /^spawn /.exec(err.syscall) ){
          error = new SpawnException(`Command not found: "${this.spawn_cmd}"`) // ${this.pwd}`)
        }
        else {
          error = new SpawnException(`Command failed: "${this.spawn_cmd}" "${this.spawn_args.join('" "')}"`)
        }

        error.error = err
        debug('job err', error)
        output.push([ 4, error ])
        this._errors.push(error)
        if ( this.error_cb ) this.error_cb(error)
      })      
    })
  }

  /*
   *  @summary Convert object to JSON object for `JSON.stringify()`
   *  @returns {object}
   */
  toJSON(){
    let o = {}
    o.command = this.command
    o.errors = this.errors
    o.output = this.output
    o.running = this.running
    o.started = this.started
    o.finished = this.finished
    o.timeout_at = this.timeout_at
    o.timeout_in = this.timeout_in
    return o
  }

}
Spawn._classInit()

module.exports = { Spawn, SpawnException }