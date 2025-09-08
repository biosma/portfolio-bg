'use client';

import { AnimatedCard } from '@/components/animated-card';
import { MenaHomesSection } from '@/components/sections/MenaHomesSection';
import { MentisSection } from '@/components/sections/MentisSection';
import { RecoveryDeliveredSection } from '@/components/sections/RecoveryDeliveredSection';
import { TradenethubSection } from '@/components/sections/TradenethubSection';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { ReactNode, RefObject, useCallback, useEffect, useMemo, useRef } from 'react';

type CardSwapProps = {
  children: ReactNode;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
};

function CardSwap({
  children,
  cardDistance = 40,
  verticalDistance = 20,
  delay = 3000,
  pauseOnHover = true,
  skewAmount = 3,
  easing = 'elastic',
}: CardSwapProps) {
  const cards = React.Children.toArray(children);
  const visibleCards = 4;

  const refs = useMemo(
    () => cards.map(() => React.createRef<HTMLDivElement>()),
    [cards],
  ) as RefObject<HTMLDivElement>[];

  const order = useRef<number[]>([...Array(cards.length).keys()]);
  const intervalRef = useRef<number | null>(null);
  const isAnimating = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  type Slot = {
    x: number;
    y: number;
    scale: number;
    rotateY: number;
    zIndex: number;
    opacity: number;
    visible: boolean;
  };

  function makeSlot(i: number): Slot {
    return {
      x: i * cardDistance,
      y: i * verticalDistance,
      scale: 1 - i * 0.05,
      rotateY: i * skewAmount,
      zIndex: 100 - i,
      opacity: 1,
      visible: i < visibleCards,
    };
  }

  // Función mejorada para marcar elementos con mejor control
  const markElementsForScramble = useCallback((safe: boolean) => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('[data-scramble-target]');
    elements.forEach((el) => {
      if (safe) {
        el.removeAttribute('data-no-scramble');
      } else {
        el.setAttribute('data-no-scramble', 'true');
      }
    });
  }, []);

  // Función para disparar evento personalizado cuando sea seguro hacer scramble
  const notifyScrambleReady = useCallback(() => {
    const event = new CustomEvent('cardswap-ready', {
      detail: { containerId: 'card-swap-container' },
    });
    window.dispatchEvent(event);
  }, []);

  function placeNow() {
    markElementsForScramble(false);

    let completedPlacements = 0;
    const totalPlacements = order.current.length;

    order.current.forEach((idx, i) => {
      const slot = makeSlot(i);
      const el = refs[idx].current;
      if (el) {
        gsap.set(el, {
          x: slot.x,
          y: slot.y,
          scale: slot.scale,
          rotateY: slot.rotateY,
          zIndex: slot.zIndex,
          opacity: slot.visible ? slot.opacity : 0,
          visibility: slot.visible ? 'visible' : 'hidden',
          onComplete: () => {
            completedPlacements++;
            if (completedPlacements === totalPlacements) {
              // Usar requestAnimationFrame para asegurar que el DOM esté actualizado
              requestAnimationFrame(() => {
                markElementsForScramble(true);
                notifyScrambleReady();
              });
            }
          },
        });
      }
    });
  }

  useEffect(() => {
    placeNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  function swap() {
    if (order.current.length < 2 || isAnimating.current) return;

    isAnimating.current = true;
    markElementsForScramble(false);

    const [front, ...rest] = order.current;
    const elFront = refs[front].current;

    gsap.to(elFront, {
      y: '+=400',
      opacity: 0,
      duration: 0.6,
      ease: 'power1.in',
      onComplete: () => {
        order.current = [...rest, front];

        const slot = makeSlot(visibleCards - 1);
        gsap.set(elFront, {
          x: slot.x,
          y: slot.y,
          scale: slot.scale,
          rotateY: slot.rotateY,
          zIndex: slot.zIndex,
          opacity: slot.opacity,
          visibility: 'visible',
        });

        let completed = 0;
        const totalAnimations = order.current.filter((_, i) => i < visibleCards).length;

        order.current.forEach((idx, i) => {
          if (i < visibleCards) {
            const el = refs[idx].current;
            const slot = makeSlot(i);
            if (el) {
              gsap.to(el, {
                x: slot.x,
                y: slot.y,
                scale: slot.scale,
                rotateY: slot.rotateY,
                zIndex: slot.zIndex,
                opacity: slot.opacity,
                visibility: 'visible',
                duration: 0.6,
                ease: 'power1.inOut',
                onComplete: () => {
                  completed++;
                  if (completed === totalAnimations) {
                    isAnimating.current = false;
                    // Usar requestAnimationFrame para sincronización
                    requestAnimationFrame(() => {
                      markElementsForScramble(true);
                      notifyScrambleReady();
                    });
                  }
                },
              });
            }
          }
        });
      },
    });
  }

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(swap, delay);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, cards.length]);

  useEffect(() => {
    if (!pauseOnHover) return;
    const node = containerRef.current;
    if (!node) return;

    const pause = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };

    const resume = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(swap, delay);
    };

    node.addEventListener('mouseenter', pause);
    node.addEventListener('mouseleave', resume);

    return () => {
      node.removeEventListener('mouseenter', pause);
      node.removeEventListener('mouseleave', resume);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseOnHover, delay]);

  return (
    <div
      id="card-swap-container"
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto h-[500px]"
      style={{ perspective: '1000px' }}
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          ref={refs[idx]}
          className={`${easing} absolute inset-0 transition-all duration-1000 ease-out`}
          style={{ willChange: 'transform, opacity' }}
          data-no-scramble="true"
          data-scramble-target="true" // Marcador para identificar elementos del CardSwap
        >
          {card}
        </div>
      ))}
    </div>
  );
}

