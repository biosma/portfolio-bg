import { useTranslations } from 'next-intl';
import TextPressure from '@/components/text-pressure';

export default function Page() {
  const t = useTranslations('HomePage');
  return (
    <div className="grid flex-1 grid-cols-1 place-content-start gap-4 md:place-content-end md:place-items-start md:gap-9">
      <div className="hidden md:flex">
        <TextPressure
          text={t('name')}
          fontFamily="Roboto Mono, monospace"
          minFontSize={64}
          width={true}
          weight={true}
          italic={false}
          alpha={false}
          flex={false}
          scale={false}
          // textColor="#fff"
          className="font-bold"
        />
      </div>
      <div className="flex md:hidden">
        <TextPressure
          text={t('name')}
          fontFamily="Roboto Mono, monospace"
          minFontSize={32}
          width={true}
          weight={true}
          italic={false}
          alpha={false}
          flex={false}
          scale={false}
          // textColor="#fff"
          className="font-bold"
        />
      </div>
      <p className="text-xl font-normal">{t('jobTitle')}</p>
    </div>
  );
}
