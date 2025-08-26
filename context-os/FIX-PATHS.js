#!/usr/bin/env node

// Quick script to fix Context-OS paths for the current project
const fs = require('fs');
const path = require('path');

// Fix bin/context
const contextFile = path.join(__dirname, 'bin/context');
let content = fs.readFileSync(contextFile, 'utf8');
content = content.replace(
  "const PROJECT_ROOT = path.resolve(CONTEXT_OS_ROOT, '..');",
  "const PROJECT_ROOT = process.cwd();"
);
fs.writeFileSync(contextFile, content);
console.log('✅ Fixed bin/context');

// Fix other bin files
const binFiles = ['context-index', 'context-hook'];
binFiles.forEach(file => {
  const filePath = path.join(__dirname, 'bin', file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    "const PROJECT_ROOT = path.resolve(CONTEXT_OS_ROOT, '..');",
    "const PROJECT_ROOT = process.cwd();"
  );
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed bin/${file}`);
});

// Fix context-loader.js
const loaderFile = path.join(__dirname, 'context-loader.js');
content = fs.readFileSync(loaderFile, 'utf8');
content = content.replace(
  "const PROJECT_ROOT = path.resolve(CONTEXT_OS_ROOT, '..');",
  "const PROJECT_ROOT = process.cwd();"
);
fs.writeFileSync(loaderFile, content);
console.log('✅ Fixed context-loader.js');

console.log('\n🎉 Context-OS paths fixed! Now it will work in any directory.');
console.log('Run from your project directory: ./context-os/bin/context reindex');