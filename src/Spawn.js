const cp = require('child_process')
const debug = require('debug')('mhio:spawn:Spawn')
const { Exception } = require('@mhio/exception')

/** 
 * SpawnException for wrapping any Error objects raised in Spawn  
 * @extends Exception
 */
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

/** 
 * Spawn a command 
 * @property {Number} timeout_in    - Milliseconds to timeout from run time
 * @property {Number} timeout_at    - Milliseconds timestamp to timeout at
 * @property {function} run_cb      - Callback to run on spawn process run
 * @property {function} stdout_cb   - Callback to run on stdout data
 * @property {function} stderr_cb   - Callback to run on stderr data
 * @property {function} close_cb    - Callback to run on spawn process close
 * @property {function} error_cb    - Callback to run on spawn process error
 */
class Spawn {
  
  /** 
   * Class static initialisation
   * @namespace Spawn
   * @property {Number} ms_minute   - A minute of time in milliseconds
   * @property {Number} ms_hour     - An hour of time in milliseconds
   * @property {Number} ms_day      - A day of time in milliseconds
   */
  static _classInit(){
    this.exception_type = SpawnException
    this.ms_minute = 60000  // 60 * 1000
    this.ms_hour = 3600000  // 60 * 60 * 1000
    this.ms_day = 86400000  // 24 * 60 * 60 * 1000
  }

  /**
   * Create a Spawn and run it
   * @param {array} command - Array of argv to run
   * @param {Object} opts - Spawn options, see {@link Spawn#constructor}
   */
  static run( command, opts = {}){
    opts.command = command
    let proc = new this(opts)
    return proc.run()
  }

  /**
   * Represents a process to be spawned.
   * @param {Object} opts
   * @param {Number} opts.command               - Command and arguments array
   * @param {Number} opts.timeout_in            - Milliseconds to time out the process in
   * @param {Number} opts.timeout_at            - Millisecond timestamp to time out the process at
   * @param {function} opts.run_cb              - Callback to run on spawn process run
   * @param {function} opts.stdout_cb           - Callback to run on stdout data
   * @param {function} opts.stderr_cb           - Callback to run on stderr data
   * @param {function} opts.close_cb            - Callback to run on spawn process close
   * @param {function} opts.error_cb            - Callback to run on spawn process error
   * @param {Boolean} opts.ignore_exit_code     - Ignore exit code checks
   * @param {Number} opts.expected_exit_code    - Expect an exit code other than 0
   */
  constructor( options = {} ){
    this.exception_type = this.constructor.exception_type

    this._errors = []
    this._output = []
    this._running = false
    this._started = false
    this._finished = false

    this._expected_exit_code = options.expected_exit_code || 0
    this._timeout_in  = options.timeout_in
    this._timeout_at  = options.timeout_at
    this._error_cb    = options.error_cb
    this._close_cb    = options.close_cb
    this._stdout_cb   = options.stdout_cb
    this._stderr_cb   = options.stderr_cb
    
    this._ignore_exit_code = (options.ignore_exit_code !== undefined)
      ? Boolean(options.ignore_exit_code)
      : false

    if ( options.command ) this.setCommand(options.command) // array of [ cmd, ...arg ]
  }

