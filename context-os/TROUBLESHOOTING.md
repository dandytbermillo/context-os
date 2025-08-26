# Context-OS Troubleshooting Guide 🔧

This guide covers common issues and their solutions based on real debugging experiences.

## 🚨 Common Issues

### 1. Indexing Thousands of Files (node_modules)

**Symptom**: 
```
✓ Indexed 3927 files in 932ms
✓ Total tokens: 19,161,480
```

**Cause**: The indexer is including node_modules directories.

**Solution**:
1. Clear cache and use the fixed indexer:
```bash
rm -rf context-os/cache/*
./context-os/bin/context reindex
```

2. Verify proper exclusion in `incremental-indexer.js`:
```javascript
// Should have this check
if (filePath.includes('node_modules') || 
    filePath.includes('.git') ||
    filePath.includes('context-os/cache')) {
  continue;
}
```

3. Expected result:
```
Found 8 files to index
✓ Indexed 8 files in 3ms
✓ Total tokens: 9,596
```

### 2. Module Import Errors

**Symptom**: 
```
TypeError: glob is not a function
TypeError: minimatch is not a function
TypeError: IncrementalIndexer is not a constructor
```

**Solution**: Fix the import statements:

```javascript
// ❌ Wrong
const glob = require('glob');
const minimatch = require('minimatch');
const IncrementalIndexer = require('./incremental-indexer');

// ✅ Correct
const { glob } = require('glob');
const { minimatch } = require('minimatch');
const { IncrementalIndexer } = require('./incremental-indexer');
```

### 3. Path Resolution Issues

**Symptom**: Context-OS looks in wrong directory for files.

**Original Problem**:
```javascript
// This assumes context-os is 2 levels deep in project
const PROJECT_ROOT = path.resolve(CONTEXT_OS_ROOT, '../..');
```

**Solution**:
```javascript
// Use current working directory
const PROJECT_ROOT = process.cwd();
```

### 4. No Output When Loading Files

**Symptom**: Command runs but shows no output.

**Causes & Solutions**:

1. **No files indexed**:
```bash
./context-os/bin/context stats
# If shows 0 files, reindex:
./context-os/bin/context reindex
```

2. **Wrong working directory**:
```bash
pwd  # Should be your project root
cd /your/project
./context-os/bin/context load "test"
```

3. **Pattern not matching**:
```bash
# Try broader pattern
./context-os/bin/context load "*"
# Or specific file
./context-os/bin/context load "test.js"
```

### 5. Git-related Errors

**Symptom**: 
```
fatal: not a git repository (or any of the parent directories): .git
fatal: ambiguous argument 'HEAD~1': unknown revision
```

**Solution**: These are just warnings. Context-OS falls back to file system scanning. To fix:

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"
```

### 6. Tracking Shows "0 useful files"

**Symptom**: 
```
📊 Usage tracked: 0 useful files, 4 wasted
```

**Cause**: Not following the correct workflow.

**Solution**: Use the proper sequence:
```bash
# 1. Load files FIRST
./context-os/bin/context load "test"

# 2. Make changes to files
echo "// changes" >> test.js

# 3. Track AFTER changes
./context-os/bin/context track -f test.js
```

### 7. Semantic Analyzer Errors

**Symptom**: 
```
TypeError: analysis.dependencies is not iterable
```

**Solution**: Add safety checks:
```javascript
// Fix in semantic-analyzer.js
for (const dep of (analysis.dependencies || [])) {
  // ...
}
```

## 🔍 Debugging Tools

### Enable Debug Output

Add console.log statements to trace issues:

```javascript
// In incremental-indexer.js
console.log(`Found ${files.length} files to index`);
console.log('Project root:', this.projectRoot);
```

### Check Cache Contents

```bash
# See what's in the index
cat context-os/cache/file-index.json | jq 'keys[:10]'

# Check usage patterns
cat context-os/cache/usage-patterns.json

# View last context
cat context-os/cache/last-context.json
```

### Manual Testing

Test individual components:

```javascript
// Test indexer directly
node -e "
const { IncrementalIndexer } = require('./context-os/core/incremental-indexer');
const indexer = new IncrementalIndexer('./context-os');
indexer.fullScan().then(r => console.log('Files:', r.updates.length));
"
```

## 🛠️ Complete Reset

If all else fails, do a complete reset:

```bash
# 1. Remove Context-OS
rm -rf context-os

# 2. Get fresh copy
cp -r /path/to/clean/context-os .

# 3. Apply all fixes
cd context-os

# Fix imports
sed -i '' 's/const { glob } = require/const { glob } = require/' core/*.js
sed -i '' 's/const { minimatch } = require/const { minimatch } = require/' core/*.js

# Fix paths
sed -i '' 's/path.resolve(CONTEXT_OS_ROOT, '\''..\/..'\'')/process.cwd()/' bin/*

# 4. Install and test
npm install
cd ..
chmod +x context-os/bin/*
./context-os/bin/context reindex
```

## 💡 Prevention Tips

1. **Always run from project root**: Not from inside context-os/
2. **Check stats after reindex**: Should show reasonable file count
3. **Use .gitignore**: Helps Context-OS know what to exclude
4. **Regular cache cleanup**: `rm -rf context-os/cache/*` if issues arise
5. **Keep Context-OS updated**: Pull latest fixes regularly

## 📞 Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/context-os/context-os/issues)
2. Run with debug output and include in bug report
3. Include your:
   - Node.js version: `node --version`
   - Operating system: `uname -a`
   - Context-OS version: `cat context-os/package.json | grep version`
   - Error messages and steps to reproduce

## 🎯 Quick Fixes Reference

| Issue | Quick Fix |
|-------|-----------|
| Too many files indexed | `rm -rf context-os/cache/* && ./context-os/bin/context reindex` |
| Import errors | Update to `const { ModuleName } = require('...')` |
| No output | Check working directory with `pwd` |
| Git errors | Just warnings, ignore or `git init` |
| Path issues | Ensure running from project root |

Remember: Most issues are related to paths, imports, or cache. When in doubt, clear cache and reindex!