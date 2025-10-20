// Real persistent storage for visual editor changes

export interface ElementStyle {
  selector: string;
  styles: Record<string, string>;
  timestamp: number;
}

export interface EditorState {
  styles: ElementStyle[];
  deletedElements: string[];
  elementOrder: Record<string, string[]>;
}

const STORAGE_KEY = 'tattty_visual_editor_state';

export function saveEditorState(state: EditorState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log('[Visual Editor] State saved:', state);
  } catch (error) {
    console.error('[Visual Editor] Failed to save state:', error);
  }
}

export function loadEditorState(): EditorState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored);
      console.log('[Visual Editor] State loaded:', state);
      return state;
    }
  } catch (error) {
    console.error('[Visual Editor] Failed to load state:', error);
  }
  
  return {
    styles: [],
    deletedElements: [],
    elementOrder: {}
  };
}

export function clearEditorState(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log('[Visual Editor] State cleared');
}

export function getElementSelector(element: HTMLElement): string {
  // Create a unique selector for the element
  const id = element.id;
  if (id) return `#${id}`;
  
  // Use data-editable attribute if available
  if (element.hasAttribute('data-editable')) {
    const dataId = element.getAttribute('data-editor-id');
    if (dataId) return `[data-editor-id="${dataId}"]`;
    
    // Assign a unique ID if not present
    const uniqueId = `editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    element.setAttribute('data-editor-id', uniqueId);
    return `[data-editor-id="${uniqueId}"]`;
  }
  
  // Filter out problematic Tailwind classes (responsive, state variants, etc.)
  const classes = Array.from(element.classList).filter(c => {
    return !c.startsWith('editor-') && // No editor classes
           !c.includes(':') &&            // No pseudo-classes (hover:, md:, etc.)
           !c.startsWith('sm:') &&        // No breakpoint prefixes
           !c.startsWith('md:') && 
           !c.startsWith('lg:') && 
           !c.startsWith('xl:') &&
           !c.startsWith('2xl:');
  });
  
  // Use only first 3 stable classes to avoid overly specific selectors
  if (classes.length > 0) {
    const stableClasses = classes.slice(0, 3);
    return `.${stableClasses.join('.')}`;
  }
  
  // Fallback to tag + nth-child
  const parent = element.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children);
    const index = siblings.indexOf(element);
    return `${element.tagName.toLowerCase()}:nth-child(${index + 1})`;
  }
  
  return element.tagName.toLowerCase();
}

export function saveElementStyle(element: HTMLElement, property: string, value: string): void {
  const state = loadEditorState();
  const selector = getElementSelector(element);
  
  // Find existing style entry or create new one
  let styleEntry = state.styles.find(s => s.selector === selector);
  
  if (!styleEntry) {
    styleEntry = {
      selector,
      styles: {},
      timestamp: Date.now()
    };
    state.styles.push(styleEntry);
  }
  
  styleEntry.styles[property] = value;
  styleEntry.timestamp = Date.now();
  
  saveEditorState(state);
}

export function deleteElement(element: HTMLElement): void {
  const state = loadEditorState();
  const selector = getElementSelector(element);
  
  if (!state.deletedElements.includes(selector)) {
    state.deletedElements.push(selector);
  }
  
  saveEditorState(state);
  element.remove();
}

export function applyStoredStyles(): void {
  const state = loadEditorState();
  
  console.log('[Visual Editor] Applying stored styles...', state);
  
  const validStyles: ElementStyle[] = [];
  const validDeleted: string[] = [];
  
  // Apply all saved styles and filter out invalid selectors
  state.styles.forEach(({ selector, styles }) => {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach(element => {
          Object.entries(styles).forEach(([property, value]) => {
            (element as HTMLElement).style[property as any] = value;
          });
        });
        validStyles.push({ selector, styles, timestamp: Date.now() });
      }
    } catch (error) {
      console.warn('[Visual Editor] Skipping invalid selector:', selector, error);
    }
  });
  
  // Hide deleted elements and filter out invalid selectors
  state.deletedElements.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
        validDeleted.push(selector);
      }
    } catch (error) {
      console.warn('[Visual Editor] Skipping invalid deleted selector:', selector, error);
    }
  });
  
  // Save cleaned state if we removed any invalid selectors
  if (validStyles.length !== state.styles.length || validDeleted.length !== state.deletedElements.length) {
    console.log('[Visual Editor] Cleaned up invalid selectors');
    saveEditorState({
      styles: validStyles,
      deletedElements: validDeleted,
      elementOrder: state.elementOrder
    });
  }
}

export function exportAsCode(): string {
  const state = loadEditorState();
  
  let code = '// Visual Editor Export\n\n';
  
  if (state.styles.length > 0) {
    code += '/* Styles to apply */\n';
    state.styles.forEach(({ selector, styles }) => {
      code += `${selector} {\n`;
      Object.entries(styles).forEach(([property, value]) => {
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        code += `  ${cssProperty}: ${value};\n`;
      });
      code += '}\n\n';
    });
  }
  
  if (state.deletedElements.length > 0) {
    code += '/* Elements to remove from JSX */\n';
    state.deletedElements.forEach(selector => {
      code += `// Remove: ${selector}\n`;
    });
    code += '\n';
  }
  
  return code;
}

export function exportAsJSON(): string {
  const state = loadEditorState();
  return JSON.stringify(state, null, 2);
}
