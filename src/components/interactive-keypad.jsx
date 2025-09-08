'use client';

import { Download, Github, Linkedin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

const InteractiveKeypad = () => {
  const t = useTranslations('ContactPage');
  const locale = useLocale();
  const [config, setConfig] = useState({
    muted: false,
    one: {
      travel: 26,
      text: <Linkedin />,
      key: 'l',
      hue: 114,
      saturation: 1.4,
      brightness: 1.2,
      pressed: false,
    },
    two: {
      travel: 26,
      text: <Github />,
      key: 'g',
      hue: 0,
      saturation: 0,
      brightness: 1.4,
      pressed: false,
    },
    three: {
      travel: 18,
      text: (
        <div className="flex items-center gap-4">
          <Download /> <span>CV</span>
        </div>
      ),
      key: 'Enter',
      hue: 0,
      saturation: 0,
      brightness: 0.4,
      pressed: false,
    },
  });

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3');
    audioRef.current.muted = config.muted;
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = config.muted;
    }
  }, [config.muted]);

  const playClickSound = () => {
    if (!config.muted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleKeyDown = (event) => {
    const keyIds = ['one', 'two', 'three'];
    keyIds.forEach((id) => {
      if (event.key === config[id].key) {
        setConfig((prev) => ({
          ...prev,
          [id]: { ...prev[id], pressed: true },
        }));
        playClickSound();
      }
    });
  };

  const handleKeyUp = (event) => {
    const keyIds = ['one', 'two', 'three'];
    keyIds.forEach((id) => {
      if (event.key === config[id].key) {
        setConfig((prev) => ({
          ...prev,
          [id]: { ...prev[id], pressed: false },
        }));
      }
    });
  };

  const handleButtonPress = (keyId) => {
    setConfig((prev) => ({
      ...prev,
      [keyId]: { ...prev[keyId], pressed: true },
    }));
    playClickSound();
  };

  const handleButtonRelease = (keyId) => {
    setConfig((prev) => ({
      ...prev,
      [keyId]: { ...prev[keyId], pressed: false },
    }));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [config]);

  const handleButtonAction = (keyId) => {
    if (keyId === 'one') {
      window.open('https://www.linkedin.com/in/gonzalo-uriel-bonelli/', '_blank');
    }
    if (keyId === 'two') {
      window.open('https://github.com/biosma', '_blank');
    }
    if (keyId === 'three') {
      locale === 'en'
        ? window.open('/Gonzalo Bonelli - CV - EN.pdf', '_blank')
        : window.open('/Gonzalo Bonelli - CV - ES.pdf', '_blank');
    }
  };

  const styles = `

    .keypad {
      position: relative;
      aspect-ratio: 400 / 310;
      display: flex;
      place-items: center;
      width: clamp(280px, 35vw, 400px);
      -webkit-tap-highlight-color: transparent;
      transform-style: preserve-3d;
    }

    .key {
      transform-style: preserve-3d;
      border: 0;
      background: transparent;
      padding: 0;
      cursor: pointer;
      outline: none;
    }

    .key.pressed .key__content,
    .key:active .key__content {
      translate: 0 calc(var(--travel) * 1%);
    }

    .key__content {
      width: 100%;
      display: inline-block;
      height: 100%;
      transition: translate 0.12s ease-out;
      container-type: inline-size;
    }

    .key__text {
      position: absolute;
      font-size: 12cqi;
      z-index: 21;
      color: hsl(0 0% 94%);
      text-align: left;
      padding: 1ch;
      transform: rotateX(36deg) rotateY(45deg) rotateX(-90deg) rotate(0deg);
      top: 5%;
      left: 0;
      width: 86%;
      translate: 8% 10%;
      height: 46%;
    }

    .key.single {
      position: absolute;
      width: 40.5%;
      left: 54%;
      bottom: 36%;
      height: 46%;
      clip-path: polygon(
        0 0,
        54% 0,
        89% 24%,
        100% 70%,
        54% 100%,
        46% 100%,
        0 69%,
        12% 23%,
        47% 0%
      );
      mask: url(https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86) 50% 50% / 100% 100%;
    }

    .key.single.left {
      left: 29.3%;
      bottom: 54.2%;
    }

    .key.single .key__text {
      font-size: 18cqi;
      width: 52%;
      height: 62%;
      translate: 45% -16%;
    }

    .key.single img {
      top: 0;
      opacity: 1;
      width: 96%;
      position: absolute;
      left: 50%;
      translate: -50% 1%;
    }

    .key.double {
      position: absolute;
      width: 64%;
      height: 65%;
      left: 6%;
      bottom: 17.85%;
      clip-path: polygon(
        34% 0,
        93% 44%,
        101% 78%,
        71% 100%,
        66% 100%,
        0 52%,
        0 44%,
        7% 17%,
        30% 0
      );
      mask: url(https://assets.codepen.io/605876/keypad-double.png?format=auto&quality=86) 50% 50% / 100% 100%;
    }

    .key img {
      transition: translate 0.12s ease-out;
      width: 100%;
      filter: hue-rotate(calc(var(--hue, 0) * 1deg))
        saturate(var(--saturate, 1)) brightness(var(--brightness, 1));
    }

    .keypad__base {
      position: absolute;
      bottom: 0;
      width: 100%;
    }

    .keypad__base img {
      width: 100%;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="keypad" data-no-scramble="true">
        <div className="keypad__base" data-no-scramble="true">
          <img
            src="https://assets.codepen.io/605876/keypad-base.png?format=auto&quality=86"
            alt=""
            data-no-scramble="true"
          />
        </div>

        <button
          className={`key single left ${config.one.pressed ? 'pressed' : ''}`}
          style={{
            '--travel': config.one.travel,
            '--hue': config.one.hue,
            '--saturate': config.one.saturation,
            '--brightness': config.one.brightness,
          }}
          onMouseDown={() => handleButtonPress('one')}
          onMouseUp={() => {
            handleButtonRelease('one');
            handleButtonAction('one');
          }}
          onMouseLeave={() => handleButtonRelease('one')}
          data-no-scramble="true"
        >
          <span className="key__mask" data-no-scramble="true">
            <span className="key__content" data-no-scramble="true">
              <span className="key__text" data-no-scramble="true">
                {config.one.text}
              </span>
              <img
                src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86"
                alt=""
              />
            </span>
          </span>
        </button>

        <button
          className={`key single ${config.two.pressed ? 'pressed' : ''}`}
          style={{
            '--travel': config.two.travel,
            '--hue': config.two.hue,
            '--saturate': config.two.saturation,
            '--brightness': config.two.brightness,
          }}
          onMouseDown={() => handleButtonPress('two')}
          onMouseUp={() => {
            handleButtonRelease('two');
            handleButtonAction('two');
          }}
          onMouseLeave={() => handleButtonRelease('two')}
          data-no-scramble="true"
        >
          <span className="key__mask" data-no-scramble="true">
            <span className="key__content" data-no-scramble="true">
              <span className="key__text" data-no-scramble="true">
                {config.two.text}
              </span>
              <img
                src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86"
                alt=""
              />
            </span>
          </span>
        </button>

        <button
          className={`key double ${config.three.pressed ? 'pressed' : ''}`}
          style={{
            '--travel': config.three.travel,
            '--hue': config.three.hue,
            '--saturate': config.three.saturation,
            '--brightness': config.three.brightness,
          }}
          onMouseDown={() => handleButtonPress('three')}
          onMouseUp={() => {
            handleButtonRelease('three');
            handleButtonAction('three');
          }}
          onMouseLeave={() => handleButtonRelease('three')}
        >
          <span className="key__mask" data-no-scramble="true">
            <span className="key__content" data-no-scramble="true">
              <span className="key__text" data-no-scramble="true">
                {config.three.text}
              </span>
              <img
                src="https://assets.codepen.io/605876/keypad-double.png?format=auto&quality=86"
                alt=""
              />
            </span>
          </span>
        </button>
      </div>
    </>
  );
};

export default InteractiveKeypad;
