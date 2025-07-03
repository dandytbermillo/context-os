'use client';

import { useState } from 'react';

export default function Home() {
  const [leftPanelVisible, setLeftPanelVisible] = useState(false);
  const [annotationsPanelVisible, setAnnotationsPanelVisible] = useState(false);
  const [annotationEditorVisible, setAnnotationEditorVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [activeState, setActiveState] = useState('default');
  const [activeTab, setActiveTab] = useState('annotations');
  const [activeFilter, setActiveFilter] = useState('all');

  const toggleLeftPanel = () => {
    setLeftPanelVisible(!leftPanelVisible);
  };

  const toggleAnnotationsPanel = () => {
    setAnnotationsPanelVisible(!annotationsPanelVisible);
  };

  const toggleAnnotationEditor = () => {
    // Simply toggle the editor state, don't affect annotations panel
    setAnnotationEditorVisible(!annotationEditorVisible);
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const filterAnnotations = (type: string) => {
    setActiveFilter(type);
  };

  const showState = (state: string) => {
    setActiveState(state);
    
    // Reset all states
    setLeftPanelVisible(false);
    setAnnotationEditorVisible(false);
    setAnnotationsPanelVisible(false);

    // Apply specific state
    switch(state) {
      case 'metadata':
        setLeftPanelVisible(true);
        break;
      case 'annotating':
        setAnnotationEditorVisible(true);
        setAnnotationsPanelVisible(false);
        setIsPinned(false); // Unpin to ensure panels can be hidden
        break;
      case 'annotations':
        setAnnotationsPanelVisible(true);
        break;
      case 'cross-references':
        setAnnotationsPanelVisible(true);
        setActiveTab('cross-references');
        break;
      case 'all':
        setLeftPanelVisible(true);
        setAnnotationEditorVisible(true);
        setAnnotationsPanelVisible(true);
        break;
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>15:50:34 MDT</h1>
        <div className="header-actions">
          <button className="btn">Export</button>
          <button className="btn">Share</button>
          <button className="btn primary">Save Document</button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="main-content">
        {/* Document Properties Panel (Left Side) */}
        <div className={`document-properties-panel ${leftPanelVisible ? 'visible' : ''}`} id="documentPropertiesPanel">
          <div className="properties-panel-header">
            <h2 className="properties-panel-title">Document Properties</h2>
            <div className="panel-actions">
              <button className="close-btn" onClick={toggleLeftPanel}>×</button>
            </div>
          </div>
          
          <div className="properties-content">
          <div className="metadata-section">
            <div className="metadata-item">
              <span className="metadata-label">Title:</span> Research Paper on AI Ethics
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Author:</span> Dr. Sarah Johnson
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Date:</span> June 25, 2025
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Version:</span> 2.1
            </div>
          </div>
          
          <div className="metadata-section">
            <h3>Document Tags</h3>
            <div className="annotation-tags">
              <span className="tag">AI Ethics</span>
              <span className="tag">Machine Learning</span>
              <span className="tag">Policy</span>
              <span className="tag">Research</span>
            </div>
          </div>
          
          <div className="metadata-section">
            <h3>Notes</h3>
            <div className="metadata-item">
              This document explores the ethical implications of artificial intelligence in modern society, focusing on bias, transparency, and accountability.
            </div>
          </div>
          </div>
        </div>
        
        {/* Editor Container (Main Editor + Annotations Overlay) */}
        <div className={`editor-container ${annotationEditorVisible ? 'with-annotation-editor' : ''}`} id="editorContainer">
          {/* Main Editor */}
          <div className="main-editor" id="mainEditor">
            <h1 className="document-title">Ethical Considerations in Artificial Intelligence</h1>
            <div className="document-content">
              <p>
                The rapid advancement of artificial intelligence has brought unprecedented opportunities and challenges to modern society. As AI systems become increasingly sophisticated and integrated into critical decision-making processes, the ethical implications of their deployment demand careful consideration.
              </p>
              <p>
                One of the most pressing concerns is <span className="annotation-marker">algorithmic bias<span className="annotation-number">1</span></span>, which can perpetuate and amplify existing societal inequalities. Machine learning models trained on historical data often inherit the biases present in that data, leading to discriminatory outcomes in areas such as hiring, lending, and criminal justice.
              </p>
              <p>
                <span className="selected-text" onClick={toggleAnnotationEditor}>Transparency and explainability represent another crucial ethical dimension. As AI systems grow more complex, understanding how they arrive at specific decisions becomes increasingly challenging.</span> This "black box" problem poses significant risks when AI is used in high-stakes scenarios where accountability is essential.
              </p>
              <p>
                The question of <span className="annotation-marker">accountability and responsibility<span className="annotation-number">2</span></span> in AI systems remains contentious. When an autonomous system makes a harmful decision, determining liability becomes complex. Should responsibility lie with the developers, the organizations deploying the system, or the AI itself?
              </p>
              <p>
                Privacy concerns also feature prominently in AI ethics discussions. The vast amounts of data required to train sophisticated AI models often include personal information, raising questions about consent, data ownership, and the potential for surveillance and manipulation.
              </p>
            </div>
            
            {/* Annotations Panel (Now inside Main Editor) */}
            <div className={`annotations-panel ${annotationsPanelVisible ? 'visible' : ''} ${annotationsPanelVisible && annotationEditorVisible ? 'with-editor' : ''} ${isPinned ? 'pinned' : ''} ${leftPanelVisible && annotationsPanelVisible && annotationEditorVisible ? 'with-all-panels' : ''}`} id="annotationsPanel">
            <div className="annotations-panel-header">
              <h2 className="annotations-panel-title">Annotations</h2>
              <div className="panel-actions">
                <button className={`pin-btn ${isPinned ? 'pinned' : ''}`} id="pinBtn" onClick={togglePin} title={isPinned ? 'Unpin panel' : 'Pin panel'}>📌</button>
                <button className="close-btn" onClick={toggleAnnotationsPanel}>×</button>
              </div>
            </div>
            
            <div className="annotation-tabs">
              <div className={`annotation-tab ${activeTab === 'annotations' ? 'active' : ''}`} onClick={() => switchTab('annotations')}>All Annotations</div>
              <div className={`annotation-tab ${activeTab === 'tags' ? 'active' : ''}`} onClick={() => switchTab('tags')}>Tags</div>
              <div className={`annotation-tab ${activeTab === 'cross-references' ? 'active' : ''}`} onClick={() => switchTab('cross-references')}>Cross-References</div>
            </div>
            
            {/* Annotations Tab Content */}
            <div className={`tab-content ${activeTab === 'annotations' ? '' : 'hidden'}`} id="annotations-content" style={{display: activeTab === 'annotations' ? 'block' : 'none'}}>
              {/* Annotation Statistics Summary */}
              <div className="annotation-summary">
                <div className="summary-stats">
                  <div className="stat-item">
                    <div className="stat-number">8</div>
                    <div className="stat-label">Total Annotations</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">3</div>
                    <div className="stat-label">Notes</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">3</div>
                    <div className="stat-label">Exploring</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">2</div>
                    <div className="stat-label">Promoted</div>
                  </div>
                </div>
                <div className="summary-actions">
                  <select className="sort-dropdown">
                    <option>Sort by: Most Recent</option>
                    <option>Sort by: Type</option>
                    <option>Sort by: Priority</option>
                    <option>Sort by: Status</option>
                  </select>
                </div>
              </div>
              
              {/* Annotation Type Filters */}
              <div className="annotation-filters">
                <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => filterAnnotations('all')}>
                  All <span className="filter-count">8</span>
                </button>
                <button className={`filter-btn note-filter ${activeFilter === 'note' ? 'active' : ''}`} onClick={() => filterAnnotations('note')}>
                  <span className="type-icon">📝</span> Note <span className="filter-count">3</span>
                </button>
                <button className={`filter-btn explore-filter ${activeFilter === 'explore' ? 'active' : ''}`} onClick={() => filterAnnotations('explore')}>
                  <span className="type-icon">🔍</span> Explore <span className="filter-count">3</span>
                </button>
                <button className={`filter-btn promote-filter ${activeFilter === 'promote' ? 'active' : ''}`} onClick={() => filterAnnotations('promote')}>
                  <span className="type-icon">🚀</span> Promote <span className="filter-count">2</span>
                </button>
              </div>
              
              {/* Annotations List */}
              <div className="annotations-list">
                {/* Note Type Annotation */}
                <div className={`annotation-item note-type ${activeFilter !== 'all' && activeFilter !== 'note' ? 'hidden' : ''}`} data-type="note">
                  <div className="annotation-type-indicator note"></div>
                  <div className="annotation-header">
                    <div className="annotation-type-badge note">
                      <span className="type-icon">📝</span> Note
                    </div>
                    <div className="annotation-status private">Private</div>
                  </div>
                  <div className="annotation-item-quote">"algorithmic bias"</div>
                  <div className="annotation-item-content">
                    This is a critical issue that needs addressing at multiple levels - from data collection to model design. Recent studies show that bias mitigation techniques can reduce discriminatory outcomes by up to 40%.
                  </div>
                  <div className="annotation-item-meta">
                    <span>Page 1</span>
                    <span>•</span>
                    <span>2 hours ago</span>
                    <div className="annotation-tags">
                      <span className="tag">bias</span>
                      <span className="tag">fairness</span>
                    </div>
                  </div>
                  <div className="annotation-actions">
                    <button className="action-btn">Convert to Explore</button>
                    <button className="action-btn">Add Tags</button>
                    <button className="action-btn icon-btn" title="More actions">⋮</button>
                  </div>
                </div>
                
                {/* Explore Type Annotation */}
                <div className={`annotation-item explore-type ${activeFilter !== 'all' && activeFilter !== 'explore' ? 'hidden' : ''}`} data-type="explore">
                  <div className="annotation-type-indicator explore"></div>
                  <div className="annotation-header">
                    <div className="annotation-type-badge explore">
                      <span className="type-icon">🔍</span> Explore
                    </div>
                    <div className="annotation-status in-progress">In Progress</div>
                  </div>
                  <div className="annotation-item-quote">"transparency and explainability"</div>
                  <div className="annotation-item-content">
                    Investigating methods to improve model interpretability. Need to research SHAP values, LIME, and other explainability frameworks. Consider trade-offs between accuracy and interpretability.
                  </div>
                  <div className="research-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '60%'}}></div>
                    </div>
                    <div className="progress-label">Research Progress: 60%</div>
                  </div>
                  <div className="related-questions">
                    <div className="question-item">• How do SHAP values work with transformer models?</div>
                    <div className="question-item">• What are the computational costs of explainability?</div>
                  </div>
                  <div className="annotation-item-meta">
                    <span>Page 2</span>
                    <span>•</span>
                    <span>1 day ago</span>
                    <span>•</span>
                    <span className="explore-deadline">Due: June 30</span>
                  </div>
                  <div className="annotation-actions">
                    <button className="action-btn">Create Task</button>
                    <button className="action-btn">Link Research</button>
                    <button className="action-btn">Convert to Promote</button>
                  </div>
                </div>
                
                {/* Promote Type Annotation */}
                <div className={`annotation-item promote-type ${activeFilter !== 'all' && activeFilter !== 'promote' ? 'hidden' : ''}`} data-type="promote">
                  <div className="annotation-type-indicator promote"></div>
                  <div className="annotation-header">
                    <div className="annotation-type-badge promote">
                      <span className="type-icon">🚀</span> Promote
                    </div>
                    <div className="annotation-status approved">Approved</div>
                  </div>
                  <div className="annotation-item-quote">"accountability and responsibility"</div>
                  <div className="annotation-item-content">
                    The legal framework for AI accountability is still evolving. The EU's AI Act represents one of the first comprehensive attempts to establish clear liability chains for AI systems.
                  </div>
                  <div className="promotion-metrics">
                    <div className="metric-item">
                      <span className="metric-icon">👥</span>
                      <span className="metric-value">Shared with 5 stakeholders</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-icon">✅</span>
                      <span className="metric-value">Approved by Legal Team</span>
                    </div>
                  </div>
                  <div className="annotation-item-meta">
                    <span>Page 1</span>
                    <span>•</span>
                    <span>1 hour ago</span>
                    <div className="annotation-tags">
                      <span className="tag">legal</span>
                      <span className="tag">policy</span>
                      <span className="tag promoted">promoted</span>
                    </div>
                  </div>
                  <div className="annotation-actions">
                    <button className="action-btn primary">Share</button>
                    <button className="action-btn">Export</button>
                    <button className="action-btn">View History</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tags Tab Content */}
            <div className="tab-content" id="tags-content" style={{display: activeTab === 'tags' ? 'block' : 'none'}}>
              <div className="tags-cloud">
                <div className="tag-item">
                  <span className="tag large">AI Ethics</span>
                  <span className="tag-count">23 annotations</span>
                </div>
                <div className="tag-item">
                  <span className="tag medium">bias</span>
                  <span className="tag-count">15 annotations</span>
                </div>
                <div className="tag-item">
                  <span className="tag medium">fairness</span>
                  <span className="tag-count">12 annotations</span>
                </div>
                <div className="tag-item">
                  <span className="tag small">legal</span>
                  <span className="tag-count">8 annotations</span>
                </div>
                <div className="tag-item">
                  <span className="tag small">policy</span>
                  <span className="tag-count">6 annotations</span>
                </div>
              </div>
            </div>
            
            {/* Cross-References Tab Content */}
            <div className="tab-content" id="cross-references-content" style={{display: activeTab === 'cross-references' ? 'block' : 'none'}}>
              <div className="cross-reference-section">
                <div className="section-header">
                  <span className="section-icon">📖</span>
                  <h4>BACKLINKS</h4>
                  <span className="section-count">(12)</span>
                </div>
                <div className="section-subtitle">Documents that link to this paper</div>
                <div className="reference-items">
                  <div className="reference-item">
                    <div className="reference-title">AI Governance Framework 2025</div>
                    <div className="reference-context">"As discussed in [[Ethical Considerations in AI]], bias mitigation requires..."</div>
                    <div className="reference-meta">
                      <span>Policy Document</span>
                      <span>•</span>
                      <span>3 references</span>
                    </div>
                  </div>
                  <div className="reference-item">
                    <div className="reference-title">Machine Learning Best Practices</div>
                    <div className="reference-context">"The ethical framework outlined in [[Ethical Considerations in AI]] provides..."</div>
                    <div className="reference-meta">
                      <span>Technical Guide</span>
                      <span>•</span>
                      <span>2 references</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="cross-reference-section">
                <div className="section-header">
                  <span className="section-icon">📚</span>
                  <h4>CITATIONS</h4>
                  <span className="section-count">(8)</span>
                </div>
                <div className="section-subtitle">Sources referenced in this document</div>
                <div className="reference-items">
                  <div className="reference-item">
                    <div className="reference-title">Algorithmic Bias in ML Systems (2024)</div>
                    <div className="reference-context">Referenced in: Section 2 - Bias and Fairness</div>
                    <div className="reference-meta">
                      <span>Research Paper</span>
                      <span>•</span>
                      <span>MIT Press</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="cross-reference-section">
                <div className="section-header">
                  <span className="section-icon">🔗</span>
                  <h4>RELATED DOCUMENTS</h4>
                  <span className="section-count">(15)</span>
                </div>
                <div className="section-subtitle">Similar content and concepts</div>
                <div className="reference-items">
                  <div className="reference-item clickable">
                    <div className="reference-title">Explainable AI: Methods and Applications</div>
                    <div className="similarity-bar">
                      <div className="similarity-fill" style={{width: '85%'}}></div>
                    </div>
                    <div className="reference-meta">
                      <span>85% similarity</span>
                      <span>•</span>
                      <span>12 shared annotations</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="cross-reference-section">
                <div className="section-header">
                  <span className="section-icon">🏷️</span>
                  <h4>SHARED TAGS</h4>
                  <span className="section-count">(42)</span>
                </div>
                <div className="section-subtitle">Documents with common tags</div>
                <div className="shared-tags-grid">
                  <div className="shared-tag-group">
                    <div className="tag large">AI Ethics</div>
                    <div className="tag-documents">23 documents</div>
                  </div>
                  <div className="shared-tag-group">
                    <div className="tag medium">Machine Learning</div>
                    <div className="tag-documents">18 documents</div>
                  </div>
                  <div className="shared-tag-group">
                    <div className="tag medium">Policy</div>
                    <div className="tag-documents">15 documents</div>
                  </div>
                  <div className="shared-tag-group">
                    <div className="tag small">Research</div>
                    <div className="tag-documents">12 documents</div>
                  </div>
                  <div className="show-more-tags">+ 38 more tags</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        
        {/* Annotation Editor */}
        <div className={`annotation-editor ${annotationEditorVisible ? 'visible' : ''} ${leftPanelVisible && annotationsPanelVisible && annotationEditorVisible ? 'with-all-panels' : ''}`} id="annotationEditor">
          <div className="resize-handle right" id="rightResizeHandle"></div>
          <div className="annotation-editor-header">
            <h3 className="annotation-editor-title">Create Annotation</h3>
            <button className="close-btn" onClick={toggleAnnotationEditor}>×</button>
          </div>
          
          <div className="selected-quote">
            "Transparency and explainability represent another crucial ethical dimension. As AI systems grow more complex, understanding how they arrive at specific decisions becomes increasingly challenging."
          </div>
          
          <textarea className="annotation-textarea" placeholder="Enter your annotation here..." defaultValue="This highlights the fundamental tension between model complexity and interpretability. As we push for more accurate AI systems, we often sacrifice our ability to understand their decision-making processes." />
          
          <div className="annotation-actions">
            <button className="btn" onClick={toggleAnnotationEditor}>Cancel</button>
            <button className="btn primary">Save Annotation</button>
          </div>
        </div>
      </div>
      
      {/* Toggle Buttons */}
      <button className="toggle-left" onClick={toggleLeftPanel}>☰</button>
      <button className="toggle-annotations" onClick={toggleAnnotationsPanel}>View Annotations (8)</button>
      
      {/* Demo Controls */}
      <div className="demo-controls">
        <h4>Demo States</h4>
        <div className="demo-buttons">
          {[
            { id: 'default', label: 'Default View' },
            { id: 'metadata', label: 'With Metadata' },
            { id: 'annotating', label: 'Creating Annotation' },
            { id: 'annotations', label: 'Annotation List' },
            { id: 'cross-references', label: 'Cross-References' },
            { id: 'all', label: 'All Panels' }
          ].map(state => (
            <button 
              key={state.id}
              className={`demo-btn ${activeState === state.id ? 'active' : ''}`}
              onClick={() => showState(state.id)}
            >
              {state.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}