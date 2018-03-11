/* global expect */
const { Spawn, SpawnException } = require('../../')

describe('unit::mhio::spawn::module', function(){

  it('should create a Spawn', function(){
    expect( new Spawn() ).to.be.ok
  })

  it('should create a SpawnException', function(){
    expect( new SpawnException() ).to.be.ok
  })
  
  
})
