[![Build Status](https://travis-ci.org/HarrySarson/test-repl.svg?branch=master)](https://travis-ci.org/HarrySarson/test-repl)

# test-repl

REPL designed to facilitate testing of packages by disabling caching of required files
and aligning the base directory with the project root.

![screenshot](resources/screenshot.png)

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
