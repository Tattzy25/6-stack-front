import { useEffect, useRef } from 'react';

interface HalftoneLoaderProps {
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  spacing?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}

export function HalftoneLoader({
  direction = 'bottom',
  spacing = 20,
  duration = 1.7,
  stagger = 0.05,
  className = '',
}: HalftoneLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clipPathRef = useRef<SVGClipPathElement>(null);

  function getRevealDelay(row: number, col: number, rows: number, cols: number): number {
    switch (direction) {
      case 'top':
        return row * stagger;
      case 'bottom':
        return (rows - 1 - row) * stagger;
      case 'left':
        return col * stagger;
      case 'right':
        return (cols - 1 - col) * stagger;
      case 'center':
        const centerRow = (rows - 1) / 2;
        const centerCol = (cols - 1) / 2;
        const distance = Math.sqrt(
          Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
        );
        return distance * stagger;
      default:
        return row * stagger;
    }
  }

  function createHalftoneEffect() {
    const clipPath = clipPathRef.current;
    const container = containerRef.current;

    if (!clipPath || !container) return;

    clipPath.innerHTML = '';

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const cols = Math.max(1, Math.floor(width / spacing));
    const rows = Math.max(1, Math.floor(height / spacing));
    const actualSpacingX = width / cols;
    const actualSpacingY = height / rows;
    const maxRadius = Math.max(actualSpacingX, actualSpacingY);

    // Create circles
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col + 0.5) * actualSpacingX;
        const y = (row + 0.5) * actualSpacingY;
        const revealDelay = getRevealDelay(row, col, rows, cols);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', '0');

        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'r');
        animate.setAttribute('values', `0;${maxRadius};0`);
        animate.setAttribute('dur', `${duration * 2}s`);
        animate.setAttribute('repeatCount', 'indefinite');
        animate.setAttribute('fill', 'freeze');
        animate.setAttribute('begin', `${revealDelay}s`);

        circle.appendChild(animate);
        clipPath.appendChild(circle);
      }
    }
  }

  useEffect(() => {
    // Initial creation
    createHalftoneEffect();

    // Recreate on window resize
    const handleResize = () => {
      createHalftoneEffect();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [direction, spacing, duration, stagger]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <clipPath ref={clipPathRef} id="halftone-clip" />
        </defs>
      </svg>

      <div
        className="w-full h-full rounded-3xl"
        style={{
          clipPath: 'url(#halftone-clip)',
          background: 'radial-gradient(circle at 5% 1%, hsl(300, 100%, 45.1%) 7%, transparent 84%), radial-gradient(circle at 7% 81%, hsl(198, 100%, 44.5%) 16%, transparent 53%), radial-gradient(circle at 90% 50%, hsl(247, 54.1%, 33.3%) 2%, transparent 85%)',
        }}
      />
    </div>
  );
}
