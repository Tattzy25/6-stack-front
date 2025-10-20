interface FeaturedCreatorCardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export function FeaturedCreatorCard({ title, description, onClick }: FeaturedCreatorCardProps) {
  return (
    <div
      data-editable="true"
      onClick={onClick}
      className="group relative overflow-hidden rounded-[40px] border border-border bg-card/50 backdrop-blur-md hover:border-accent/50 transition-all duration-300 cursor-pointer"
    >
      <div className="h-48 flex items-center justify-center bg-black/30 backdrop-blur-md p-6 m-[10px] rounded-[40px]">
        <h3 className="text-2xl text-center group-hover:scale-105 transition-transform duration-300 font-[Rock_Salt] text-[36px]" style={{ 
          WebkitTextStroke: '1.5px #57f1d6',
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 1px #57f1d6'
        }}>
          {title}
        </h3>
      </div>
      
      <div className="p-4 border-t border-border/50">
        <p className="text-sm text-muted-foreground text-center text-[20px]">
          {description}
        </p>
      </div>
    </div>
  );
}
