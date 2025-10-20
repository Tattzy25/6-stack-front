interface EmptySectionProps {
  className?: string;
  minHeight?: string;
  children?: React.ReactNode;
}

export function EmptySection({ className = '', minHeight = 'min-h-[400px]', children }: EmptySectionProps) {
  return (
    <section className={`w-full min-h-screen ${className}`} style={{ backgroundColor: '#0C0C0D' }}>
      {children}
    </section>
  );
}