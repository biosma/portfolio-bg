'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

// import LightSwitchToggle from './light-bulb';

export function ModeToggle() {
  const {
    // theme,
    setTheme,
  } = useTheme();
  // function toLightOrDark(theme: string | undefined): 'light' | 'dark' | undefined {
  //   if (theme === 'light' || theme === 'dark') return theme;
  //   return undefined;
  // }
  return (
    <div className="flex items-center gap-4">
      {/* <LightSwitchToggle onChange={setTheme} theme={toLightOrDark(theme)} /> */}
      <Button
        variant={'ghost'}
        className={cn(
          'text-black rounded-full p-0 h-6 w-6  shadow bg-white hover:bg-white/90 hover:text-black dark:bg-transparent dark:text-accent-foreground dark:hover:bg-accent transition-transform duration-300 hover:rotate-12',
        )}
        onClick={() => setTheme('light')}
      >
        <SunIcon />
      </Button>
      <Button
        variant={'ghost'}
        className={cn(
          'bg-transparent text-black rounded-full p-0 h-6 w-6 dark:bg-white/90 dark:shadow dark:hover:bg-white dark:hover:text-black transition-transform duration-300 hover:rotate-12',
        )}
        onClick={() => setTheme('dark')}
      >
        <MoonIcon />
      </Button>
    </div>
  );
}
