## Classes

<dl>
<dt><a href="#SpawnException">SpawnException</a> ⇐ <code>Exception</code></dt>
<dd><p>SpawnException for wrapping any Error objects raised in Spawn</p></dd>
<dt><a href="#Spawn">Spawn</a></dt>
<dd><p>Spawn a command</p></dd>
</dl>

## Objects

<dl>
<dt><a href="#Spawn">Spawn</a> : <code>object</code></dt>
<dd><p>Class static initialisation</p></dd>
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
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timeout_in | <code>Number</code> | <p>Milliseconds to timeout from run time</p> |
| timeout_at | <code>Number</code> | <p>Milliseconds timestamp to timeout at</p> |
| run_cb | <code>function</code> | <p>Callback to run on spawn process run</p> |
| stdout_cb | <code>function</code> | <p>Callback to run on stdout data</p> |
| stderr_cb | <code>function</code> | <p>Callback to run on stderr data</p> |
| close_cb | <code>function</code> | <p>Callback to run on spawn process close</p> |
| error_cb | <code>function</code> | <p>Callback to run on spawn process error</p> |


* [Spawn](#Spawn)
    * [new Spawn(opts)](#new_Spawn_new)
    * _instance_
        * [.handleRunCallback()](#Spawn+handleRunCallback)
        * [.handleStdout()](#Spawn+handleStdout)
        * [.handleStderr()](#Spawn+handleStderr)
        * [.run()](#Spawn+run) ⇒ <code>Promise</code>
        * [.kill()](#Spawn+kill)
        * [.toJSON()](#Spawn+toJSON) ⇒ <code>Object</code>
    * _static_
        * [.run(command, opts)](#Spawn.run)


* * *

<a name="new_Spawn_new"></a>

### new Spawn(opts)
<p>Represents a process to be spawned.</p>


| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> |  |
| opts.command | <code>Number</code> | <p>Command and arguments array</p> |
| opts.timeout_in | <code>Number</code> | <p>Milliseconds to time out the process in</p> |
| opts.timeout_at | <code>Number</code> | <p>Millisecond timestamp to time out the process at</p> |
| opts.run_cb | <code>function</code> | <p>Callback to run on spawn process run</p> |
| opts.stdout_cb | <code>function</code> | <p>Callback to run on stdout data</p> |
| opts.stderr_cb | <code>function</code> | <p>Callback to run on stderr data</p> |
| opts.close_cb | <code>function</code> | <p>Callback to run on spawn process close</p> |
| opts.error_cb | <code>function</code> | <p>Callback to run on spawn process error</p> |
| opts.ignore_exit_code | <code>Boolean</code> | <p>Ignore exit code checks</p> |
| opts.expected_exit_code | <code>Number</code> | <p>Expect an exit code other than 0</p> |


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

### spawn.run() ⇒ <code>Promise</code>
**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Run a process with <code>child_process.spawn</code>, turn it into a promise</p>  

* * *

<a name="Spawn+kill"></a>

### spawn.kill()
<p>Send a kill signal to the spawned process if it exists.</p>

**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Kill the running process</p>  

* * *

<a name="Spawn+toJSON"></a>

### spawn.toJSON() ⇒ <code>Object</code>
**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Convert object to JSON object for <code>JSON.stringify()</code></p>  

* * *

<a name="Spawn.run"></a>

### Spawn.run(command, opts)
<p>Create a Spawn and run it</p>

**Kind**: static method of [<code>Spawn</code>](#Spawn)  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>array</code> | <p>Array of argv to run</p> |
| opts | <code>Object</code> | <p>Spawn options, see [Spawn#constructor](Spawn#constructor)</p> |


* * *

<a name="Spawn"></a>

## Spawn : <code>object</code>
<p>Class static initialisation</p>

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ms_minute | <code>Number</code> | <p>A minute of time in milliseconds</p> |
| ms_hour | <code>Number</code> | <p>An hour of time in milliseconds</p> |
| ms_day | <code>Number</code> | <p>A day of time in milliseconds</p> |


* [Spawn](#Spawn) : <code>object</code>
    * [new Spawn(opts)](#new_Spawn_new)
    * _instance_
        * [.handleRunCallback()](#Spawn+handleRunCallback)
        * [.handleStdout()](#Spawn+handleStdout)
        * [.handleStderr()](#Spawn+handleStderr)
        * [.run()](#Spawn+run) ⇒ <code>Promise</code>
        * [.kill()](#Spawn+kill)
        * [.toJSON()](#Spawn+toJSON) ⇒ <code>Object</code>
    * _static_
        * [.run(command, opts)](#Spawn.run)


* * *

<a name="new_Spawn_new"></a>

### new Spawn(opts)
<p>Represents a process to be spawned.</p>


| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> |  |
| opts.command | <code>Number</code> | <p>Command and arguments array</p> |
| opts.timeout_in | <code>Number</code> | <p>Milliseconds to time out the process in</p> |
| opts.timeout_at | <code>Number</code> | <p>Millisecond timestamp to time out the process at</p> |
| opts.run_cb | <code>function</code> | <p>Callback to run on spawn process run</p> |
| opts.stdout_cb | <code>function</code> | <p>Callback to run on stdout data</p> |
| opts.stderr_cb | <code>function</code> | <p>Callback to run on stderr data</p> |
| opts.close_cb | <code>function</code> | <p>Callback to run on spawn process close</p> |
| opts.error_cb | <code>function</code> | <p>Callback to run on spawn process error</p> |
| opts.ignore_exit_code | <code>Boolean</code> | <p>Ignore exit code checks</p> |
| opts.expected_exit_code | <code>Number</code> | <p>Expect an exit code other than 0</p> |


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

### spawn.run() ⇒ <code>Promise</code>
**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Run a process with <code>child_process.spawn</code>, turn it into a promise</p>  

* * *

<a name="Spawn+kill"></a>

### spawn.kill()
<p>Send a kill signal to the spawned process if it exists.</p>

**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Kill the running process</p>  

* * *

<a name="Spawn+toJSON"></a>

### spawn.toJSON() ⇒ <code>Object</code>
**Kind**: instance method of [<code>Spawn</code>](#Spawn)  
**Summary**: <p>Convert object to JSON object for <code>JSON.stringify()</code></p>  

* * *

<a name="Spawn.run"></a>

### Spawn.run(command, opts)
<p>Create a Spawn and run it</p>

**Kind**: static method of [<code>Spawn</code>](#Spawn)  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>array</code> | <p>Array of argv to run</p> |
| opts | <code>Object</code> | <p>Spawn options, see [Spawn#constructor](Spawn#constructor)</p> |


* * *

