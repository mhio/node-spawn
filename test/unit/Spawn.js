/* global expect */
const { Spawn } = require('../../src/Spawn')

describe('unit::mhio::spawn::Spawn', function(){

  it('should create a Spawn', function(){
    expect( new Spawn() ).to.be.ok
  })
  
  describe('instance', function(){
    
    let proc = null
    
    before(function(){
      proc = new Spawn()
    })
    
    it('should set an array as command', function(){
      proc.setCommand([ 'true' ])
      expect( proc.command ).to.eql([ 'true' ])
    })
    
    it('should fail to set a string as command', function(){
      let fn = () => proc.setCommand('true')
      expect( fn ).to.throw(/not an Array/)
    })

    it('should dump json', function(){
      expect( proc.toJSON() ).to.eql({
        command: [ 'true' ],
        errors: [],
        output: [],
        running: false,
        timeout_at: undefined,
        timeout_in: undefined,
      })
    })

  })
})
