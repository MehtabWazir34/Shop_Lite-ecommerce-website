
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      setIsDark(savedTheme === 'dark');
    } else {
      // Check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
      setIsDark(systemTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Update isDark state based on current theme
    setIsDark(theme === 'dark');
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Optional: Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#f8fafc');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      setIsDark(newTheme === 'dark');
      return newTheme;
    });
  };

  // Direct theme setter function (optional)
  const setThemeDirect = (newTheme) => {
    setTheme(newTheme);
    
    setIsDark(newTheme === 'dark');
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeDirect,
    isDark,
    isLight: !isDark
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};