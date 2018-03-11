## Classes

<dl>
<dt><a href="#SpawnException">SpawnException</a> ⇐ <code>Exception</code></dt>
<dd><p>SpawnException for wrapping any Error objects raised in Spawn</p></dd>
<dt><a href="#Spawn">Spawn</a></dt>
<dd><p>Spawn a command</p></dd>
</dl>

<a name="SpawnException"></a>

## SpawnException ⇐ <code>Exception</code>
<p>SpawnException for wrapping any Error objects raised in Spawn</p>

**Kind**: global class  
**Extends**: <code>Exception</code>  

* * *

<a name="Spawn"></a>

## Spawn
<p>Spawn a command</p>

**Kind**: global class  

* [Spawn](#Spawn)
    * [new Spawn()](#new_Spawn_new)
    * _instance_
        * [.handleRunCallback()](#Spawn+handleRunCallback)
        * [.handleStdout()](#Spawn+handleStdout)
        * [.handleStderr()](#Spawn+handleStderr)
        * [.run()](#Spawn+run) ⇒ <code>promise</code>
        * [.kill()](#Spawn+kill)
        * [.toJSON()](#Spawn+toJSON) ⇒ <code>object</code>
    * _static_
        * [._classInit()](#Spawn._classInit)
        * [.run()](#Spawn.run)


* * *

<a name="new_Spawn_new"></a>

### new Spawn()
<p>Represents a process to be spawned.</p>


* * *

<a name="Spawn+handleRunCallback"></a>

### spawn.handleRunCallback()
**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Handle run callback processing</p>  

* * *

<a name="Spawn+handleStdout"></a>

### spawn.handleStdout()
**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Handle <code>spawn</code> stdout processing</p>  

* * *

<a name="Spawn+handleStderr"></a>

### spawn.handleStderr()
**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Handle <code>spawn</code> stderr processing</p>  

* * *

<a name="Spawn+run"></a>

### spawn.run() ⇒ <code>promise</code>
**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Run a process with spawn, turn it into a promise</p>  

* * *

<a name="Spawn+kill"></a>

### spawn.kill()
<p>Send a kill signal to the spawned process if it exists.</p>

**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Kill the running process</p>  

* * *

<a name="Spawn+toJSON"></a>

### spawn.toJSON() ⇒ <code>object</code>
**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Convert object to JSON object for <code>JSON.stringify()</code></p>  

* * *

<a name="Spawn._classInit"></a>

### Spawn._classInit()
<p>Class static initialisation</p>

**Kind**: static method of [<code>Spawn</code>](#Spawn)  

* * *

<a name="Spawn.run"></a>

### Spawn.run()
<p>Create a Spawn and run it</p>

**Kind**: static method of [<code>Spawn</code>](#Spawn)  

* * *

