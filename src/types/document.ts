export interface Document {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  tags: string[];
  metadata: DocumentMetadata;
}

export interface DocumentMetadata {
  wordCount?: number;
  readingTime?: number;
  language?: string;
  category?: string;
  description?: string;
  collaborators?: string[];
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  level: number;
  startPosition: number;
  endPosition: number;
}