import { useEffect } from 'react';
import Desktop from '@/components/Desktop';
import { useThemeStore } from '@/lib/stores/theme-store';

const Index = () => {
  // Initialize theme on mount
  useEffect(() => {
    const { currentTheme, customColors } = useThemeStore.getState();
    const { THEMES } = require('@/lib/stores/theme-store');
    
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const baseTheme = THEMES[currentTheme];
      const finalColors = { ...baseTheme.colors, ...customColors };
      
      // Apply CSS variables
      Object.entries(finalColors).forEach(([key, value]: [string, any]) => {
        const cssVar = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        root.style.setProperty(`--${cssVar}`, value);
      });
      
      root.classList.add(`${currentTheme}-theme`);
    }
  }, []);

  return <Desktop />;
};

export default Index;
