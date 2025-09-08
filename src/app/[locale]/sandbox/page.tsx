'use client'
import InteractiveKeypad from '@/components/interactive-keypad';
import LightSwitchToggle from '@/components/light-bulb';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export default function Page() {
  const t = useTranslations('SandboxPage');
  const {
    theme,
    setTheme,
  } = useTheme();
  function toLightOrDark(theme: string | undefined): 'light' | 'dark' | undefined {
    if (theme === 'light' || theme === 'dark') return theme;
    return undefined;
  }
  return (
    <div className="grid grid-cols-2 gap-6 flex-1">
      <div className="col-span-2 place-content-start text-center">
        <h2 className="text-5xl font-bold w-full">{t('title')}</h2>
        <div className="w-full flex gap-8 justify-start mt-16">
          <InteractiveKeypad />
<LightSwitchToggle onChange={setTheme} theme={toLightOrDark(theme)} />        </div>
      </div>
    </div>
  );
}
