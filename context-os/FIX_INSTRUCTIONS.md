# Context-OS Fix Instructions

The error is caused by the `glob` package API changes. Here's how to fix it:

## Quick Fix Commands

Run these commands in your resume-database directory:

```bash
# 1. First, ensure glob is installed in context-os
cd context-os
npm install glob@latest
cd ..

# 2. Apply the fixes manually (copy these exact changes):
```

### Fix 1: Edit `context-os/core/incremental-indexer.js`

Around line 123, change:
```javascript
// OLD:
const glob = require('glob');

// NEW:
const { glob } = require('glob');
```

### Fix 2: Edit `context-os/core/context-manager.js`

Around line 192-198, replace the entire glob section:

```javascript
// OLD:
const glob = require('glob');
return new Promise((resolve, reject) => {
  glob(pattern, { cwd: this.projectRoot, ignore: '**/node_modules/**' }, (err, files) => {
    if (err) reject(err);
    else resolve(files.map(f => path.join(this.projectRoot, f)));
  });
});

// NEW:
const { glob } = require('glob');
try {
  const files = await glob(pattern, { 
    cwd: this.projectRoot, 
    ignore: '**/node_modules/**' 
  });
  return files.map(f => path.join(this.projectRoot, f));
} catch (err) {
  throw err;
}
```

## After applying fixes:

```bash
# Test it works
./context-os/bin/context reindex
```

You should see successful indexing output!