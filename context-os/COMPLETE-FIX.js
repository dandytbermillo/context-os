#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Applying complete Context-OS fix...\n');

// Fix 1: Update glob usage in incremental-indexer.js
const indexerFile = path.join(__dirname, 'core/incremental-indexer.js');
let indexerContent = fs.readFileSync(indexerFile, 'utf8');

// Fix the glob promise in fullScan
indexerContent = indexerContent.replace(
  `const files = await new Promise((resolve, reject) => {
      glob('**/*', {
        cwd: this.projectRoot,
        nodir: true,
        ignore: [
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/build/**',
          '**/.next/**',
          '**/coverage/**'
        ]
      }, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });`,
  `const files = await glob('**/*', {
      cwd: this.projectRoot,
      nodir: true,
      ignore: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/coverage/**',
        '**/context-os/**'
      ]
    });`
);

fs.writeFileSync(indexerFile, indexerContent);
console.log('✅ Fixed incremental-indexer.js glob usage');

// Fix 2: Ensure saveIndex is called
const saveIndexCheck = `
  async updateIndex() {
    if (await this.hasGit()) {
      return this.gitBasedUpdate();
    } else {
      await this.fullScan();
      await this.saveIndex(); // Make sure this is called
    }
  }`;

if (!indexerContent.includes('await this.saveIndex()')) {
  indexerContent = fs.readFileSync(indexerFile, 'utf8');
  indexerContent = indexerContent.replace(
    /async updateIndex\(\) \{[\s\S]*?\}/,
    saveIndexCheck.trim()
  );
  fs.writeFileSync(indexerFile, indexerContent);
  console.log('✅ Fixed updateIndex to ensure saveIndex is called');
}

console.log('\n🎉 All fixes applied!');
console.log('\nNow run these commands in your project:');
console.log('  rm -rf context-os/cache/*');
console.log('  ./context-os/bin/context reindex');
console.log('  ./context-os/bin/context load "test"');