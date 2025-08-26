# Context-OS Quick Start Guide 🚀

Get up and running with Context-OS in 5 minutes!

## Prerequisites

- Node.js 14+ installed
- Git (optional but recommended)
- A project directory with some code files

## Installation

```bash
# 1. Copy Context-OS to your project
cp -r /path/to/context-os /your/project/context-os

# 2. Install dependencies
cd /your/project/context-os
npm install

# 3. Go back to your project root
cd ..

# 4. Make Context-OS executable
chmod +x context-os/bin/*
```

## First Run

```bash
# 1. Index your project files
./context-os/bin/context reindex

# You should see something like:
# 🔄 Rebuilding file index...
# Found 12 files to index
# ✓ Indexed 12 files in 15ms
# ✓ Total tokens: 15,234

# 2. View what was indexed
./context-os/bin/context stats

# 3. Load your first context
./context-os/bin/context load "test"
```

## Basic Usage

### Find and Load Code

```bash
# Load all test files
./context-os/bin/context load "test"

# Load all JavaScript files
./context-os/bin/context load "*.js"

# Load everything in src folder
./context-os/bin/context load "src/**/*"

# Save context for AI/Claude
./context-os/bin/context load "auth" -o auth-context.md
```

### Track Your Work

Context-OS learns from your development patterns:

```bash
# 1. Load files you'll work on
./context-os/bin/context load "user service"

# 2. Make your changes
# ... edit user.service.ts, user.controller.ts ...

# 3. Tell Context-OS which files were useful
./context-os/bin/context track -f src/services/user.service.ts src/controllers/user.controller.ts
```

### Learn from Experience

```bash
# Document solutions
./context-os/bin/context learn "Fixed auth timeout by increasing JWT expiry to 7d"

# Search your knowledge
./context-os/bin/context search "jwt timeout"
```

## 🎯 Practical Examples

### Example 1: Working on Authentication

```bash
# Load all auth-related files
./context-os/bin/context load "auth"

# After implementing, save context for documentation
./context-os/bin/context load "auth" -o docs/auth-implementation.md

# Track files you modified
./context-os/bin/context track -f src/auth/auth.service.ts src/auth/auth.guard.ts
```

### Example 2: Debugging an Issue

```bash
# Find all error handling code
./context-os/bin/context load "error handler catch"

# After fixing, document the solution
./context-os/bin/context learn "Database connection errors were due to pool size limits"
```

### Example 3: Code Review Prep

```bash
# Get all changed files
git status --porcelain | awk '{print $2}' > changed-files.txt

# Load context for review
./context-os/bin/context load "$(cat changed-files.txt | tr '\n' ' ')"
```

## ⚡ Performance Tips

1. **Exclude large directories**: Add them to .gitignore
2. **Use specific patterns**: More specific = faster loading
3. **Regular reindexing**: Only when adding new files
4. **Token limits**: Use `--max-tokens` for large codebases

## 🚨 Common Issues

### No files found?
```bash
# Check you're in the right directory
pwd
# Should be your project root, not inside context-os/

# Verify files were indexed
./context-os/bin/context stats
```

### Too many files indexed?
```bash
# Clear cache and reindex
rm -rf context-os/cache/*
./context-os/bin/context reindex
# Should show 10-100 files, not thousands
```

### Permission denied?
```bash
chmod +x context-os/bin/*
```

## 🎉 Next Steps

1. **Customize settings**: Edit `context-os/config/settings.json`
2. **Set up git hooks**: For automatic tracking
3. **Explore advanced features**: Semantic search, compression, learning
4. **Build your knowledge base**: Use `learn` command regularly

## 📚 Full Documentation

See [README.md](README.md) for complete documentation and advanced features.

## 💡 Pro Tip

Add this alias to your shell:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias ctx='/your/project/context-os/bin/context'

# Now use:
ctx load "test"
ctx stats
```

Happy coding with Context-OS! 🚀