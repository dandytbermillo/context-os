# Context-OS v2.0 🚀

> Intelligent context management system for AI-assisted development

## Overview

Context-OS is a powerful tool that helps developers manage code context efficiently when working with AI assistants like Claude. It provides smart file discovery, compression, and learning capabilities to maximize the effectiveness of limited context windows.

## ✨ What's New in v2.0

- **Fixed Path Handling**: Now uses `process.cwd()` for proper directory resolution
- **Improved Indexing**: Custom scanner properly excludes node_modules (indexes 10 files, not 3000+)
- **Smart Compression**: Reduces token usage by 40-60%
- **Learning System**: Tracks file usage patterns to improve suggestions
- **Fixed Imports**: Updated for latest glob and minimatch packages

## 🚀 Quick Start

```bash
# 1. Clone and enter the context-os directory
git clone <repo>
cd context-os

# 2. Install dependencies
npm install

# 3. Make CLI executable
chmod +x bin/*

# 4. Add to PATH (optional)
export PATH="$PATH:$(pwd)/bin"

# 5. Start using!
context reindex
context load "test"
```

## 📖 Core Commands

### Loading Context
```bash
# Load files matching a pattern
context load "auth"                 # Files containing "auth"
context load "*.js"                # All .js files in root
context load "**/*.ts"             # All TypeScript files recursively
context load "src/**/*"            # Everything in src/

# Save context to file
context load "user service" -o context.md

# Limit tokens
context load "large-feature" --max-tokens 4000
```

### Indexing
```bash
# Reindex files (do this after adding new files)
context reindex

# View statistics
context stats
context stats --detailed
```

### Tracking Usage
```bash
# Track which files were actually useful
# Workflow: load → modify files → track
context load "auth"
# ... make changes to auth files ...
context track -f auth.service.ts auth.controller.ts

# Or let it detect from git
git add .
context track
```

### Knowledge Management
```bash
# Learn from errors/decisions
context learn "Fixed auth bug by adding JWT refresh token rotation"

# Search knowledge base
context search "jwt refresh"

# Extract patterns from current work
context extract
```

## 🏗️ Architecture

```
context-os/
├── bin/                    # CLI executables
│   ├── context            # Main CLI
│   ├── context-index      # Indexing utilities
│   └── context-hook       # Git hooks
├── core/                  # Core modules
│   ├── context-manager.js # Main context logic
│   ├── incremental-indexer.js # Smart file indexing
│   ├── semantic-analyzer.js   # Code understanding
│   ├── usage-tracker.js       # Learning system
│   └── context-compressor.js  # Token optimization
├── cache/                 # Generated indexes (git-ignored)
│   ├── file-index.json   # File metadata cache
│   └── usage-log.json    # Usage patterns
└── config/               # Configuration
    └── settings.json     # User settings
```

## ⚙️ Configuration

Edit `config/settings.json`:

```json
{
  "core": {
    "max_context_tokens": 8000,
    "smart_loading_enabled": true,
    "token_optimization": {
      "enabled": true,
      "compression_threshold": 1000
    }
  }
}
```

## 🚨 Troubleshooting

### "Indexed 3000+ files" Issue
```bash
# Clear cache and reindex
rm -rf cache/*
context reindex
# Should show ~10-50 files, not thousands
```

### Import Errors
Make sure your code uses:
```javascript
const { glob } = require('glob');  // Correct
const { minimatch } = require('minimatch');  // Correct
```

### No Output When Loading
```bash
# Check if files were indexed
context stats
# If 0 files, run from your project root:
cd /your/project
/path/to/context-os/bin/context reindex
```

## 🎯 Best Practices

1. **Run from project root**: Always run Context-OS commands from your project directory
2. **Reindex after changes**: Run `context reindex` after adding new files
3. **Use specific patterns**: `"user service"` is better than `"user"`
4. **Track your work**: Use the load → work → track workflow
5. **Save important contexts**: Use `-o filename.md` for reusable contexts

## 📊 Performance

- **Indexing**: ~50ms for 100 files, ~1s for 1000 files
- **Loading**: 10-50ms for pattern matching and compression
- **Memory**: ~50MB for 10,000 file index
- **Token savings**: 40-60% with compression enabled

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details