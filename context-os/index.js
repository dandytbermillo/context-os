#!/usr/bin/env node

/**
 * Context-OS Main Entry Point
 * Provides programmatic access to Context-OS functionality
 */

// Core modules
const { ContextManager } = require('./core/context-manager');
const { KnowledgeManager } = require('./core/knowledge-manager');
const { ContextCompressor } = require('./core/context-compressor');
const { IncrementalIndexer } = require('./core/incremental-indexer');
const { SemanticAnalyzer } = require('./core/semantic-analyzer');
const { UsageTracker } = require('./core/usage-tracker');

// Main loader
const ContextLoader = require('./context-loader');

// Utility modules
const { SecurityManager } = require('./core/security-manager');
const { TokenOptimizer } = require('./core/token-optimizer');
const { LoggingManager } = require('./core/logging-manager');

// Export all main components
module.exports = {
  // Main functionality
  ContextLoader,
  ContextManager,
  KnowledgeManager,
  
  // Core modules
  ContextCompressor,
  IncrementalIndexer,
  SemanticAnalyzer,
  UsageTracker,
  
  // Utilities
  SecurityManager,
  TokenOptimizer,
  LoggingManager,
  
  // Factory method for quick setup
  createContextManager: (options = {}) => {
    return new ContextManager(options.projectRoot || process.cwd());
  }
};