  get command(){ return this._command }
  setCommand( command_arr ){
    if ( command_arr instanceof Array === false ) throw new this.exception_type('command not an Array')
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

  get run_cb(){ return this._run_cb }
  setRunCb( cb ){
    if ( typeof cb !== 'function' ) throw new this.exception_type('Callback must be a function')
    return this._run_cb = cb
  }

  get stdout_cb(){ return this._stdout_cb }
  setStdoutCb( cb ){
    if ( typeof cb !== 'function' ) throw new this.exception_type('Callback must be a function')
    return this._stdout_cb = cb
  }

  get stderr_cb(){ return this._stderr_cb }
  setStderrCb( cb ){
    if ( typeof cb !== 'function' ) throw new this.exception_type('Callback must be a function')
    return this._stderr_cb = cb
  }
  
  get close_cb(){ return this._close_cb }
  setCloseCb( cb ){
    if ( typeof cb !== 'function' ) throw new this.exception_type('Callback must be a function')
    return this._close_cb = cb
  }
  
  get error_cb(){ return this._error_cb }
  setErrorCb( cb ){
    if ( typeof cb !== 'function' ) throw new this.exception_type('Callback must be a function')
    return this._error_cb = cb
  }

  get ignore_exit_code(){ return this._ignore_exit_code }
  ignoreExitCode( bool = true ){
    return this._ignore_exit_code = Boolean(bool)
  }

  get expected_exit_code(){ return this._expected_exit_code }
  setExpectedExitCode( int ){
    if ( ! `${int}`.match(/^\d+$/) ) {
      throw new this.exception_type(`Expected exit code should be an integer. Got ${int}`)
    }
    return this._expected_exit_code = int
  }

  /**
   *  @summary Handle run callback processing
   */
  handleRunCallback(){
    if ( this.run_cb ) this.run_cb(this, this._run_resolve, this._run_reject)
  }

  /**
   *  @summary Handle `spawn` stdout processing
   */
  handleStdout(data){
    this.output.push([ 1, data.toString() ])
    if ( this.stdout_cb ) this.stdout_cb(data)
  }

  /**
   *  @summary Handle `spawn` stderr processing
   */
  handleStderr(data){
    this.output.push([ 2, data.toString() ])
    if ( this.stderr_cb ) this.stderr_cb(data)
  }

  /**
   *  @summary Run a process with `child_process.spawn`, turn it into a promise
   *  @returns {Promise}
   */
  run(){
    return new Promise((resolve, reject)=>{
      if ( this._started ) throw new this.exception_type('Command already running', this)
      let proc = this.proc = cp.spawn(this.spawn_cmd, this.spawn_args)
      debug('run spawning', this.spawn_cmd, this.spawn_args)

      // Setup
      this._running = true
      this._started = true
      this._run_resolve = resolve
      this._run_reject = reject
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

      // Run callback 
      this.handleRunCallback()

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
          if (!err) err = new this.exception_type(`Command exited with: "${exit_code}"`)
          reject(err)
        }
        if ( this.close_cb ) this.close_cb(exit_code, signal, this)
      })
      
      // Handle error events into `this.exception_type`s
      proc.on('error', err => {
        let error = null
        if ( err.code === 'ENOENT' && /^spawn /.exec(err.syscall) ){
          error = new this.exception_type(`Command not found: "${this.spawn_cmd}"`) // ${this.pwd}`)
        }
        else {
          error = new this.exception_type(`Command failed: "${this.spawn_cmd}" "${this.spawn_args.join('" "')}"`)
        }

        error.error = err
        debug('job err', error)
        output.push([ 4, error ])
        this._errors.push(error)
        if ( this.error_cb ) this.error_cb(error, this)
      })      
    })
  }

  /**
   *  @summary Kill the running process
   *  @description Send a kill signal to the spawned process if it exists.
   */
  kill( signal = 'SIGTERM' ){
    if ( this.running ) return this.proc.kill(signal)
  }

  /**
   *  @summary Convert object to JSON object for `JSON.stringify()`
   *  @returns {Object}
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

  /**
   * @summary return only stdout array
   * @returns {Array}
   */
  get stdout(){
    if (this._stdout) return this._stdout
    const stdout = this._output.reduce((filtered, line) => {
      if (line[0] === 1) filtered.push(line[1].replace(/\r?\n$/, ''))
      return filtered
    }, [])
    if (this.finished && stdout.length < 5000) this._stdout = stdout
    return stdout
  }

  /**
   * @summary return only stderr array
   * @returns {Array}
   */
  get stderr(){
    if (this._stderr) return this._stderr
    const stderr = this._output.reduce((filtered, line) => {
      if (line[0] === 2) filtered.push(line[1].replace(/\r?\n$/, ''))
      return filtered
    }, [])
    if (this.finished && stderr.length < 5000) this._stderr = stderr
    return stderr
  }

}
Spawn._classInit()

module.exports = { Spawn, SpawnException }
