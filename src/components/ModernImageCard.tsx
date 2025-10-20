interface ModernImageCardProps {
  image: string;
  title: string;
  description?: string;
  onClick?: () => void;
  className?: string;
  imageHeight?: string;
}

export function ModernImageCard({
  image,
  title,
  description,
  onClick,
  className = '',
  imageHeight = 'h-48',
}: ModernImageCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-[3rem] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-h-[400px] ${className}`}
    >
      {/* Content Container - smaller, positioned on top */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pt-6 pb-0 m-[0px]">
        <div className="rounded-[70px] px-5 bg-black/30 border-2 border-[#57f1d6] p-[20px]">
          {/* Image on top of frost */}
          <img
            src={image}
            alt={title}
            className={`w-full ${imageHeight} object-cover rounded-[2.5rem] mb-4`}
          />
          
          {/* Title */}
          <h3 
            className="text-white mb-2 line-clamp-2 text-[20px] text-center px-[10px] py-[0px] font-[Rock_Salt]"
            style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.6)'
            }}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-white/70 line-clamp-2 text-[16px] font-[Philosopher] no-underline text-[rgba(102,232,199,0.7)] py-[0px] py-[15px] px-[20px]">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
