#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

/**
 * Incremental Indexer - Fixed version that properly excludes node_modules
 */
class IncrementalIndexer {
  constructor(contextRoot) {
    this.contextRoot = contextRoot;
    this.indexPath = path.join(contextRoot, 'cache', 'file-index.json');
    this.index = new Map();
    this.projectRoot = path.dirname(contextRoot);
  }
  
  async initialize() {
    await fs.mkdir(path.join(this.contextRoot, 'cache'), { recursive: true });
    await this.loadIndex();
  }
  
  async loadIndex() {
    try {
      const data = await fs.readFile(this.indexPath, 'utf8');
      const parsed = JSON.parse(data);
      this.index = new Map(Object.entries(parsed));
    } catch (e) {
      // Index doesn't exist yet
      this.index = new Map();
    }
  }
  
  async saveIndex() {
    const obj = Object.fromEntries(this.index);
    await fs.writeFile(this.indexPath, JSON.stringify(obj, null, 2));
  }
  
  async hasGit() {
    try {
      execSync('git rev-parse --git-dir', { cwd: this.projectRoot, stdio: 'pipe' });
      return true;
    } catch (e) {
      return false;
    }
  }
  
  async updateIndex() {
    if (await this.hasGit()) {
      return this.gitBasedUpdate();
    } else {
      await this.fullScan();
      await this.saveIndex();
      return { updates: Array.from(this.index.keys()), deletions: [] };
    }
  }
  
  async gitBasedUpdate() {
    try {
      // Get all tracked files
      const gitFiles = execSync('git ls-files -s', { 
        encoding: 'utf8',
        cwd: this.projectRoot 
      }).trim().split('\n').filter(Boolean).map(line => {
        const parts = line.split('\t');
        return {
          hash: parts[0].split(' ')[1],
          path: parts[1]
        };
      });
      
      const updates = [];
      const deletions = [];
      
      // Check for updates
      for (const file of gitFiles) {
        const existing = this.index.get(file.path);
        if (!existing || existing.hash !== file.hash) {
          try {
            const fullPath = path.join(this.projectRoot, file.path);
            const content = await fs.readFile(fullPath, 'utf8');
            
            const metadata = {
              hash: file.hash,
              size: content.length,
              modified: new Date().toISOString(),
              tokens: this.estimateTokens(content),
              lines: content.split('\n').length,
              extension: path.extname(file.path),
              language: this.detectLanguage(file.path),
              hasTests: this.hasTests(file.path, content),
              complexity: this.estimateComplexity(content, file.path)
            };
            
            this.index.set(file.path, metadata);
            updates.push(file.path);
          } catch (e) {
            console.error(`Error indexing ${file.path}:`, e.message);
          }
        }
      }
      
      // Check for deleted files
      const gitFilePaths = new Set(gitFiles.map(f => f.path));
      for (const [filePath] of this.index) {
        if (!gitFilePaths.has(filePath)) {
          this.index.delete(filePath);
          deletions.push(filePath);
        }
      }
      
      await this.saveIndex();
      console.log(`📍 Index updated: ${updates.length} files updated, ${deletions.length} deleted`);
      
      return { updates, deletions };
    } catch (e) {
      // Not a git repository or git not available
      console.warn('Git not available, falling back to file system scan');
      await this.fullScan();
      await this.saveIndex();
      return { updates: Array.from(this.index.keys()), deletions: [] };
    }
  }
  
  /**
   * Full file system scan - FIXED to properly exclude directories
   */
  async fullScan() {
    const updates = [];
    
    // Custom recursive file finder that properly excludes directories
    const findFiles = async (dir, relativePath = '') => {
      const files = [];
      
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relPath = relativePath ? path.join(relativePath, entry.name) : entry.name;
          
          // Skip excluded directories
          if (entry.isDirectory()) {
            if (entry.name === 'node_modules' ||
                entry.name === '.git' ||
                entry.name === 'dist' ||
                entry.name === 'build' ||
                entry.name === '.next' ||
                entry.name === 'coverage' ||
                (relativePath === '' && entry.name === 'context-os')) {
              continue;
            }
            // Recursively search subdirectories
            const subFiles = await findFiles(fullPath, relPath);
            files.push(...subFiles);
          } else if (entry.isFile()) {
            // Skip certain files
            if (!entry.name.endsWith('.log') &&
                !entry.name.startsWith('.DS_Store') &&
                !relPath.includes('cache/')) {
              files.push(relPath);
            }
          }
        }
      } catch (e) {
        // Skip directories we can't read
      }
      
