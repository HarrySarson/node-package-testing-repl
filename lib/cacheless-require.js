'use strict';

const resolve = require('resolve');


/**
 * Create a drop in replacement for the built in require function.
 * Modules will be looked for as if the current directory is the
 * directory specified by `rootpath`.
 *
 * @param String rootpath Path to resolve modules relative to.
 * @returns function A function with the same interface as the built in require function.
 *
 * @example
 *
 * let cachelessRequire = require('./lib/cacheless-require')(__dirname);
 *
 * let _ = cachelessRequire('lodash');
 */
module.exports = function createCachelessRequire(rootpath) {

  let resolveRelative = filePath => resolve.sync(filePath, {
    basedir: rootpath,
  });

  function cachelessRequire(filePath = '') {

    for (const modulePath : Object.keys(require.cache)) {
      delete require.cache[modulePath];
    }

    return require(resolveRelative(filePath));
  }

  cachelessRequire.resolve = resolveRelative;

  return cachelessRequire;
}