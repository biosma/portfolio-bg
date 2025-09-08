'use client';

import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  images: string[];
  startIndex?: number;
  open: boolean;
  onClose: () => void;
  autoplay?: boolean;
};

export function LightboxCarousel({
  images,
  startIndex = 0,
  open,
  onClose,
  autoplay = false,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 20, watchDrag: true }, [
    Fade(),
    ...(autoplay ? [Autoplay({ delay: 3500 })] : []),
  ]);

  useEffect(() => {
    if (emblaApi && open) {
      emblaApi.reInit();
      emblaApi.scrollTo(startIndex, true);
    }
  }, [emblaApi, open, startIndex]);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') emblaApi?.scrollPrev();
      if (e.key === 'ArrowRight') emblaApi?.scrollNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, emblaApi, onClose]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100000] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Cerrar al click en backdrop */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 w-full h-full z-0" // 👈 z-0
          />
          {/* Contenedor del carrusel */}
          <motion.div
            className="fixed inset-0 mx-auto my-auto max-w-6xl w-[92vw] h-[78vh] rounded-2xl overflow-visible flex flex-col items-center justify-center p-4 z-10" // 👈 z-10
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 inline-flex items-center justify-center rounded-full p-2 bg-white/90 hover:bg-white shadow cursor-pointer z-500"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Controles */}
            <div className="absolute inset-y-0 left-0 z-20 flex items-center p-3">
              <button
                onClick={scrollPrev}
                className="rounded-full p-2 bg-white/90 hover:bg-white shadow z-500 cursor-pointer"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 z-20 flex items-center p-3">
              <button
                onClick={scrollNext}
                className="rounded-full p-2 bg-white/90 hover:bg-white shadow z-500 cursor-pointer"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* --- STAGE: aquí va la imagen con borde redondeado + shadow --- */}
            <div className="relative w-full max-w-5xl grow-[0]">
              <div className="relative w-full h-[64vh] rounded-2xl overflow-hidden">
                <div className="embla h-full" ref={emblaRef}>
                  <div className="embla__container h-full">
                    {images.map((src, i) => (
                      <div key={i} className="embla__slide absolute inset-0">
                        <Image
                          src={src}
                          alt={`Slide ${i + 1}`}
                          fill
                          className="rounded-2xl shadow-2xl object-contain"
                          priority={i === 0}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* --- Dots DEBAJO del stage --- */}
            <div className="mt-4">
              <Dots emblaApi={emblaApi} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Dots({ emblaApi }: { emblaApi: ReturnType<typeof useEmblaCarousel>[1] }) {
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onInit = () => {
      setCount(emblaApi.slideNodes().length);
      onSelect();
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onInit);
    onInit();

    // ⬇️ cleanup que NO retorna nada
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onInit);
    };
  }, [emblaApi]);

  return (
    <div className="flex items-center justify-center gap-2">
      {' '}
      {/* 👈 sin absolute */}
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => emblaApi?.scrollTo(i)}
          className={`h-2.5 rounded-full transition-all ${
            i === selected ? 'bg-white w-6' : 'bg-white/50 w-2.5'
          }`}
          aria-label={`Ir al slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* --- CSS mínimo para Embla + fade (Tailwind + utilidades) ---
   Si ya tenés un CSS global, podés mover estas clases ahí.
*/
