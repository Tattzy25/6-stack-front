import { useEffect } from 'react';

/**
 * Screenshot Protection Component
 * 
 * Adds additional layers of protection against screenshots:
 * - Blocks common screenshot keyboard shortcuts
 * - Prevents right-click context menu
 * - Detects PrintScreen key
 * 
 * Note: This is not foolproof - determined users can still screenshot.
 * This adds friction and discourages casual screenshot attempts.
 */
export function ScreenshotProtection() {
  useEffect(() => {
    // Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block screenshot keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard.writeText('');
        console.log('Screenshot attempt detected');
      }

      // Cmd/Ctrl + Shift + 3/4/5 (Mac screenshots)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        console.log('Screenshot attempt detected');
      }

      // Windows Snipping Tool (Win + Shift + S)
      if (e.key === 's' && e.shiftKey && e.metaKey) {
        e.preventDefault();
        console.log('Screenshot attempt detected');
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
