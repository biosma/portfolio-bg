import TextPressure from '@/components/text-pressure';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('HomePage');
  return (
    <div className="flex-1 flex flex-col items-start justify-end">
      <div className="flex flex-col flex-wrap gap-9 mb-9">
        <TextPressure
          text={t('name')}
          fontFamily="Roboto Mono, monospace"
          minFontSize={64}
          width={false}
          weight={true}
          italic={false}
          alpha={false}
          flex={false}
          scale={false}
          // textColor="#fff"
          className="font-bold"
        />{' '}
        <p className="text-xl font-normal">{t('jobTitle')}</p>
      </div>
    </div>
  );
}
