import React, { useEffect, useRef } from 'react';

const StringyHand = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = 800;
    const height = canvas.height = 800;
    const centerX = width / 2;
    
    // Set canvas background to transparent so the parent's color shows through
    ctx.clearRect(0, 0, width, height);

    let isRunning = true;

    function animate() {
      if (!isRunning) return;

      // Clear canvas with a very light, semi-transparent color for a "smoky" trail effect
      ctx.fillStyle = 'rgba(240, 238, 230, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Update time
      timeRef.current += 0.01;
      const time = timeRef.current;

      // Create flowing vertical strings like hair/rope strands
      const numStrings = 60;
      
      for (let i = 0; i < numStrings; i++) {
        const stringProgress = i / numStrings;
        const side = stringProgress < 0.5 ? -1 : 1;
        const distFromCenter = Math.abs(stringProgress - 0.5) * 2;
        
        // Base position with a canyon-like curve, adjusted for a larger canvas
        const wavePhase = stringProgress * Math.PI * 6 + time * 0.4;
        const canyonCurve = Math.sin(wavePhase) * 120 + Math.sin(wavePhase * 2) * 50;
        const baseX = centerX + side * (100 + canyonCurve * distFromCenter);
        
        // String properties
        const amplitude = 15 + 25 * Math.sin(time * 0.2 + i * 0.1);
        const frequency = 0.008 + 0.005 * Math.sin(time * 0.1 + i * 0.05);
        const speed = time * (1.2 + 0.6 * Math.sin(i * 0.2));
        const thickness = 1.0 + 1.0 * Math.sin(time * 0.5 + i * 0.15);
        const opacity = 0.3 + 0.2 * Math.abs(Math.sin(time * 0.4 + i * 0.12));
        
        // Color variation for depth, a bit darker to contrast the light background
        const hue = 220 + 60 * Math.sin(i * 0.3); // More blues and greens
        const sat = 45 + 25 * Math.sin(time * 0.3 + i * 0.1);
        const light = 20 + 15 * Math.sin(i * 0.4);
        
        ctx.beginPath();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${opacity})`;
        ctx.lineCap = 'round';
        
        // Draw flowing vertical string
        let firstPoint = true;
        for (let y = 0; y < height; y += 4) {
          const waveX = amplitude * Math.sin(y * frequency + speed);
          const secondaryWave = 10 * Math.sin(y * frequency * 3 + speed * 1.5);
          const x = baseX + waveX + secondaryWave;
          
          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }

      // Add some crossing diagonal strings for complexity
      const numDiagonals = 80;
      
      for (let i = 0; i < numDiagonals; i++) {
        const side = i % 2 === 0 ? 1 : -1;
        const startX = side > 0 ? centerX + 120 : centerX - 120;
        const amplitude = 25 + 20 * Math.cos(time * 0.25 + i * 0.1);
        const frequency = 0.012 + 0.006 * Math.sin(time * 0.15 + i * 0.08);
        const phase = time * (0.8 + 0.4 * Math.sin(i * 0.1));
        const thickness = 1.0 + 0.8 * Math.sin(time + i * 0.25);
        const opacity = 0.2 + 0.15 * Math.abs(Math.sin(time * 0.2 + i * 0.1));
        
        ctx.beginPath();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = `rgba(60, 80, 140, ${opacity})`; // Slightly different color for diagonals
        ctx.lineCap = 'round';
        
        // Draw diagonal flowing string
        const steps = 100;
        let firstPoint = true;
        for (let j = 0; j <= steps; j++) {
          const progress = j / steps;
          const y = progress * height;
          const baseX = startX + side * progress * 150;
          const x = baseX + amplitude * Math.sin(y * frequency + phase);
          
          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }

      // Add some horizontal connecting strands
      const numHorizontal = 30;
      
      for (let i = 0; i < numHorizontal; i++) {
        const yPos = (i / numHorizontal) * height;
        const amplitude = 25 + 20 * Math.sin(time * 0.3 + i * 0.2);
        const frequency = 0.012 + 0.006 * Math.sin(time * 0.2 + i * 0.1);
        const speed = time * (0.6 + 0.3 * Math.sin(i * 0.15));
        const thickness = 0.9 + 0.6 * Math.sin(time + i * 0.3);
        const opacity = 0.15 + 0.1 * Math.abs(Math.sin(time * 0.35 + i * 0.2));
        
        ctx.beginPath();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = `rgba(80, 100, 160, ${opacity})`; // Slightly different color for horizontals
        ctx.lineCap = 'round';
        
        // Draw horizontal connecting strand
        let firstPoint = true;
        for (let x = centerX - 250; x < centerX + 250; x += 5) {
          const y = yPos + amplitude * Math.sin(x * frequency + speed);
          
          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
      timeRef.current = 0;
    };
  }, []);

  return (
    <div style={{
      width: '400px',
      height: '400px',
      position: 'relative',
      margin: 'auto',
      backgroundColor: '#F0EEE6',
      overflow: 'hidden',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '65%',
          transform: 'translate(-65%, -50%)',
          display: 'block',
          width: '35%',
          height: '100%',
        }}
      />
      <img
        src="/hand-vector.svg"
        alt="Vector illustration of a hand."
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '450px',
          height: '450px',
          objectFit: 'contain',
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default StringyHand;
