import { motion } from 'motion/react';
import { HomeIcon, SearchIcon, SparklesIcon } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-[#0C0C0D] relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating ink drops */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#57f1d6]/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 404 Number with glitch effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="text-[180px] md:text-[280px] leading-none tracking-tighter">
            {/* Main 404 */}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#57f1d6] to-[#57f1d6]/50">
                404
              </span>
              {/* Glitch layers */}
              <span className="absolute top-0 left-0 text-[#57f1d6]/20 animate-pulse" style={{ transform: 'translate(-2px, -2px)' }}>
                404
              </span>
              <span className="absolute top-0 left-0 text-[#57f1d6]/20 animate-pulse" style={{ transform: 'translate(2px, 2px)', animationDelay: '0.1s' }}>
                404
              </span>
            </span>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl mb-4 text-white">
            This Page Got Lost in the Ink
          </h1>
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-2">
            Looks like this tattoo design doesn't exist yet
          </p>
          <p className="text-lg text-[#57f1d6]/80">
            Maybe it's still a story waiting to be told?
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Go Home Button */}
          <button
            onClick={() => onNavigate('home')}
            className="group relative px-8 py-4 rounded-2xl overflow-hidden bg-[#57f1d6] text-[#0C0C0D] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(87,241,214,0.5)] min-w-[200px]"
          >
            <div className="flex items-center justify-center gap-2 relative z-10">
              <HomeIcon className="w-5 h-5" />
              <span>Go Home</span>
            </div>
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#57f1d6] via-white to-[#57f1d6] opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          </button>

          {/* Explore Community Button */}
          <button
            onClick={() => onNavigate('community')}
            className="group relative px-8 py-4 rounded-2xl overflow-hidden border-2 border-[#57f1d6]/30 text-white transition-all duration-300 hover:border-[#57f1d6] hover:bg-[#57f1d6]/10 hover:scale-105 min-w-[200px]"
          >
            <div className="flex items-center justify-center gap-2 relative z-10">
              <SearchIcon className="w-5 h-5" />
              <span>Explore Ink</span>
            </div>
          </button>

          {/* Create Tattoo Button */}
          <button
            onClick={() => onNavigate('generate')}
            className="group relative px-8 py-4 rounded-2xl overflow-hidden border-2 border-[#57f1d6]/30 text-white transition-all duration-300 hover:border-[#57f1d6] hover:bg-[#57f1d6]/10 hover:scale-105 min-w-[200px]"
          >
            <div className="flex items-center justify-center gap-2 relative z-10">
              <SparklesIcon className="w-5 h-5" />
              <span>Create Design</span>
            </div>
          </button>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-2xl mx-auto"
        >
          <p className="text-white/70 italic">
            Fun fact: This 404 page was designed with the same care as our tattoos. 
            <br />
            Every detail matters, even the errors. ✨
          </p>
        </motion.div>
      </div>

      {/* Animated corner decorations */}
      <div className="absolute top-8 right-8 w-32 h-32 border-r-2 border-t-2 border-[#57f1d6]/20 rounded-tr-3xl" />
      <div className="absolute bottom-8 left-8 w-32 h-32 border-l-2 border-b-2 border-[#57f1d6]/20 rounded-bl-3xl" />
    </div>
  );
}
