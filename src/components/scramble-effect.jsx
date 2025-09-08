'use client';

import { useLocale } from 'next-intl';
import { useCallback, useEffect, useRef } from 'react';

function scrambleText(el, opts = {}) {
  if (!el) return;

  const chars = '!<>-_\\/[]{}—=+*^?#________';
  const original = el.textContent;
  let frame = 0;
  let frameRequest = null;
  let queue = [];
  const speed = opts.speed ?? 40;

  // Verificaciones de seguridad más estrictas
  if (el.hasAttribute('data-no-scramble')) {
    return;
  }

  const runId = Math.random();
  el._scrambleRunId = runId;

  function randomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function setTextSafe(newText) {
    // Verificaciones más estrictas
    if (el._scrambleRunId !== runId) return;
    if (el.hasAttribute('data-no-scramble')) return;
    if (!el.parentElement) return;
    if (!document.body.contains(el)) return;

    try {
      el.textContent = newText;
    } catch (e) {
      // Elemento fue removido del DOM
      cancelAnimationFrame(frameRequest);
      return;
    }
  }

  function update() {
    if (el._scrambleRunId !== runId) return;
    if (el.hasAttribute('data-no-scramble')) {
      cancelAnimationFrame(frameRequest);
      return;
    }

    let output = '';
    let complete = 0;
    for (let i = 0; i < queue.length; i++) {
      const { from, to, start, end } = queue[i];
      if (frame >= end) {
        output += to;
        complete++;
      } else if (frame >= start) {
        output += randomChar();
      } else {
        output += from;
      }
    }
    setTextSafe(output);

    if (complete === queue.length) {
      cancelAnimationFrame(frameRequest);
      setTextSafe(original);
      return;
    }
    frame++;
    frameRequest = requestAnimationFrame(update);
  }

  // Limpieza anterior
  if (frameRequest) {
    cancelAnimationFrame(frameRequest);
  }

  queue = [];
  for (let i = 0; i < original.length; i++) {
    queue.push({
      from: original[i],
      to: original[i],
      start: Math.floor(Math.random() * 4),
      end: Math.floor(Math.random() * 6) + 8,
    });
  }
  frame = 0;
  frameRequest = requestAnimationFrame(update);
}

export default function GlobalScrambleEffect({
  tags = ['h1', 'h2', 'h3', 'p', 'a', 'span'],
  speed = 40,
}) {
  const locale = useLocale();
  const prevLocale = useRef(locale);
  const scrambleTimeoutRef = useRef(null);

  const executeScramble = useCallback(() => {
    // Limpiar timeout anterior
    if (scrambleTimeoutRef.current) {
      clearTimeout(scrambleTimeoutRef.current);
    }

    scrambleTimeoutRef.current = setTimeout(() => {
      // Selector mejorado que excluye elementos del CardSwap
      const selector = tags
        .map((tag) => `${tag}:not([data-no-scramble]):not([data-scramble-target])`)
        .join(',');

      const nodes = Array.from(document.querySelectorAll(selector));

      // Filtrar elementos vacíos y elementos dentro de CardSwap
      const validNodes = nodes.filter((el) => {
        const text = el.textContent?.trim();
        if (!text || text.length === 0) return false;

        // Verificar que no esté dentro de un CardSwap
        const cardSwapContainer = el.closest('#card-swap-container');
        if (cardSwapContainer) return false;

        return true;
      });
      validNodes.forEach((el, index) => {
        setTimeout(() => {
          scrambleText(el, { speed });
        }, index * 10);
      });
    }, 150); // Aumentar el delay para mejor sincronización
  }, [tags, speed]);

  // Escuchar el evento personalizado del CardSwap
  useEffect(() => {
    const handleCardSwapReady = () => {
      // Ejecutar scramble solo en elementos seguros cuando CardSwap esté listo
      executeScramble();
    };

    window.addEventListener('cardswap-ready', handleCardSwapReady);
    return () => {
      window.removeEventListener('cardswap-ready', handleCardSwapReady);
    };
  }, [executeScramble]);

  useEffect(() => {
    // Ejecutar scramble inicial con delay
    const initialTimeout = setTimeout(() => {
      executeScramble();
    }, 0);

    return () => clearTimeout(initialTimeout);
  }, [executeScramble]);

  useEffect(() => {
    if (prevLocale.current !== locale) {
      executeScramble();
      prevLocale.current = locale;
    }
  }, [locale, executeScramble]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrambleTimeoutRef.current) {
        clearTimeout(scrambleTimeoutRef.current);
      }
    };
  }, []);

  return null;
}
