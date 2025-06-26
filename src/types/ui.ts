export interface PanelState {
  isVisible: boolean;
  width: number;
  isPinned: boolean;
}

export interface LayoutState {
  leftPanel: PanelState;
  rightPanel: PanelState;
  annotationsPanel: PanelState;
}

export type PanelType = 'left' | 'right' | 'annotations';

export interface ResizeState {
  isResizing: boolean;
  currentPanel: PanelType | null;
  startX: number;
  startWidth: number;
}

export type ViewMode = 'default' | 'metadata' | 'annotating' | 'annotations' | 'all';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: string;
}