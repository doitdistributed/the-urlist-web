import { useEffect, useRef } from 'react';

interface ShortcutOptions {
  targetSelector?: string;
  excludeInputs?: boolean;
}

export function useKeyboardShortcuts(shortcutKey: string, callback: () => void, options: ShortcutOptions = {}) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === shortcutKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        (!options.excludeInputs || (
          !(e.target instanceof HTMLInputElement) &&
          !(e.target instanceof HTMLTextAreaElement)
        ))
      ) {
        e.preventDefault();
        if (options.targetSelector) {
          const element = document.querySelector(options.targetSelector);
          if (element instanceof HTMLElement) {
            element.focus();
          }
        } else {
          callbackRef.current();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcutKey, options]);
}