const cp = require('child_process')

let proc = cp.spawn('sleep', ['5'])
proc.kill('SIGTERM')
proc.on('close', exit => {
  console.log('got close with:', exit)
})