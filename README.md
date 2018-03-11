Spawn - @mhio/spawn
----------

Spawn a process

## Install

```
yarn add @mhio/spawn
npm install @mhio/spawn
```

## Usage

[API Docs](doc/API.md)

```
import { Job } from '@mhio/spawn'

let proc = Spawn.run([ 'printf', '%s\n%s\n', 'one', 'two' ], {})
```