// Componente para crear una miniatura exacta del layout
interface MiniatureLayoutProps {
  children: React.ReactNode;
  scale?: number; // Factor de escala para hacer la miniatura
  showNavbar?: boolean;
}

function MiniatureLayout({
  children,
  scale = 0.25, // 25% del tamaño original por defecto
}: MiniatureLayoutProps) {
  return (
    <div
      className="w-full h-full origin-top-left overflow-hidden"
      style={{
        transform: `scale(${scale})`,
        width: `${100 / scale}%`, // Compensar el scale
        height: `${100 / scale}%`,
      }}
    >
      {/* Recrear el fondo exacto del layout */}
      <div className="absolute inset-0 bg-[url('/background-light.png')] dark:bg-[url('/background-dark.png')] bg-cover bg-no-repeat opacity-100 dark:opacity-0" />
      <div className="absolute inset-0 bg-[url('/background-dark.png')] bg-cover bg-no-repeat opacity-0 dark:opacity-100" />

      {/* Container principal igual al layout */}
      <div className="flex flex-col min-h-screen py-[72px] px-[60px] relative">
        <div className="flex flex-col flex-1 text-[rgba(40,40,40,1)] dark:text-white">
          {/* Contenido principal */}
          <div className="flex flex-col flex-1 p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Componente BrowserWindow mejorado que mantiene proporciones
function BrowserWindow({
  children,
  url,
  maintainAspect = false,
}: {
  children: React.ReactNode;
  url?: string;
  maintainAspect?: boolean;
}) {
  return (
    <div className="relative w-full h-full">
      <div
        className="rounded-xl shadow-2xl bg-white overflow-hidden border border-gray-200 h-full flex flex-col"
        style={{
          transform: maintainAspect ? 'perspective(1000px) rotateX(5deg) rotateY(-5deg)' : 'none',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header del browser */}
        <div className="flex items-center h-12 px-4 bg-gray-100 border-b border-gray-200 flex-shrink-0">
          <div className="flex gap-2 items-center mr-4">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>

          <div className="flex items-center flex-1 gap-3">
            <div className="flex gap-1 dark:text-black">
              <div className="p-1">←</div>
              <div className="p-1">→</div>
              <div className="p-1">↻</div>
            </div>

            <div className="flex-1 flex items-center">
              <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700">
                🔒 {url || 'gonzalo-bonelli.com'}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido con fondo exacto del layout */}
        <div className="flex-1 relative overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default function ProjectsShowcase() {
  const t = useTranslations('WorkPage');
  const router = useRouter();
  const projects = [
    {
      id: 1,
      title: 'TradeNetHub',
      subtitle: 'Front-end Lead Developer (2024 – Present)',
      description:
        'Led the front-end development of a custom ERP system for an international trade platform. Application architecture with React, Next.js, TypeScript, GraphQL and Firebase-based auth. Built custom modules: scheduling/calendar, dashboards (Recharts), invoicing, DocuSign.',
      rightTitle: 'Stack',
      rightBody: <TradenethubSection miniature={true} />,
      location: 'Argentina • Remote',
      projectUrl: 'tradenethub.com',
      url: 'work/tradenethub',
    },
    {
      id: 2,
      title: 'Mena Homes',
      subtitle: 'Lead Developer (2023 – 2024)',
      description:
        'Lideré el desarrollo de una plataforma de real estate completa con búsqueda avanzada, mapas interactivos y sistema de gestión de propiedades. Implementé arquitectura escalable con microservicios.',
      rightTitle: 'Stack',
      rightBody: <MenaHomesSection miniature={true} />,
      location: 'UAE • Remote',
      projectUrl: 'mena-homes.com',
      url: 'work/mena-homes',
    },
    {
      id: 3,
      title: 'Mentis',
      subtitle: 'Full-stack Developer (2022 – 2023)',
      description:
        'Desarrollo y mantenimiento de soluciones educativas innovadoras. Creé plataformas interactivas de aprendizaje con gamificación y análisis de progreso estudiantil.',
      rightTitle: 'Stack',
      rightBody: <MentisSection miniature={true} />,
      location: 'Argentina • Hybrid',
      projectUrl: 'mentis.edu',
      url: 'work/mentis',
    },
    {
      id: 4,
      title: 'Recovery Delivered',
      subtitle: 'Healthcare Platform Developer (2021 – 2022)',
      description:
        'Plataforma healthcare basada en FHIR con refactor completo en tiempo récord. Integré sistemas de telemedicina y gestión de pacientes con estándares internacionales.',
      rightTitle: 'Stack',
      rightBody: <RecoveryDeliveredSection miniature={true} />,
      location: 'USA • Remote',
      projectUrl: 'recovery-delivered.com',
      url: 'work/recovery-delivered',
    },
  ];
  useEffect(() => {
    projects.forEach((project) => {
      router.prefetch(project.url);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div className="grid grid-cols-12 flex-1 place-content-center gap-6">
      <div className="col-span-6 flex flex-col flex-wrap gap-9">
        <h2 className="text-3xl font-bold">{t('title')}</h2>
        <p className="text-lg font-normal">{t('description_1')}</p>
        <p className="text-lg font-normal">{t('description_2')}</p>
      </div>

      <div className="col-span-6 flex-1">
        <CardSwap
          cardDistance={70}
          verticalDistance={20}
          delay={3000}
          pauseOnHover={true}
          skewAmount={1}
          easing={'linear'}
        >
          {projects.map((project) => (
            <AnimatedCard
              key={project.id}
              href={project.url}
              fullscreenContent={
                <BrowserWindow url={project.projectUrl} maintainAspect={false}>
                  <MiniatureLayout scale={1} showNavbar={true}>
                    {project.rightBody}
                  </MiniatureLayout>
                </BrowserWindow>
              }
            >
              <BrowserWindow url={project.projectUrl} maintainAspect={true}>
                <MiniatureLayout scale={0.8} showNavbar={true}>
                  {project.rightBody}
                </MiniatureLayout>
              </BrowserWindow>
            </AnimatedCard>
          ))}
        </CardSwap>
      </div>
    </div>
  );
}
