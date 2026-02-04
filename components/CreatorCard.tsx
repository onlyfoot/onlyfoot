import React from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '../types';
import { BadgeCheck } from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  return (
    <Link to={`/creator/${creator.id}`} className="group block bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-brand-500/50 transition-all duration-300">
      <div className="h-32 overflow-hidden relative">
        <img 
          src={creator.banner} 
          alt="Banner" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent opacity-60"></div>
      </div>
      <div className="px-4 pb-4 relative">
        <div className="flex justify-between items-end -mt-10 mb-3">
          <img 
            src={creator.avatar} 
            alt={creator.name} 
            className="w-20 h-20 rounded-full border-4 border-dark-800 object-cover"
          />
          <div className="mb-1">
             <span className="inline-block px-2 py-1 bg-brand-500/10 text-brand-500 text-xs font-bold rounded-md border border-brand-500/20">
               ${creator.price}/mês
             </span>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center gap-1 mb-1">
            <h3 className="font-bold text-white truncate">{creator.name}</h3>
            {creator.isVerified && <BadgeCheck className="w-4 h-4 text-gold-500 fill-gold-500/10" />}
          </div>
          <p className="text-sm text-gray-400 truncate">{creator.handle}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <span>{creator.photosCount} Fotos</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
          <span>{creator.videosCount} Vídeos</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {creator.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-dark-700 text-gray-300 text-[10px] rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};