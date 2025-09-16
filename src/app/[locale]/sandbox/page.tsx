'use client';

import { useTranslations } from 'next-intl';
import InteractiveKeypad from '@/components/interactive-keypad';
import Link from 'next/link';
import StringyHand from '@/components/stringy-hand';

export default function Page() {
  const t = useTranslations('SandboxPage');
  
  return (
    <div className="grid flex-1 grid-cols-2 gap-6">
      <div className="col-span-2 place-content-start text-center">
        <h2 className="w-full text-3xl md:text-5xl font-bold">{t('title')}</h2>
        <div className="mt-16 flex flex-wrap md:flex-nowrap w-full 2xl:w-1/2 justify-center gap-8 md:justify-start border border-black dark:border-white rounded-lg p-6">
          <div className='w-full md:w-fit'><InteractiveKeypad /></div>
          <div className='w-full md:w-fit'>
            {t.rich('first_component', {
              link: (chunks) => (
                <Link
                  href="https://codepen.io/jh3y/pen/WbQNxXb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  {chunks}
                </Link>
              ),
            })}
          </div>
        </div>
        {/* <div className="mt-16 flex flex-wrap md:flex-nowrap w-full 2xl:w-1/2 justify-center gap-8 md:justify-start border border-black dark:border-white rounded-lg p-6">
          <div className='w-full md:w-fit'><StringyHand /></div>
          <div className='w-full md:w-fit'>
            {t.rich('first_component', {
              link: (chunks) => (
                <Link
                  href="https://codepen.io/jh3y/pen/WbQNxXb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  {chunks}
                </Link>
              ),
            })}
          </div>
        </div> */}
      </div>
    </div>
  );
}
