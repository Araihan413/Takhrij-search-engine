'use client';

import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as 'dark' | 'light';
    const isLight = saved === 'light';
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('light', isLight);
      document.body.classList.toggle('light', isLight);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    const isLight = newTheme === 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', isLight);
    document.body.classList.toggle('light', isLight);
  };

  if (!mounted) return null;

  return (
    <Button
      variant="secondary"
      className="fixed top-4 right-4 h-9 w-9 p-0 rounded-lg z-50 overflow-hidden"
      onClick={toggleTheme}
    >
      <div className="relative h-4 w-4">
        {theme === 'dark' ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </div>
    </Button>
  );
}
