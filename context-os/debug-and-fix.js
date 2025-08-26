#!/usr/bin/env node

const path = require('path');
const fs = require('fs').promises;

async function debugAndFix() {
  const contextRoot = path.join(process.cwd(), 'context-os');
  const indexPath = path.join(contextRoot, 'cache', 'file-index.json');
  
  console.log('🔍 Debugging Context-OS...\n');
  console.log('Current directory:', process.cwd());
  console.log('Context root:', contextRoot);
  console.log('Index path:', indexPath);
  
  // Check if index exists
  try {
    const indexContent = await fs.readFile(indexPath, 'utf8');
    const index = JSON.parse(indexContent);
    console.log('\nIndex exists with', Object.keys(index).length, 'files');
    if (Object.keys(index).length === 0) {
      console.log('⚠️  Index is empty!');
    }
  } catch (e) {
    console.log('\n⚠️  No index file found');
  }
  
  // List actual files in project
  console.log('\n📁 Files in project root:');
  const files = await fs.readdir(process.cwd());
  const jsFiles = files.filter(f => f.endsWith('.js'));
  console.log('JavaScript files:', jsFiles);
  
  // Force reindex with debug output
  console.log('\n🔧 Running indexer directly...');
  const { IncrementalIndexer } = require('./context-os/core/incremental-indexer');
  const indexer = new IncrementalIndexer(contextRoot);
  
  await indexer.initialize();
  console.log('Indexer initialized');
  console.log('Project root:', indexer.projectRoot);
  
  // Do a full scan
  console.log('\n📊 Running full scan...');
  const result = await indexer.fullScan();
  console.log('Scan complete:', result);
  
  // Check index again
  const newIndex = await fs.readFile(indexPath, 'utf8');
  const parsedIndex = JSON.parse(newIndex);
  console.log('\n✅ New index has', Object.keys(parsedIndex).length, 'files');
  
  if (Object.keys(parsedIndex).length > 0) {
    console.log('\nSample files in index:');
    Object.keys(parsedIndex).slice(0, 5).forEach(file => {
      console.log('  -', file);
    });
  }
}

debugAndFix().catch(console.error);