'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import React, {
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

interface FullscreenOverlayProps {
  rect: DOMRect;
  children: React.ReactNode;
  onAnimationComplete: () => void;
  initialRotation?: { rotateX?: number; rotateY?: number };
}

function FullscreenOverlay({
  rect,
  children,
  onAnimationComplete,
  initialRotation = { rotateX: 8, rotateY: -8 },
}: FullscreenOverlayProps) {
  return createPortal(
    <>
      {/* Fondo Blur */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 0.33, backdropFilter: 'blur(7px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9998,
          pointerEvents: 'none',
        }}
      />
      <AnimatePresence>
        {rect && (
          <motion.div
            initial={{
              position: 'fixed',
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              zIndex: 9999,
              borderRadius: 20,
              boxShadow: '0 10px 24px rgba(0,0,0,0.16)',
              background: '#fff',
              rotateX: initialRotation.rotateX ?? 0,
              rotateY: initialRotation.rotateY ?? 0,
              scale: 1,
              opacity: 1,
              transformOrigin: 'center center',
              willChange: 'transform, border-radius, box-shadow',
            }}
            animate={{
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: 0,
              boxShadow: '0 0px 0px rgba(0,0,0,0.01)',
              background: '#fff',
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.82,
              ease: [0.48, 0, 0.52, 1],
              rotateX: { duration: 0.55, ease: [0.48, 0, 0.52, 1] },
              rotateY: { duration: 0.55, ease: [0.48, 0, 0.52, 1] },
              scale: { duration: 0.7, ease: [0.44, 0, 0.56, 1] },
              borderRadius: { duration: 0.77, ease: [0.44, 0, 0.56, 1] },
              boxShadow: { duration: 0.8 },
              opacity: { duration: 0.13, ease: 'easeOut' },
            }}
            onAnimationComplete={onAnimationComplete}
            style={{
              perspective: '1400px',
              transformOrigin: 'center center',
              pointerEvents: 'auto',
              overflow: 'visible',
              willChange: 'transform, border-radius, box-shadow',
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}

interface AnimatedCardProps extends PropsWithChildren {
  href: string;
  className?: string;
  fullscreenContent?: React.ReactNode;
  initialRotation?: { rotateX?: number; rotateY?: number };
}

export function AnimatedCard({
  href,
  children,
  className = '',
  fullscreenContent,
  initialRotation = { rotateX: 8, rotateY: -8 },
  ...props
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const destinationRef = useRef(href);

  const [expanding, setExpanding] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Dispara la navegación después de la animación
  const handleAnimationComplete = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);

    // Marca la transición (opcional)
    sessionStorage.setItem('overlay-transition', '1');
    destinationRef.current = href;

    // Llama a router.push una vez terminada la animación
    requestAnimationFrame(() => {
      router.push(href);
    });
  }, [href, router, isNavigating]);

  // Efecto: Detecta el cambio de ruta y recién ahí limpia el overlay
  useEffect(() => {
    if (!isNavigating) return;
    if (pathname === destinationRef.current) {
      setExpanding(false);
      setShowOverlay(false);
      setIsNavigating(false);
      setRect(null);
    }
  }, [pathname, isNavigating]);

  // Click en la card dispara la animación
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (expanding || showOverlay || isNavigating) return;
    if (!cardRef.current) return;
    const boundingRect = cardRef.current.getBoundingClientRect();
    setRect(boundingRect);
    setShowOverlay(true);
    setExpanding(true);
  };

  // Reset por si se desmonta en mitad de transición
  useEffect(() => {
    return () => {
      setExpanding(false);
      setShowOverlay(false);
      setIsNavigating(false);
      setRect(null);
    };
  }, []);

  const showMiniatureRotation = !showOverlay && !expanding && !isNavigating;

  return (
    <>
      <div
        ref={cardRef}
        className={`cursor-pointer w-full h-full transition-opacity duration-300 ${className} ${
          expanding || isNavigating ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClick}
        style={{
          transform: showMiniatureRotation
            ? `perspective(1400px) rotateX(${initialRotation.rotateX}deg) rotateY(${initialRotation.rotateY}deg)`
            : 'none',
          transformOrigin: 'center center',
          pointerEvents: expanding || isNavigating ? 'none' : 'auto',
        }}
        {...props}
      >
        {children}
      </div>
      {showOverlay && rect && (
        <FullscreenOverlay
          rect={rect}
          onAnimationComplete={handleAnimationComplete}
          initialRotation={initialRotation}
        >
          {fullscreenContent || children}
        </FullscreenOverlay>
      )}
    </>
  );
}
