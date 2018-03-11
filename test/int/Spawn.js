/* global expect, chai */
const sinon = require('sinon')
chai.should()

const { Spawn } = require('../../src/Spawn')


describe('int::mhio::spawn::Spawn', function(){

  describe('instance', function(){
    
    let proc = null
    
    beforeEach(function(){
      proc = new Spawn({ command: ['true'] })
    })

    it('should run the true command', function(){
      return proc.run().then(()=>{
        expect( proc.output ).to.eql([ [3,0] ])
      })
    })

    it('should fail to run a bad binary', function(){
      proc.setCommand([ 'definately-not-a-binary-4rU' ])
      return proc.run().should.be.rejectedWith(/Command not found/)
    })

    it('should fail to run a bad binary', function(){
      proc.setCommand([ 'false' ])
      return proc.run().should.be.rejectedWith(/Command exited with: "1"/)
    })

    it('should succeed if ignoreing exit codes', function(){
      proc.setCommand([ 'false' ])
      proc.ignoreExitCode()
      return proc.run().should.become(proc)
    })

    it('should run a fixed path', function(){
      proc.setCommand([ '/bin/sh', '-c', 'true' ])
      return proc.run().should.become(proc)
    })

    it('should run a callback on close', function(){
      let spy = sinon.spy()
      proc.setCommand([ 'true' ])
      proc.setCloseCb(spy)
      return proc.run().then(()=>{
        spy.should.have.been.calledWith(0)
      })
    })

    it('should run a callback on exit', function(){
      let spy = sinon.spy()
      proc.setCommand([ 'definately-not-a-binary-4rU' ])
      proc.setErrorCb(spy)
      return proc.run().then(()=> {
        expect.fail()
      }).catch(()=> {
        spy.should.have.been.calledOnce
      })
    })

    it('should run a stdout callback for each line', function(){
      let spy = sinon.spy()
      proc.setCommand([ 'echo', 'test' ])
      proc.setStdoutCb(spy)
      return proc.run().then(()=> {
        spy.should.have.been.calledOnce
      })
    })

    it('should run a stderr callback for each line', function(){
      let spy = sinon.spy()
      proc.setCommand([ 'sh', '-c', 'echo test >/dev/stderr' ])
      proc.setStderrCb(spy)
      return proc.run().then(()=> {
        spy.should.have.been.calledOnce
      })
    })

    it('should timeout a command ', function(){
      proc.setCommand([ 'sleep', '2' ])
      proc.setTimeoutIn(25)
      return proc.run().then(()=>{
        expect( proc.output ).to.eql([])
      }).catch(err => {
        expect( err.message ).to.match(/timed out/)
        expect( proc.output ).to.eql([ [3,143] ])
        expect( proc.exit_code ).to.equal(143)
      })
    })

  })
})
