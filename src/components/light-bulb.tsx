'use client';

import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import React, { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(Draggable, MorphSVGPlugin);

interface LightSwitchToggleProps {
  onChange: (theme: 'light' | 'dark') => void;
  theme?: 'light' | 'dark';
}

const INITIAL_CORD_START = { x: 98, y: 227 };
const INITIAL_CORD_END = { x: 98, y: 380 };
const PATHS = [
  'M98,227 Q98,300 98,380',
  'M98,227 Q112,320 98,380',
  'M98,227 Q84,320 98,380',
  'M98,227 Q118,350 98,380',
  'M98,227 Q78,350 98,380',
];
const TRAVEL_THRESHOLD = 50;

const LightSwitchToggle: React.FC<LightSwitchToggleProps> = ({ onChange, theme }) => {
  const [showMorph, setShowMorph] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const morphCordRef = useRef<SVGPathElement>(null);
  const dummyCordRef = useRef<SVGLineElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef<HTMLDivElement | null>(null);
  const startDrag = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current || !morphCordRef.current || !dummyCordRef.current || !handleRef.current)
      return;

    const proxy = document.createElement('div');
    proxyRef.current = proxy;
    document.body.appendChild(proxy);

    const morphCord = morphCordRef.current;
    const dummyCord = dummyCordRef.current;

    // Siempre resetea ambos a posición inicial
    gsap.set(morphCord, { attr: { d: PATHS[0] } });
    gsap.set(dummyCord, {
      attr: { x2: INITIAL_CORD_END.x, y2: INITIAL_CORD_END.y },
    });

    const animateMorph = () => {
      gsap.set(morphCord, { attr: { d: PATHS[0] } }); // reset start shape
      setShowMorph(true);
      gsap.to(
        {},
        {
          duration: 0.01,
          onComplete: () => {
            const tl = gsap.timeline({
              onComplete: () => {
                setShowMorph(false);
                gsap.set(dummyCord, {
                  attr: { x2: INITIAL_CORD_END.x, y2: INITIAL_CORD_END.y },
                });
              },
            });
            tl.to(morphCord, { morphSVG: PATHS[1], duration: 0.09, yoyo: true, repeat: 1 })
              .to(morphCord, { morphSVG: PATHS[2], duration: 0.09, yoyo: true, repeat: 1 })
              .to(morphCord, { morphSVG: PATHS[3], duration: 0.12, yoyo: true, repeat: 1 })
              .to(morphCord, { morphSVG: PATHS[4], duration: 0.12, yoyo: true, repeat: 1 })
              .to(morphCord, { morphSVG: PATHS[0], duration: 0.18, ease: 'elastic.out(1,0.6)' });
          },
        },
      );
    };

    const toggle = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      onChange(newTheme);
    };

    Draggable.create(proxy, {
      trigger: handleRef.current,
      type: 'x,y',
      onPress(e) {
        startDrag.current = { x: e.x, y: e.y };
      },
      onDrag() {
        const bounds = svgRef.current!.getBoundingClientRect();
        const ratio = 1 / (bounds.width / 134);
        const dx = (this.x - this.startX) * ratio;
        const dy = (this.y - this.startY) * ratio;
        gsap.set(dummyCord, {
          attr: {
            x2: INITIAL_CORD_END.x + dx,
            y2: INITIAL_CORD_END.y + dy,
          },
        });
      },
      onRelease(e) {
        const dx = Math.abs(e.x - startDrag.current.x);
        const dy = Math.abs(e.y - startDrag.current.y);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > TRAVEL_THRESHOLD) {
          animateMorph();
          toggle();
        } else {
          gsap.to(dummyCord, {
            attr: { x2: INITIAL_CORD_END.x, y2: INITIAL_CORD_END.y },
            duration: 0.18,
            ease: 'elastic.out(1,0.6)',
          });
        }
      },
    });

    return () => {
      if (proxyRef.current) {
        document.body.removeChild(proxyRef.current);
        proxyRef.current = null;
      }
    };
  }, [theme, onChange]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed top-14 right-18 w-12 h-12 select-none" style={{ zIndex: 40 }}>
      <button
        aria-pressed={mounted ? theme === 'light' : undefined}
        className="w-full h-full absolute top-0 left-0 z-10 bg-transparent border-0 p-0 grid place-items-center cursor-pointer"
        onClick={(e) => e.preventDefault()}
        tabIndex={0}
        style={{ outline: 'none' }}
      >
        <span className="sr-only">Toggle theme</span>
        <svg
          ref={svgRef}
          aria-hidden="true"
          className="toggle-scene overflow-visible absolute w-3/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="32 32 134 134"
        >
          <defs>
            <marker id="cord-end" orient="auto" overflow="visible" refX="0" refY="0">
              <path
                className="cord-end"
                fillRule="evenodd"
                strokeWidth=".2666"
                d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z"
                fill={theme === 'light' ? '#374151' : '#9CA3AF'}
                stroke={theme === 'light' ? '#374151' : '#9CA3AF'}
              />
            </marker>
          </defs>
          {/* MorphSVG cuerda */}
          <path
            ref={morphCordRef}
            markerEnd="url(#cord-end)"
            fill="none"
            strokeLinecap="square"
            strokeWidth="6"
            d={PATHS[0]}
            stroke={theme === 'light' ? '#374151' : '#9CA3AF'}
            style={{ display: showMorph ? 'block' : 'none' }}
          />
          {/* Dummy cuerda recta */}
          <line
            ref={dummyCordRef}
            x1={INITIAL_CORD_START.x}
            y1={INITIAL_CORD_START.y}
            x2={INITIAL_CORD_END.x}
            y2={INITIAL_CORD_END.y}
            stroke={theme === 'light' ? '#374151' : '#9CA3AF'}
            strokeWidth="6"
            markerEnd="url(#cord-end)"
            style={{ display: showMorph ? 'none' : 'block' }}
          />
          {/* Bombilla */}
          <g className={`bulb transition-all duration-300`}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4.677"
              d="M67.454 182.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"
              fill={theme === 'light' ? '#6B7280' : '#4B5563'}
              stroke={theme === 'light' ? '#374151' : '#9CA3AF'}
            />
            <g fill="none" strokeLinecap="round" strokeWidth="5">
              <path
                d="M89.086 178.875l-8.858-33.06"
                stroke={theme === 'light' ? '#F59E0B' : '#6B7280'}
                strokeWidth={theme === 'light' ? '8' : '5'}
              />
              <path
                d="M104.228 178.875l8.858-33.06"
                stroke={theme === 'light' ? '#F59E0B' : '#6B7280'}
                strokeWidth={theme === 'light' ? '8' : '5'}
              />
            </g>
            <path
              strokeLinecap="round"
              strokeWidth="5"
              d="M58.808 158.855c5.251 8.815 5.295 21.32 13.272 27.774 12.299 8.045 36.46 8.115 49.127 0 7.976-6.454 8.022-18.96 13.273-27.774 3.992-6.7 14.408-19.811 14.408-19.811 8.276-11.539 12.769-24.594 12.769-38.699 0-35.898-29.102-65-65-65-35.899 0-65 29.102-65 65 0 13.667 4.217 26.348 12.405 38.2 0 0 10.754 13.61 14.746 20.31z"
              stroke={theme === 'light' ? '#374151' : '#9CA3AF'}
              fill={theme === 'light' ? '#FEF3C7' : 'transparent'}
            />
            {theme === 'light' && (
              <circle
                cx="96.657"
                cy="98.939"
                r="83.725"
                fill="none"
                stroke="#F59E0B"
                strokeDasharray="10,30"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="6"
                opacity="0.7"
              />
            )}
            <path
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="8"
              d="M52.81 112.501a45.897 45.897 0 013.915-36.189 45.897 45.897 0 0129.031-21.957"
              stroke={theme === 'light' ? '#FCD34D' : '#6B7280'}
              opacity="0.6"
            />
          </g>
        </svg>
        <div
          ref={handleRef}
          className="grab-handle w-12 h-12 rounded-full absolute z-50 border-2 border-dashed border-transparent hover:border-current transition-colors duration-200"
          style={{
            top: `calc((48px * 0.175) + ((48px * 0.65) * (125 / 48)))`,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'grab',
          }}
        />
      </button>
    </div>
  );
};

export default LightSwitchToggle;
