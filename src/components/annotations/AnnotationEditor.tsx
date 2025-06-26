import React, { useState } from 'react';
import { Button, Panel, Tag } from '@/components/ui';
import { Annotation, AnnotationType, TextSelection } from '@/types';
import { cn } from '@/utils/cn';

interface AnnotationEditorProps {
  isVisible: boolean;
  width: number;
  textSelection: TextSelection | null;
  existingAnnotation?: Annotation;
  onSave: (annotation: Partial<Annotation>) => void;
  onClose: () => void;
  onResize: (width: number) => void;
}

const ANNOTATION_TYPES: { type: AnnotationType; label: string; color: string; icon: string }[] = [
  { type: 'comment', label: 'Comment', color: 'bg-blue-100 text-blue-800', icon: '💬' },
  { type: 'highlight', label: 'Highlight', color: 'bg-yellow-100 text-yellow-800', icon: '✨' },
  { type: 'question', label: 'Question', color: 'bg-red-100 text-red-800', icon: '❓' },
  { type: 'citation', label: 'Citation', color: 'bg-green-100 text-green-800', icon: '📖' },
  { type: 'note', label: 'Note', color: 'bg-purple-100 text-purple-800', icon: '📝' },
];

export const AnnotationEditor: React.FC<AnnotationEditorProps> = ({
  isVisible,
  width,
  textSelection,
  existingAnnotation,
  onSave,
  onClose,
  onResize,
}) => {
  const [content, setContent] = useState(existingAnnotation?.content || '');
  const [selectedType, setSelectedType] = useState<AnnotationType>(existingAnnotation?.type || 'comment');
  const [tags, setTags] = useState<string[]>(existingAnnotation?.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    if (!textSelection && !existingAnnotation) return;

    const annotationData: Partial<Annotation> = {
      content: content.trim(),
      type: selectedType,
      tags,
      ...(textSelection && {
        selectedText: textSelection.text,
        position: {
          start: textSelection.start,
          end: textSelection.end,
        }
      })
    };

    onSave(annotationData);
    handleClose();
  };

  const handleClose = () => {
    setContent('');
    setSelectedType('comment');
    setTags([]);
    setNewTag('');
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <Panel
      isVisible={isVisible}
      width={width}
      position="right"
      title={existingAnnotation ? 'Edit Annotation' : 'Create Annotation'}
      onClose={handleClose}
      onResize={onResize}
      minWidth={300}
      maxWidth={600}
    >
      <div className="p-6 space-y-6">
        {textSelection && (
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">
            <p className="text-sm text-gray-600 italic">"{textSelection.text}"</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Annotation Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ANNOTATION_TYPES.map(({ type, label, color, icon }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  'flex items-center gap-2 p-3 rounded-lg border-2 transition-all',
                  selectedType === type
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="annotation-content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="annotation-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your annotation here..."
            className="w-full min-h-32 p-3 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <Tag key={tag} variant="primary" onRemove={() => removeTag(tag)}>
                {tag}
              </Tag>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Button onClick={addTag} disabled={!newTag.trim()}>
              Add
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={!content.trim()}
          >
            {existingAnnotation ? 'Update' : 'Save'} Annotation
          </Button>
        </div>
      </div>
    </Panel>
  );
};