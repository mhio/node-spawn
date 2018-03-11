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

    it('should fail to run a Spawn twice', function(){
      proc.run()
      return proc.run().should.be.rejectedWith(/Command already running/)
    })

    it('should succeed if ignoring exit codes', function(){
      proc.setCommand([ 'false' ])
      proc.ignoreExitCode()
      return proc.run().should.become(proc)
    })

    it('should succeed if the expected exit code is set to 1', function(){
      proc.setCommand([ 'false' ])
      proc.setExpectedExitCode(1)
      return proc.run().should.become(proc)
    })

    it('should fail to set the expected exit code to a', function(){
      let fn = ()=> proc.setExpectedExitCode('a')
      expect( fn ).to.throw(/exit code should be an integer/)
    })

    it('should run a fixed path', function(){
      proc.setCommand([ '/bin/sh', '-c', 'true' ])
      return proc.run().should.become(proc)
    })

    describe('callbacks', function(){

      it('should run a callback on close', function(){
        let spy = sinon.spy()
        proc.setCommand([ 'true' ])
        proc.setCloseCb(spy)
        return proc.run().then(()=>{
          spy.should.have.been.calledWith(0)
        })
      })

      it('should fail to set a bad close callback', function(){
        let fn = ()=> proc.setCloseCb('a')
        expect( fn ).to.throw(/must be a function/)
      })

      it('should run a callback on exit/close', function(){
        let spy = sinon.spy()
        proc.setCommand([ 'definately-not-a-binary-4rU' ])
        proc.setErrorCb(spy)
        return proc.run().then(()=> {
          expect.fail()
        }).catch(()=> {
          spy.should.have.been.calledOnce
        })
      })

      it('should fail to set a bad close callback', function(){
        let fn = ()=> proc.setErrorCb('a')
        expect( fn ).to.throw(/must be a function/)
      })

      it('should run a stdout callback for each line', function(){
        let spy = sinon.spy()
        proc.setCommand([ 'echo', 'test' ])
        proc.setStdoutCb(spy)
        return proc.run().then(()=> {
          spy.should.have.been.calledOnce
        })
      })

      it('should fail to set a bad stdout callback', function(){
        let fn = ()=> proc.setStdoutCb('a')
        expect( fn ).to.throw(/must be a function/)
      })

      it('should run a stderr callback for each line', function(){
        let spy = sinon.spy()
        proc.setCommand([ 'sh', '-c', 'echo test >/dev/stderr' ])
        proc.setStderrCb(spy)
        return proc.run().then(()=> {
          spy.should.have.been.calledOnce
        })
      })

      it('should fail to set a bad stderr callback', function(){
        let fn = ()=> proc.setStderrCb('a')
        expect( fn ).to.throw(/must be a function/)
      })

    })

    describe('timeouts', function(){

      it('should timeout a command ', function(){
        proc.setCommand([ 'sleep', '2' ])
        proc.setTimeoutIn(10)
        return proc.run().then(()=>{
          expect( proc.output ).to.eql([])
        }).catch(err => {
          expect( err.message ).to.match(/timed out/)
          expect( proc.output ).to.eql([ [3,143] ])
          expect( proc.exit_code ).to.equal(143)
        })
      })

      it('should fail to set an old timeout at', function(){
        proc.setTimeoutAt(25)
        return proc.run().should.be.rejectedWith(/in the past/)
      })

      it('should fail to set an old timeout at', function(){
        proc.setTimeoutAt(Date.now())
        return proc.run().should.be.rejectedWith(/in the past/)
      })

    })

  })
})
