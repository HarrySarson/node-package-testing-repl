'use strict';

const path = require('path')
,     promisify = require('util.promisify')
,     fs = require('fs');


const expect = require('chai').expect
,     findUp = require('find-up')
,     tmp = require('tmp-promise')
;

const rootPath = path.dirname(findUp.sync('package.json'))
,     resourcesPath = path.join(rootPath, 'test', 'resources')
,     examplePackageRoot = path.join(resourcesPath, 'fake-package-directory')
,     [writeFile, readFile, unlink] = ['writeFile', 'readFile', 'unlink'].map(fnName => promisify(fs[fnName]))
;

const createCachelessRequire = require(path.join(rootPath, 'lib/cacheless-require'));

describe('cacheless-require', function() {
  describe('factory', function() {
    it('should return a function', function() {
      expect(createCachelessRequire(rootPath)).to.be.a('function');
    });
    
    it('should correctly resolve modules relative to `rootPath`', function() {
      
      const cachelessRequire = createCachelessRequire(examplePackageRoot);
      
      expect(cachelessRequire('./lib/library-file')).to.equal('library-file');      
      
    });
    
    it('should not cache modules', async function() {
      
      const cachelessRequire = createCachelessRequire(examplePackageRoot);

      const filePath = await tmp.tmpName();
      
      await writeFile(filePath, await readFile(path.join(resourcesPath, 'module-1.js')));
      
      expect(cachelessRequire(filePath)).to.equal('module-1'); 
      
      await writeFile(filePath, await readFile(path.join(resourcesPath, 'module-2.js')));
      
      expect(cachelessRequire(filePath)).to.equal('module-2'); 
      
      await unlink(filePath);      

    });
    
    it('should expose the resolve function', function() {
      
      expect(createCachelessRequire(rootPath).resolve).to.be.a('function');      
      
    });
  });
});