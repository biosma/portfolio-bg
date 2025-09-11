'use client';

import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Page() {
  const t = useTranslations('AboutPage');
  return (
    <div className="grid flex-1 grid-cols-12 place-content-center gap-6">
      <div className="col-span-12 flex flex-col flex-wrap gap-9 md:col-span-7">
        <h2 className="text-3xl font-bold md:text-5xl">{t('title')}</h2>
        <p className="text-md font-normal md:text-xl">{t('description_1')}</p>
        <p className="text-md font-normal md:text-xl">{t('description_2')}</p>
        <div>
          <p className="text-xs font-normal md:text-sm">{t('description_3')}</p>
          <p className="text-xs font-normal md:text-sm">{t('description_4')}</p>
        </div>
      </div>
      <div className="col-span-12 md:col-span-1" />
      <div className="col-span-12 md:col-span-4">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[Autoplay()]}
        >
          <p className="text-md mb-4 font-normal md:text-xl">
            {t('work_experience')}
          </p>

          <CarouselContent>
            <CarouselItem className="flex cursor-pointer flex-col flex-wrap gap-4">
              <p className="cursor-pointer font-normal text-[rgba(40,40,40,0.6)] dark:text-white">
                {t('work_experience_2_date')}
              </p>
              <p className="cursor-pointer whitespace-nowrap font-medium">
                {t('work_experience_2_title')}
              </p>
              <p className="cursor-pointer text-xs font-normal md:text-sm">
                {t('work_experience_2_experience_1')}
              </p>
              <p className="cursor-pointer text-xs font-normal md:text-sm">
                {t('work_experience_2_experience_2')}
              </p>
              <p className="cursor-pointer text-xs font-normal md:text-sm">
                {t('work_experience_2_experience_3')}
              </p>
              <p className="cursor-pointer text-xs font-normal md:text-sm">
                {t('work_experience_2_experience_4')}
              </p>
            </CarouselItem>
            <CarouselItem className="flex cursor-pointer flex-col flex-wrap gap-4">
              <p className="cursor-pointer font-normal text-[rgba(40,40,40,0.6)] dark:text-white">
                {t('work_experience_1_date')}
              </p>
              <p className="cursor-pointer whitespace-nowrap font-medium">
                {t('work_experience_1_title')}
              </p>
              <p className="cursor-pointer text-xs font-normal md:text-sm">
                {t('work_experience_1_experience_1')}
              </p>
              <p className="cursor-pointer text-xs font-normal md:text-sm">
                {t('work_experience_1_experience_2')}
              </p>
              <p className="cursor-pointer text-xs font-normal md:text-sm">
                {t('work_experience_1_experience_3')}
              </p>
              <p className="cursor-pointer text-xs font-normal md:text-sm">
                {t('work_experience_1_experience_4')}
              </p>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <p className="mt-4 text-xs font-normal text-[rgba(40,40,40,0.6)] dark:text-white">
          {t('work_experience_technologies')}
        </p>
      </div>
    </div>
  );
}
