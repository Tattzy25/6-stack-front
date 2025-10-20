import { useEffect, useRef } from 'react';

interface EditableWrapperProps {
  children: React.ReactNode;
  isEditMode: boolean;
  onSelect: (element: HTMLElement) => void;
  enableDragDrop?: boolean;
}

export function EditableWrapper({ children, isEditMode, onSelect, enableDragDrop = true }: EditableWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const editableElements = wrapper.querySelectorAll('[data-editable="true"]');

    const handleClick = (e: Event) => {
      if (!isEditMode) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target as HTMLElement;
      const editableElement = target.closest('[data-editable="true"]') as HTMLElement;
      
      if (editableElement) {
        // Remove previous selection highlights
        document.querySelectorAll('.editor-selected').forEach(el => {
          el.classList.remove('editor-selected');
        });
        
        // Add selection highlight
        editableElement.classList.add('editor-selected');
        onSelect(editableElement);
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if (!isEditMode || !enableDragDrop) return;
      
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-editable')) {
        e.dataTransfer!.effectAllowed = 'move';
        target.classList.add('dragging');
      }
    };

    const handleDragEnd = (e: DragEvent) => {
      if (!isEditMode || !enableDragDrop) return;
      
      const target = e.target as HTMLElement;
      target.classList.remove('dragging');
    };

    const handleDragOver = (e: DragEvent) => {
      if (!isEditMode || !enableDragDrop) return;
      
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'move';
    };

    const handleDrop = (e: DragEvent) => {
      if (!isEditMode || !enableDragDrop) return;
      
      e.preventDefault();
      const target = e.target as HTMLElement;
      const editableTarget = target.closest('[data-editable="true"]') as HTMLElement;
      const dragging = document.querySelector('.dragging') as HTMLElement;
      
      if (editableTarget && dragging && editableTarget !== dragging) {
        const parent = editableTarget.parentElement;
        if (parent && dragging.parentElement === parent) {
          const targetIndex = Array.from(parent.children).indexOf(editableTarget);
          const draggingIndex = Array.from(parent.children).indexOf(dragging);
          
          if (targetIndex < draggingIndex) {
            parent.insertBefore(dragging, editableTarget);
          } else {
            parent.insertBefore(dragging, editableTarget.nextSibling);
          }
        }
      }
    };

    editableElements.forEach(element => {
      element.addEventListener('click', handleClick);
      element.addEventListener('dragstart', handleDragStart);
      element.addEventListener('dragend', handleDragEnd);
      element.addEventListener('dragover', handleDragOver);
      element.addEventListener('drop', handleDrop);
      
      if (isEditMode && enableDragDrop) {
        (element as HTMLElement).setAttribute('draggable', 'true');
        (element as HTMLElement).style.cursor = 'move';
      } else {
        (element as HTMLElement).removeAttribute('draggable');
        (element as HTMLElement).style.cursor = 'default';
      }
    });

    return () => {
      editableElements.forEach(element => {
        element.removeEventListener('click', handleClick);
        element.removeEventListener('dragstart', handleDragStart);
        element.removeEventListener('dragend', handleDragEnd);
        element.removeEventListener('dragover', handleDragOver);
        element.removeEventListener('drop', handleDrop);
      });
    };
  }, [isEditMode, onSelect, enableDragDrop]);

  return (
    <div ref={wrapperRef} className={`flex-1 min-h-0 ${isEditMode ? 'edit-mode-active' : ''}`}>
      {children}
    </div>
  );
}
