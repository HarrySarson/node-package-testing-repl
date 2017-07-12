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

function createCachelessRequire(rootpath) {

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


function main() {

  const packagepath = findUp.sync('package.json');

  let rootpath, packagename;

  if (packagepath == null) {

    console.log(``);
    console.log(`   ** WARNING **`);
    console.log(` \u2022 The package root could not be found.`);
    console.log(` \u2022 If you are attempting to test a node package make sure that there is a`);
    console.log(`   package.json file in your project.`);
    console.log(` \u2022 Try running ${chalk.magenta('npm init')} in the root directory.`);

    rootpath = path.resolve('./');
    packagename = 'unknown-package';
  } else {
    rootpath = path.dirname(packagepath);
    packagename = require(packagepath).name;
  }

  if (path.parse(path.resolve(rootpath, '..')).base === 'node_modules') {

    // get package user probably wants.
    let likelyRootPath = rootpath;

    do {
      likelyRootPath = path.dirname(findUp.sync('package.json', {
        cwd: path.resolve(likelyRootPath, '..'),
      }));
    } while(path.parse(path.resolve(likelyRootPath, '..')).base === 'node_modules')

    const likely_package = require(path.join(likelyRootPath, 'package.json'));

    console.log(``);
    console.log(`   ** WARNING **`);
    console.log(` \u2022 This REPL seems to have been invoked from within node_modules.`);
    console.log(` \u2022 If you intended to test the package: "${chalk.cyan(likely_package.name)}" please navigate`);
    console.log(`   out of the node_modules directory.`);
  }

  console.log(``);
  console.log(` \u2022 Node testing REPL for package: "${chalk.cyan(packagename)}".`);
  console.log(` \u2022 require() will search for modules relative to:`);
  console.log(`     ${chalk.green(rootpath)}`);
  console.log(` \u2022 Caching of modules loaded using require is disabled.`);
  console.log(``);

  let testingRepl = repl.start();

  replHistory(testingRepl, replHistoryFile);

  testingRepl.context.require = createCachelessRequire(rootpath);
}

main();








