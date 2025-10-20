import { useEffect, useRef } from 'react';

interface HalftoneRevealProps {
  onComplete?: () => void;
  spacing?: number;
  duration?: number;
  stagger?: number;
}

export function HalftoneReveal({
  onComplete,
  spacing = 20,
  duration = 4,
  stagger = 0.05,
}: HalftoneRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskSvgRef = useRef<SVGSVGElement>(null);

  function createHalftoneReveal() {
    const svg = maskSvgRef.current;
    const container = containerRef.current;

    if (!svg || !container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Update SVG dimensions
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Find or create the mask element
    let mask = svg.querySelector('mask');
    if (!mask) {
      mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
      mask.setAttribute('id', 'halftone-reveal-mask');
      svg.appendChild(mask);
    }

    // Clear existing mask content
    mask.innerHTML = '';

    // White rect = show the gradient everywhere initially
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', 'white');
    mask.appendChild(bgRect);

    const cols = Math.max(1, Math.floor(width / spacing));
    const rows = Math.max(1, Math.floor(height / spacing));
    const actualSpacingX = width / cols;
    const actualSpacingY = height / rows;
    const maxRadius = Math.max(actualSpacingX, actualSpacingY) * 0.8;

    // Create black circles that punch holes (reveal content underneath)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col + 0.5) * actualSpacingX;
        const y = (row + 0.5) * actualSpacingY;
        
        // Bottom to top: higher row index = bottom of screen, starts first
        const revealDelay = (rows - 1 - row) * stagger;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', '0');
        circle.setAttribute('fill', 'black'); // Black = transparent in mask = reveal content

        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'r');
        animate.setAttribute('from', '0');
        animate.setAttribute('to', maxRadius.toString());
        animate.setAttribute('dur', `${duration}s`);
        animate.setAttribute('begin', `${revealDelay}s`);
        animate.setAttribute('fill', 'freeze');

        circle.appendChild(animate);
        mask.appendChild(circle);
      }
    }

    // Call onComplete after animation finishes
    if (onComplete) {
      const totalDuration = ((rows - 1) * stagger + duration) * 1000;
      setTimeout(onComplete, totalDuration);
    }
  }

  useEffect(() => {
    // Create immediately
    const timer = setTimeout(() => {
      createHalftoneReveal();
    }, 10);

    // Recreate on window resize
    const handleResize = () => {
      createHalftoneReveal();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [spacing, duration, stagger]);

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ borderRadius: '70px' }}>
      {/* SVG with mask definition */}
      <svg
        ref={maskSvgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <mask id="halftone-reveal-mask">
            <rect width="100%" height="100%" fill="white" />
          </mask>
        </defs>
      </svg>
      
      {/* Gradient overlay that gets masked */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #57f1d6 0%, #0C0C0D 100%)',
          borderRadius: '70px',
          mask: 'url(#halftone-reveal-mask)',
          WebkitMask: 'url(#halftone-reveal-mask)',
        }}
      />
    </div>
  );
}
