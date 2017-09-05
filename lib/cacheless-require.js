'use strict';

const resolve = require('resolve');


function isNotNodeModule(modulePath) {
  return !modulePath.includes('node_module');
}

/**
 * Create a drop in replacement for the built in require function.
 * Modules will be looked for as if the current directory is the
 * directory specified by `rootpath`.
 *
 * Note passing `{ cache_modules: false }` will cause `require()` to run
 * very slowly so only do this if you need to.
 *
 * @param {string} rootpath Path to resolve modules relative to.
 * @param {object} [options] Customise cacheless require.
 * @param {boolean} [options.ignore_node_module = true] If true, files in `node_modules`
 * are cached, as with normal `require()`.
 *
 * @returns function A function with the same interface as the built in require function.
 *
 * @example
 *
 * let cachelessRequire = require('./lib/cacheless-require')(__dirname);
 *
 * let _ = cachelessRequire('lodash');
 */
module.exports = function createCachelessRequire(rootpath, options) {

  let resolveRelative = filePath => resolve.sync(filePath, {
    basedir: rootpath,
  });

  const shouldDelete = options == null || options.ignore_node_module === true
    ? isNotNodeModule
    : () => true;

  function cachelessRequire(filePath = '') {

    for (const modulePath of Object.keys(require.cache)) {
      // allow modules from npm to be cached.
      if (shouldDelete(modulePath)) {
        delete require.cache[modulePath];
      }
    }

    return require(resolveRelative(filePath));
  }

  cachelessRequire.resolve = resolveRelative;

  return cachelessRequire;
}