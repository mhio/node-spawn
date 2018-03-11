/* global expect, chai */
const { Spawn } = require('../../src/Spawn')
chai.should()

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
      proc.setCommand([ 'definately not here' ])
      return proc.run().should.be.rejectedWith(/Command not found/)
    })

    it('should fail to run a bad binary', function(){
      proc.setCommand([ 'false' ])
      return proc.run().should.be.rejectedWith(/Command exited with: "1"/)
    })

    it('should run a fixed path', function(){
      proc.setCommand([ '/bin/sh', '-c', 'true' ])
      return proc.run().should.become(proc)
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