      return files;
    };
    
    const files = await findFiles(this.projectRoot);
    console.log(`Found ${files.length} files to index`);
    
    for (const filePath of files) {
      try {
        const fullPath = path.join(this.projectRoot, filePath);
        const content = await fs.readFile(fullPath, 'utf8');
        const stats = await fs.stat(fullPath);
        const hash = crypto.createHash('sha1').update(content).digest('hex');
        
        const existing = this.index.get(filePath);
        if (!existing || existing.hash !== hash) {
          const metadata = {
            hash,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            tokens: this.estimateTokens(content),
            lines: content.split('\n').length,
            extension: path.extname(filePath),
            language: this.detectLanguage(filePath),
            hasTests: this.hasTests(filePath, content),
            complexity: this.estimateComplexity(content, filePath)
          };
          
          this.index.set(filePath, metadata);
          updates.push(filePath);
        }
      } catch (e) {
        // Skip files we can't read
      }
    }
    
    if (updates.length > 0) {
      await this.saveIndex();
    }
    
    return { updates, deletions: [] };
  }
  
  /**
   * Query index with pattern and token budget
   */
  async queryIndex(pattern, tokenBudget) {
    await this.updateIndex();
    
    const matches = [];
    for (const [filePath, metadata] of this.index) {
      if (this.matchesPattern(filePath, pattern)) {
        matches.push({ path: filePath, ...metadata });
      }
    }
    
    // Score and sort by relevance
    const scored = matches.map(file => ({
      ...file,
      score: this.calculateRelevanceScore(file, pattern)
    }));
    
    scored.sort((a, b) => b.score - a.score);
    
    // Select files within token budget
    const selected = [];
    let tokens = 0;
    
    for (const file of scored) {
      if (tokens + file.tokens <= tokenBudget) {
        selected.push(file);
        tokens += file.tokens;
      } else if (file.tokens < tokenBudget * 0.1) {
        // Include small files even if slightly over budget
        selected.push(file);
        break;
      }
    }
    
    return { files: selected, totalTokens: tokens };
  }
  
  matchesPattern(filePath, pattern) {
    if (typeof pattern === 'string') {
      // Simple string match
      if (pattern.includes('*') || pattern.includes('?')) {
        // Very simple wildcard matching
        const regex = pattern
          .replace(/[.+^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*')
          .replace(/\?/g, '.');
        return new RegExp(regex).test(filePath);
      }
      return filePath.includes(pattern);
    } else if (Array.isArray(pattern)) {
      return pattern.some(p => this.matchesPattern(filePath, p));
    }
    return false;
  }
  
  calculateRelevanceScore(file, pattern) {
    let score = 0;
    
    // Exact match bonus
    if (file.path === pattern) score += 100;
    
    // Filename match bonus
    const filename = path.basename(file.path);
    if (filename.includes(pattern)) score += 50;
    
    // Directory match bonus
    const dir = path.dirname(file.path);
    if (dir.includes(pattern)) score += 20;
    
    // Extension relevance
    if (pattern.includes(file.extension)) score += 10;
    
    // Test file bonus if searching for tests
    if (pattern.includes('test') && file.hasTests) score += 30;
    
    // Complexity penalty (prefer simpler files)
    score -= file.complexity * 0.5;
    
    return score;
  }
  
  estimateTokens(content) {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(content.length / 4);
  }
  
  detectLanguage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const langMap = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.go': 'go',
      '.rs': 'rust',
      '.php': 'php',
      '.rb': 'ruby',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.scala': 'scala',
      '.r': 'r',
      '.m': 'matlab',
      '.jl': 'julia',
      '.sh': 'bash',
      '.ps1': 'powershell',
      '.md': 'markdown',
      '.json': 'json',
      '.xml': 'xml',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.toml': 'toml',
      '.ini': 'ini',
      '.cfg': 'config',
      '.conf': 'config',
      '.sql': 'sql',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.sass': 'sass',
      '.less': 'less'
    };
    
    return langMap[ext] || 'unknown';
  }
  
  hasTests(filePath, content) {
    const testIndicators = [
      'test', 'spec', '__tests__', 'describe(', 'it(', 
      'test(', 'expect(', 'assert', 'should'
    ];
    
    const lowerPath = filePath.toLowerCase();
    const lowerContent = content.toLowerCase();
    
    return testIndicators.some(indicator => 
      lowerPath.includes(indicator) || lowerContent.includes(indicator)
    );
  }
  
  estimateComplexity(content, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.js', '.jsx', '.ts', '.tsx', '.py', '.java'].includes(ext)) {
      return 0;
    }
    
    const lines = content.split('\n');
    const codeLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('#');
    }).length;
    
    // Count complexity indicators
    const complexityIndicators = [
      /if\s*\(/g,
      /else\s*{/g,
      /for\s*\(/g,
      /while\s*\(/g,
      /switch\s*\(/g,
      /catch\s*\(/g,
      /=>/g,
      /function\s+\w+/g,
      /class\s+\w+/g
    ];
    
    let complexity = 0;
    complexityIndicators.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) complexity += matches.length;
    });
    
    // Normalize by lines of code
    return codeLines > 0 ? complexity / codeLines : 0;
  }
  
  getStats() {
    const stats = {
      totalFiles: this.index.size,
      totalTokens: 0,
      byLanguage: {}
    };
    
    for (const [, metadata] of this.index) {
      stats.totalTokens += metadata.tokens;
      
      const lang = metadata.language;
      if (!stats.byLanguage[lang]) {
        stats.byLanguage[lang] = { count: 0, tokens: 0 };
      }
      stats.byLanguage[lang].count++;
      stats.byLanguage[lang].tokens += metadata.tokens;
    }
    
    return stats;
  }
}

module.exports = { IncrementalIndexer };