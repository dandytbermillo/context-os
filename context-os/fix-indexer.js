#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the current indexer
const indexerPath = path.join(__dirname, 'core/incremental-indexer.js');
let content = fs.readFileSync(indexerPath, 'utf8');

// Replace the glob call with a more restrictive pattern
content = content.replace(
  `const files = await glob('**/*', {`,
  `const files = await glob('*', {`
);

// Also add a more aggressive filter
const filterSection = `
    // Aggressive filtering
    const filteredFiles = files.filter(f => {
      const isNodeModules = f.includes('node_modules');
      const isGit = f.includes('.git');
      const isContextOS = f.startsWith('context-os');
      const isHidden = f.startsWith('.');
      
      return !isNodeModules && !isGit && !isContextOS && !isHidden;
    });
    
    console.log(\`Found \${files.length} files, filtered to \${filteredFiles.length}\`);
    
    for (const filePath of filteredFiles) {`;

content = content.replace(
  'for (const filePath of files) {',
  filterSection
);

// Write the fixed version
fs.writeFileSync(indexerPath, content);
console.log('✅ Fixed indexer with aggressive filtering');