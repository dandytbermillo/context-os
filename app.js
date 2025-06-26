// Annotation System JavaScript Module

class AnnotationSystem {
    constructor() {
        this.isResizing = false;
        this.currentPanel = null;
        this.startX = 0;
        this.startWidth = 0;
        this.isPinned = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupResizeHandlers();
    }

    bindEvents() {
        // Demo button events
        document.querySelectorAll('.demo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const state = btn.textContent.toLowerCase().replace(' ', '');
                this.showState(this.mapStateFromButton(state));
            });
        });

        // Close panel when clicking outside (if not pinned)
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    setupResizeHandlers() {
        const leftHandle = document.getElementById('leftResizeHandle');
        const rightHandle = document.getElementById('rightResizeHandle');
        
        if (leftHandle) {
            leftHandle.addEventListener('mousedown', (e) => this.initResize(e, 'left'));
        }
        if (rightHandle) {
            rightHandle.addEventListener('mousedown', (e) => this.initResize(e, 'right'));
        }

        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());
    }

    initResize(e, panel) {
        this.isResizing = true;
        this.currentPanel = panel;
        this.startX = e.clientX;
        
        if (panel === 'left') {
            this.startWidth = document.getElementById('leftPanel').offsetWidth;
        } else {
            this.startWidth = document.getElementById('annotationEditor').offsetWidth;
        }
        
        document.body.classList.add('resizing');
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isResizing) return;
        
        if (this.currentPanel === 'left') {
            this.resizeLeftPanel(e);
        } else if (this.currentPanel === 'right') {
            this.resizeRightPanel(e);
        }
    }

    resizeLeftPanel(e) {
        const panel = document.getElementById('leftPanel');
        const newWidth = this.startWidth + (e.clientX - this.startX);
        
        if (newWidth >= 250 && newWidth <= 500) {
            panel.style.width = newWidth + 'px';
            this.updateEditorContainerMargin();
        }
    }

    resizeRightPanel(e) {
        const panel = document.getElementById('annotationEditor');
        const newWidth = this.startWidth - (e.clientX - this.startX);
        
        if (newWidth >= 300 && newWidth <= 600) {
            panel.style.width = newWidth + 'px';
            this.updateEditorContainerMargin();
            this.updateAnnotationsPanelPosition();
        }
    }

    handleMouseUp() {
        if (this.isResizing) {
            this.isResizing = false;
            this.currentPanel = null;
            document.body.classList.remove('resizing');
        }
    }

    updateEditorContainerMargin() {
        const editorContainer = document.getElementById('editorContainer');
        const leftPanel = document.getElementById('leftPanel');
        const annotationEditor = document.getElementById('annotationEditor');
        
        if (leftPanel.classList.contains('visible')) {
            editorContainer.style.marginLeft = leftPanel.offsetWidth + 'px';
        } else {
            editorContainer.style.marginLeft = '0';
        }
        
        if (annotationEditor.classList.contains('visible')) {
            editorContainer.style.marginRight = annotationEditor.offsetWidth + 'px';
        } else {
            editorContainer.style.marginRight = '0';
        }
    }

    updateAnnotationsPanelPosition() {
        const annotationsPanel = document.getElementById('annotationsPanel');
        const annotationEditor = document.getElementById('annotationEditor');
        
        if (annotationEditor.classList.contains('visible') && annotationsPanel.classList.contains('visible')) {
            annotationsPanel.classList.add('with-editor');
            annotationsPanel.style.right = annotationEditor.offsetWidth + 'px';
        } else {
            annotationsPanel.classList.remove('with-editor');
            annotationsPanel.style.right = '0';
        }
    }

    toggleLeftPanel() {
        const panel = document.getElementById('leftPanel');
        const container = document.getElementById('editorContainer');
        panel.classList.toggle('visible');
        
        if (panel.classList.contains('visible')) {
            container.classList.add('with-left-panel');
            container.style.marginLeft = panel.offsetWidth + 'px';
        } else {
            container.classList.remove('with-left-panel');
            container.style.marginLeft = '0';
        }
    }

    toggleAnnotationEditor() {
        const editor = document.getElementById('annotationEditor');
        const container = document.getElementById('editorContainer');
        editor.classList.toggle('visible');
        
        if (editor.classList.contains('visible')) {
            container.classList.add('with-annotation-editor');
            container.style.marginRight = editor.offsetWidth + 'px';
            // Hide annotations panel when showing editor unless pinned
            if (!this.isPinned) {
                document.getElementById('annotationsPanel').classList.remove('visible');
            }
            this.updateAnnotationsPanelPosition();
        } else {
            container.classList.remove('with-annotation-editor');
            container.style.marginRight = '0';
            this.updateAnnotationsPanelPosition();
        }
    }

    toggleAnnotationsPanel() {
        const panel = document.getElementById('annotationsPanel');
        const wasVisible = panel.classList.contains('visible');
        
        if (wasVisible) {
            // Hide the panel
            panel.classList.remove('visible');
            panel.classList.remove('with-editor');
            panel.style.right = '0';
        } else {
            // Show the panel
            panel.classList.add('visible');
            this.updateAnnotationsPanelPosition();
        }
    }

    togglePin() {
        this.isPinned = !this.isPinned;
        const pinBtn = document.getElementById('pinBtn');
        const panel = document.getElementById('annotationsPanel');
        
        if (this.isPinned) {
            pinBtn.classList.add('pinned');
            panel.classList.add('pinned');
            pinBtn.title = 'Unpin panel';
        } else {
            pinBtn.classList.remove('pinned');
            panel.classList.remove('pinned');
            pinBtn.title = 'Pin panel';
        }
    }

    mapStateFromButton(buttonText) {
        const stateMap = {
            'defaultview': 'default',
            'withmetadata': 'metadata',
            'creatingannotation': 'annotating',
            'annotationlist': 'annotations',
            'allpanels': 'all'
        };
        return stateMap[buttonText] || 'default';
    }

    showState(state) {
        // Save current pin state
        const currentPinState = this.isPinned;
        
        // Reset all states
        this.resetAllStates();
        
        // Only hide annotations panel if not pinned
        if (!currentPinState) {
            this.hideAnnotationsPanel();
        }
        
        // Update demo button states
        this.updateDemoButtonStates(event);
        
        // Apply specific state
        this.applyState(state, currentPinState);
    }

    resetAllStates() {
        document.getElementById('leftPanel').classList.remove('visible');
        const editorContainer = document.getElementById('editorContainer');
        editorContainer.classList.remove('with-left-panel', 'with-annotation-editor');
        editorContainer.style.marginLeft = '0';
        editorContainer.style.marginRight = '0';
        document.getElementById('annotationEditor').classList.remove('visible');
    }

    hideAnnotationsPanel() {
        const annotationsPanel = document.getElementById('annotationsPanel');
        annotationsPanel.classList.remove('visible');
        annotationsPanel.classList.remove('with-editor');
        annotationsPanel.style.right = '0';
    }

    updateDemoButtonStates(event) {
        document.querySelectorAll('.demo-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (event && event.target) {
            event.target.classList.add('active');
        }
    }

    applyState(state, currentPinState) {
        switch(state) {
            case 'default':
                // Just reset, already done above
                break;
            case 'metadata':
                this.toggleLeftPanel();
                break;
            case 'annotating':
                this.showAnnotationEditor(currentPinState);
                break;
            case 'annotations':
                this.showAnnotationsPanel();
                break;
            case 'all':
                this.showAllPanels();
                break;
        }
    }

    showAnnotationEditor(currentPinState) {
        const editor = document.getElementById('annotationEditor');
        const container = document.getElementById('editorContainer');
        editor.classList.add('visible');
        container.classList.add('with-annotation-editor');
        container.style.marginRight = editor.offsetWidth + 'px';
        
        if (!currentPinState) {
            this.hideAnnotationsPanel();
        } else {
            this.updateAnnotationsPanelPosition();
        }
    }

    showAnnotationsPanel() {
        document.getElementById('annotationsPanel').classList.add('visible');
        this.updateAnnotationsPanelPosition();
    }

    showAllPanels() {
        this.toggleLeftPanel();
        
        // Show annotation editor
        const editor = document.getElementById('annotationEditor');
        const container = document.getElementById('editorContainer');
        editor.classList.add('visible');
        container.classList.add('with-annotation-editor');
        container.style.marginRight = editor.offsetWidth + 'px';
        
        // Show annotations panel
        this.showAnnotationsPanel();
    }

    handleOutsideClick(e) {
        const panel = document.getElementById('annotationsPanel');
        const toggleBtn = document.querySelector('.toggle-annotations');
        const demoButtons = document.querySelector('.demo-controls');
        
        if (!this.isPinned && 
            panel.classList.contains('visible') && 
            !panel.contains(e.target) && 
            !toggleBtn.contains(e.target) &&
            !demoButtons.contains(e.target)) {
            this.toggleAnnotationsPanel();
        }
    }
}

// Global functions for backward compatibility
let annotationSystem;

function toggleLeftPanel() {
    if (annotationSystem) annotationSystem.toggleLeftPanel();
}

function toggleAnnotationEditor() {
    if (annotationSystem) annotationSystem.toggleAnnotationEditor();
}

function toggleAnnotationsPanel() {
    if (annotationSystem) annotationSystem.toggleAnnotationsPanel();
}

function togglePin() {
    if (annotationSystem) annotationSystem.togglePin();
}

function showState(state) {
    if (annotationSystem) annotationSystem.showState(state);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    annotationSystem = new AnnotationSystem();
});