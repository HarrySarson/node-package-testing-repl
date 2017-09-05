[![Build Status](https://travis-ci.org/HarrySarson/test-repl.svg?branch=master)](https://travis-ci.org/HarrySarson/test-repl)

# test-repl

REPL designed to facilitate testing of packages by disabling caching of required files
and aligning the base directory with the project root.

Requiring a file from the test repl will reload it from disk preventing you from having
to constantly restart node.

![screenshot](resources/screenshot.png)

### node_modules

Files in node_modules are cached in the same way as for normal calls to require. 
It turns out that there is a reason that node caches modules and re-importing
every script in node_modules incurs a large performance hit.

Version 2 may allow you to configure this behavour.

## Installation

```shell
$ npm install -g  test-repl
```

# Usage

```shell
$ test-repl
```

Use in the same way as running ```$ node```.


### Command History

The history of commands is stored in a text file at `~/.node-test-repl-history`.
