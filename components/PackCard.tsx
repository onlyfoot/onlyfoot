import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Unlock, Image as ImageIcon, Star } from 'lucide-react';
import { Pack } from '../types';

interface PackCardProps {
  pack: Pack;
  isPurchased: boolean;
}

const PackCard: React.FC<PackCardProps> = ({ pack, isPurchased }) => {
  return (
    <Link 
      to={`/pack/${pack.slug}`}
      className="group relative block bg-card border border-zinc-800 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
        <img 
          src={pack.thumbnailUrl} 
          alt={pack.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isPurchased ? 'group-hover:scale-105' : 'blur-xl scale-110 opacity-60'
          }`}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Status Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!isPurchased && (
            <div className="flex flex-col items-center gap-2 transform group-hover:scale-110 transition-transform duration-300">
              <div className="bg-zinc-950/60 backdrop-blur-md p-3 rounded-full border border-zinc-700 shadow-xl">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-bold tracking-widest text-white uppercase bg-primary/90 px-3 py-1 rounded-full shadow-lg">
                Premium
              </span>
            </div>
          )}
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {pack.likes > 1000 && (
            <div className="bg-amber-500/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-black flex items-center gap-1">
              <Star className="h-3 w-3 fill-black" />
              TOP RATED
            </div>
          )}
        </div>

        {/* Content Type Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white flex items-center gap-1 border border-white/10">
          <ImageIcon className="h-3 w-3" />
          <span>{pack.photos.length}</span>
        </div>

        {/* Bottom Info (Overlaid) */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={pack.creator.avatarUrl} 
              alt={pack.creator.name}
              className="w-6 h-6 rounded-full border border-zinc-600"
            />
            <span className="text-xs text-zinc-300 font-medium truncate">{pack.creator.name}</span>
          </div>
          
          <h3 className="text-white font-bold leading-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {pack.title}
          </h3>

          <div className="flex items-center justify-between">
            {isPurchased ? (
              <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-full justify-center">
                <Unlock className="h-3 w-3" />
                LIBERADO
              </span>
            ) : (
              <button className="w-full bg-white text-black font-bold text-sm py-2 rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                <Lock className="h-3 w-3" />
                R$ {pack.price.toFixed(2)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PackCard;
