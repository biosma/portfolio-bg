'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('AboutPage');
  return (
    <div className="grid grid-cols-12 flex-1 place-content-center gap-6">
      <div className="col-span-7 flex flex-col flex-wrap gap-9">
        <h2 className="text-5xl font-bold">{t('title')}</h2>
        <p className="text-xl font-normal">{t('description_1')}</p>
        <p className="text-xl font-normal">{t('description_2')}</p>
        <div>
          <p className="text-sm font-normal">{t('description_3')}</p>
          <p className="text-sm font-normal">{t('description_4')}</p>
        </div>
      </div>
      <div className="col-span-1" />
      <div className="col-span-4">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[Autoplay()]}
        >
          <p className="text-xl font-normal mb-4">{t('work_experience')}</p>

          <CarouselContent>
            <CarouselItem className="cursor-pointer flex flex-col flex-wrap gap-4">
              <p className="cursor-pointer font-normal text-[rgba(40,40,40,0.6)] dark:text-white">
                {t('work_experience_2_date')}
              </p>
              <p className="cursor-pointer font-medium whitespace-nowrap">
                {t('work_experience_2_title')}
              </p>
              <p className="cursor-pointer text-sm font-normal">
                {t('work_experience_2_experience_1')}
              </p>
              <p className="cursor-pointer text-sm font-normal">
                {t('work_experience_2_experience_2')}
              </p>
              <p className="cursor-pointer text-sm font-normal">
                {t('work_experience_2_experience_3')}
              </p>
              <p className="cursor-pointer text-sm font-normal">
                {t('work_experience_2_experience_4')}
              </p>
            </CarouselItem>
            <CarouselItem className="cursor-pointer flex flex-col flex-wrap gap-4">
              <p className="cursor-pointer font-normal text-[rgba(40,40,40,0.6)] dark:text-white">
                {t('work_experience_1_date')}
              </p>
              <p className="cursor-pointer font-medium whitespace-nowrap">
                {t('work_experience_1_title')}
              </p>
              <p className="cursor-pointer text-sm font-normal">
                {t('work_experience_1_experience_1')}
              </p>
              <p className="cursor-pointer text-sm font-normal">
                {t('work_experience_1_experience_2')}
              </p>
              <p className="cursor-pointer text-sm font-normal">
                {t('work_experience_1_experience_3')}
              </p>
              <p className="cursor-pointer text-sm font-normal">
                {t('work_experience_1_experience_4')}
              </p>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <p className="text-xs font-normal text-[rgba(40,40,40,0.6)] dark:text-white mt-4">
          {t('work_experience_technologies')}
        </p>
      </div>
    </div>
  );
}
