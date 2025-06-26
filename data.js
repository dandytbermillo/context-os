// Configuration and data for the annotation system

export const documentMetadata = {
    title: "Research Paper on AI Ethics",
    author: "Dr. Sarah Johnson",
    date: "June 25, 2025",
    version: "2.1",
    tags: ["AI Ethics", "Machine Learning", "Policy", "Research"],
    notes: "This document explores the ethical implications of artificial intelligence in modern society, focusing on bias, transparency, and accountability."
};

export const documentContent = {
    title: "Ethical Considerations in Artificial Intelligence",
    paragraphs: [
        "The rapid advancement of artificial intelligence has brought unprecedented opportunities and challenges to modern society. As AI systems become increasingly sophisticated and integrated into critical decision-making processes, the ethical implications of their deployment demand careful consideration.",
        "One of the most pressing concerns is algorithmic bias, which can perpetuate and amplify existing societal inequalities. Machine learning models trained on historical data often inherit the biases present in that data, leading to discriminatory outcomes in areas such as hiring, lending, and criminal justice.",
        "Transparency and explainability represent another crucial ethical dimension. As AI systems grow more complex, understanding how they arrive at specific decisions becomes increasingly challenging. This \"black box\" problem poses significant risks when AI is used in high-stakes scenarios where accountability is essential.",
        "The question of accountability and responsibility in AI systems remains contentious. When an autonomous system makes a harmful decision, determining liability becomes complex. Should responsibility lie with the developers, the organizations deploying the system, or the AI itself?",
        "Privacy concerns also feature prominently in AI ethics discussions. The vast amounts of data required to train sophisticated AI models often include personal information, raising questions about consent, data ownership, and the potential for surveillance and manipulation."
    ]
};

export const annotations = [
    {
        id: "1",
        quote: "algorithmic bias",
        content: "This is a critical issue that needs addressing at multiple levels - from data collection to model design. Recent studies show that bias mitigation techniques can reduce discriminatory outcomes by up to 40%.",
        page: "Page 1",
        timestamp: "2 hours ago",
        tags: ["bias", "fairness"],
        position: { start: 0, end: 0 } // Would be calculated based on text position
    },
    {
        id: "2",
        quote: "accountability and responsibility",
        content: "The legal framework for AI accountability is still evolving. The EU's AI Act represents one of the first comprehensive attempts to establish clear liability chains for AI systems.",
        page: "Page 1",
        timestamp: "1 hour ago",
        tags: ["legal", "policy"],
        position: { start: 0, end: 0 }
    }
];

export const annotationTabs = [
    { id: "all", label: "All Annotations", active: true },
    { id: "tags", label: "Tags", active: false },
    { id: "references", label: "Cross-References", active: false }
];

export const demoStates = [
    { id: "default", label: "Default View", active: true },
    { id: "metadata", label: "With Metadata", active: false },
    { id: "annotating", label: "Creating Annotation", active: false },
    { id: "annotations", label: "Annotation List", active: false },
    { id: "all", label: "All Panels", active: false }
];

export const selectedQuote = "Transparency and explainability represent another crucial ethical dimension. As AI systems grow more complex, understanding how they arrive at specific decisions becomes increasingly challenging.";

export const annotationEditorContent = "This highlights the fundamental tension between model complexity and interpretability. As we push for more accurate AI systems, we often sacrifice our ability to understand their decision-making processes.";

export const panelConfig = {
    leftPanel: {
        minWidth: 250,
        maxWidth: 500,
        defaultWidth: 300
    },
    rightPanel: {
        minWidth: 300,
        maxWidth: 600,
        defaultWidth: 400
    },
    annotationsPanel: {
        defaultWidth: 350
    }
};