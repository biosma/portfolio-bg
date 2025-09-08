import InteractiveKeypad from '@/components/interactive-keypad';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('ContactPage');
  return (
    <div className="grid grid-cols-2 gap-6 flex-1">
      <div className="col-span-2 place-content-start text-center mt-36">
        <h2 className="text-5xl font-bold w-full">{t('title')}</h2>
        <p className="text-xl font-normal w-full mt-8">{t('email')}</p>
        <div className="w-full flex gap-8 justify-center mt-8">
          <InteractiveKeypad />
        </div>
      </div>
    </div>
  );
}
