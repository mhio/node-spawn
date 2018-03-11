/* global expect, chai */
const sinon = require('sinon')
chai.should()

const { Spawn } = require('../../src/Spawn')


describe('int::mhio::spawn::Spawn', function(){

  describe('static', function(){

    it('should run a simple command', function(){
      return Spawn.run(['true'])
    })

    it('should run a command with options', function(done){
      Spawn.run(['true'], { close_cb: ()=> done(), error_cb: done })
    })

  })

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

    it('should kill a running command', function(){
      proc.setCommand([ 'sleep', '2' ])
      setTimeout(()=> proc.kill(), 5)
      return proc.run().then(()=> {
        expect.fail('process shouldn\'t finish on kill')
      }).catch(err => {
        expect( err.message ).to.match(/Command exited with: "143"/)
        expect( proc.output ).to.eql([ [3,143] ])
        expect( proc.exit_code ).to.equal(143)
      })
    })

    it('should succesfully return from kill for a finished command', function(){
      proc.setCommand([ 'sleep', '0.1' ])
      return proc.run().then(()=> {
        expect( proc.kill() ).to.be.undefined
      })
    })

    it('should succesfully return from kill for a fresh command', function(){
      proc.setCommand([ 'sleep', '2' ])
      expect( proc.kill() ).to.be.undefined
    })


    describe('callbacks', function(){

      it('should run a callback on run with promise resolve/reject', function(){
        let spy = sinon.spy()
        proc.setCommand([ 'true' ])
        proc.setRunCb(spy)
        return proc.run().then(()=>{

          spy.should.have.been.calledWith(proc)
          expect( spy.args[0][0], 'arg0 proc' ).to.be.a('object')
          expect( spy.args[0][1], 'arg1 resolve' ).to.be.a('function')
          expect( spy.args[0][2], 'arg2 reject' ).to.be.a('function')
        })
      })

      it('should fail to set a bad run callback', function(){
        let fn = ()=> proc.setRunCb('a')
        expect( fn ).to.throw(/must be a function/)
      })

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
