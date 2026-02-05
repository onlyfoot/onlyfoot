import React from 'react';
import { Lock, Play, Heart, ArrowRight, Eye } from 'lucide-react';

// --- Componente Visual (Esquerda) ---
const SalesPanel = () => {
  return (
    <div className="relative h-full w-full flex flex-col p-8 lg:p-12">
      
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 z-10 pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-20 flex justify-between items-start mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider uppercase">
            Velvet<span className="text-brand-500">Room</span>
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
          +18 Apenas
        </div>
      </div>

      {/* Main Visual Content - Masonry Grid Style */}
      <div className="relative z-10 flex-1 grid grid-cols-2 gap-4 content-center opacity-90">
        {/* Image 1 - Large Vertical */}
        <div className="row-span-2 relative group overflow-hidden rounded-2xl border border-white/10">
          <img 
            src="https://picsum.photos/400/600?random=10" 
            alt="Exclusive Content 1" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 to-transparent opacity-60" />
          <div className="absolute bottom-4 left-4">
            <span className="text-xs font-bold bg-brand-600 px-2 py-1 rounded text-white mb-2 inline-block">AO VIVO</span>
            <p className="text-sm font-medium text-white">Sessões Privadas</p>
          </div>
        </div>

        {/* Image 2 - Square */}
        <div className="relative group overflow-hidden rounded-2xl border border-white/10">
          <img 
            src="https://picsum.photos/400/400?random=25" 
            alt="Exclusive Content 2" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="w-12 h-12 text-white fill-white/50" />
          </div>
        </div>

        {/* Image 3 - Square */}
        <div className="relative group overflow-hidden rounded-2xl border border-white/10">
          <img 
            src="https://picsum.photos/400/400?random=33" 
            alt="Exclusive Content 3" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute bottom-3 right-3 flex gap-1">
            <Heart className="w-5 h-5 text-brand-500 fill-brand-500" />
            <span className="text-sm font-bold">4.2k</span>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="relative z-20 mt-8">
        <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
          Descubra o que está <span className="text-brand-500">escondido</span>.
        </h1>
        <p className="text-gray-400 max-w-md text-sm leading-relaxed">
          Acesse milhares de conteúdos exclusivos, interaja em tempo real e faça parte da comunidade mais seleta da internet.
        </p>
        
        <div className="flex items-center gap-4 mt-6">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border border-dark-900 overflow-hidden">
                <img src={`https://picsum.photos/100/100?random=${i+50}`} alt="User" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            <span className="text-white font-bold">500+</span> novos membros hoje
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Layout Principal ---
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-dark-900 overflow-hidden text-white">
      {/* Left Side: Sales Panel */}
      <div className="w-full lg:w-[55%] bg-black relative overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5">
        <SalesPanel />
      </div>

      {/* Right Side: Children (Login ou Register) */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-dark-900">
        {children}
      </div>
    </div>
  );
}
