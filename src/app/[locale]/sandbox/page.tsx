'use client';

import { useTranslations } from 'next-intl';
// import { useTheme } from 'next-themes';
import InteractiveKeypad from '@/components/interactive-keypad';

// import LightSwitchToggle from '@/components/light-bulb';

export default function Page() {
  const t = useTranslations('SandboxPage');
  // const { theme, setTheme } = useTheme();
  // function toLightOrDark(
  //   theme: string | undefined,
  // ): 'light' | 'dark' | undefined {
  //   if (theme === 'light' || theme === 'dark') return theme;
  //   return undefined;
  // }
  return (
    <div className="grid flex-1 grid-cols-2 gap-6">
      <div className="col-span-2 place-content-start text-center">
        <h2 className="w-full text-5xl font-bold">{t('title')}</h2>
        <div className="mt-16 flex w-full justify-center gap-8 md:justify-start">
          <InteractiveKeypad />
          {/* <LightSwitchToggle onChange={setTheme} theme={toLightOrDark(theme)} /> */}
        </div>
      </div>
    </div>
  );
}
