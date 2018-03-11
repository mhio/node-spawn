const { Spawn } = require('../')

let proc = Spawn.run([ 'printf', '%s\n%s\n', 'one', 'two' ])
proc.then(res => {
  console.log('Command:   %s', JSON.stringify(res.command))
  console.log('Running:   %s', res.running)
  console.log('Exit Code: %s', res.exit_code)
  console.log('Output:   ', res.output)
})
