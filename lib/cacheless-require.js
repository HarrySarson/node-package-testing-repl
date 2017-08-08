const path = require('path');


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

  function cachelessRequire(filePath = '') {
    let modulePath;

    if (filePath.startsWith('/')
     || filePath.startsWith('./')
     || filePath.startsWith('../')
     ) {

      let basepath = path.resolve(rootpath, filePath);
      modulePath = require.resolve(basepath);
    } else {
      modulePath = filePath;
    }

    delete require.cache[modulePath];
    return require(modulePath);
  }

  cachelessRequire.resolve = require.resolve;
  return cachelessRequire;
}