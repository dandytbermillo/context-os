# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run type-check` - Run TypeScript compiler to check types without emitting files

## Architecture Overview

This is a Next.js 14 application with TypeScript that implements a document annotation system. The codebase follows a modular component architecture with TypeScript interfaces defining the data models.

### Core Components
- **AnnotationEditor** (`src/components/annotations/AnnotationEditor.tsx`): Main component for creating and editing annotations with support for different annotation types (comment, highlight, question, citation, note), tagging system, and text selection
- **UI Components** (`src/components/ui/`): Reusable components including Button, Panel, Tag, Header, and IconButton

### Type System
- **Annotation Types** (`src/types/annotation.ts`): Defines core data structures for annotations, replies, text selections, and annotation categories
- **Document Types** (`src/types/document.ts`): Document-related type definitions
- **UI Types** (`src/types/ui.ts`): UI component prop types

### Key Features
- Text selection and annotation creation
- Multiple annotation types with color coding and icons
- Tag system for organizing annotations
- Resizable annotation editor panel
- Keyboard shortcuts (Ctrl+Enter to save, Escape to close)

### Path Aliases
The project uses TypeScript path mapping with `@/` pointing to `src/`:
- `@/components/*` for components
- `@/types/*` for type definitions
- `@/utils/*` for utility functions
- `@/hooks/*` for custom hooks
- `@/contexts/*` for React contexts

### Styling
- Uses Tailwind CSS for styling
- Custom utility function `cn()` for conditional class names
- Responsive design with grid layouts for annotation type selection