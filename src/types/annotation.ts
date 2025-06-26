export interface Annotation {
  id: string;
  documentId: string;
  selectedText: string;
  content: string;
  tags: string[];
  position: {
    start: number;
    end: number;
    pageNumber?: number;
  };
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  replies?: AnnotationReply[];
  type: AnnotationType;
  color?: string;
}

export interface AnnotationReply {
  id: string;
  annotationId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type AnnotationType = 'comment' | 'highlight' | 'question' | 'citation' | 'note';

export interface AnnotationCategory {
  type: AnnotationType;
  label: string;
  color: string;
  icon: string;
}

export interface TextSelection {
  text: string;
  start: number;
  end: number;
  rect?: DOMRect;
}