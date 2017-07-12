#!/usr/bin/env node

'use strict';

const os            = require('os')
    , path          = require('path')
    , repl          = require('repl')
    
    , chalk         = require('chalk')
    , findUp        = require('find-up')
    , replHistory   = require('repl.history')
    ;

const replHistoryFile = path.join(os.homedir(), '.node-test-repl-history');
  
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

function main() {

  const packagepath = findUp.sync('package.json');
  const rootpath = path.dirname(packagepath);
  const pckg = require(packagepath);

  console.log(``);
  console.log(` \u2022 Node Testing Repl for package: "${chalk.cyan(pckg.name)}".`);
  console.log(` \u2022 require() will search for modules relative to:`);
  console.log(`     ${chalk.green(rootpath)}`);
  console.log(` \u2022 Caching of modules loaded using require is disabled.`);
  console.log(``);

  if (path.parse(path.resolve(rootpath, '..')).base === 'node_modules') {
    
    // get package user probably wants.
    let likelyRootPath = rootpath;
    
    do {
      likelyRootPath = path.dirname(findUp.sync('package.json', {
        cwd: path.resolve(likelyRootPath, '..'),
      }));
    } while(path.parse(path.resolve(likelyRootPath, '..')).base === 'node_modules')
    
    const likely_package = require(path.join(likelyRootPath, 'package.json'));
    
    console.warn(`   ** WARNING **`);
    console.warn(` \u2022 This repl seems to have been invoked from within node_modules.`);
    console.warn(` \u2022 If you intended to test the package: "${chalk.cyan(likely_package.name)}" please navigate`);
    console.warn(`   out of the node_modules directory.`);
    console.log(``);
  }
    

  let testingRepl = repl.start();

  replHistory(testingRepl, replHistoryFile);

  testingRepl.context.require = cachelessRequire;
}

main();








