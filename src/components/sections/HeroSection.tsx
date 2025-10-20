interface HeroSectionProps {
  imageUrl: string;
  alt?: string;
}

export function HeroSection({ imageUrl, alt = 'Hero Image' }: HeroSectionProps) {
  return (
    <section className="relative w-screen h-screen overflow-hidden -mx-[50vw] left-1/2 right-1/2">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-[102%] object-cover"
      />
    </section>
  );
}
