import { useEffect, useRef } from 'react';

interface VisualEffectProps {
  type: 'liquid' | 'dream' | 'psywave' | 'inkstorm' | 'flame' | 'spectral' | 'biolume' | 'neuron' | 'organic' | 'synaptic';
}

export function VisualEffect({ type }: VisualEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        const width = canvas?.width || window.innerWidth;
        const height = canvas?.height || window.innerHeight;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = getColorForType(type);
      }

      update() {
        const width = canvas?.width || window.innerWidth;
        const height = canvas?.height || window.innerHeight;
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function getColorForType(type: string): string {
      const colors = {
        liquid: '#4A90E2',
        dream: '#9B51E0',
        psywave: '#FF6B6B',
        inkstorm: '#2C3E50',
        flame: '#FF9F43',
        spectral: '#A8E6CF',
        biolume: '#50E3C2',
        neuron: '#FFD93D',
        organic: '#6C5CE7',
        synaptic: '#00B894'
      };
      return colors[type as keyof typeof colors] || '#4A90E2';
    }

    function init() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    function handleResize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 0 }}
    />
  );
} 