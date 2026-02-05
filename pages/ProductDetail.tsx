import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Unlock, CheckCircle, AlertCircle, ArrowLeft, Download, BadgeCheck, Shield, Star, Calendar } from 'lucide-react';
import { Pack } from '../types';

interface PackDetailProps {
  packs: Pack[];
  purchasedSlugs: string[];
  onPurchase: (slug: string, price: number) => boolean;
}

const PackDetail: React.FC<PackDetailProps> = ({ packs, purchasedSlugs, onPurchase }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const pack = packs.find(p => p.slug === slug);
  const isPurchased = slug ? purchasedSlugs.includes(slug) : false;

  if (!pack) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-darker">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Conteúdo não encontrado</h2>
          <button onClick={() => navigate('/')} className="text-primary hover:underline">Voltar para a galeria</button>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    setIsPurchasing(true);
    setPurchaseError(null);

    setTimeout(() => {
      const success = onPurchase(pack.slug, pack.price);
      if (success) {
        setIsPurchasing(false);
      } else {
        setPurchaseError("Saldo insuficiente. Por favor, recarregue sua conta.");
        setIsPurchasing(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-darker pb-20">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-darker/80 backdrop-blur-md border-b border-zinc-800 px-4 h-16 flex items-center">
        <div className="max-w-6xl mx-auto w-full flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold text-white truncate">Detalhes do Pack</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column: Media Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
              <img 
                src={pack.thumbnailUrl} 
                alt={pack.title}
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  isPurchased ? '' : 'blur-2xl opacity-40'
                }`}
              />
              
              {!isPurchased && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40">
                  <div className="bg-zinc-900/90 p-8 rounded-3xl border border-zinc-700/50 shadow-2xl backdrop-blur-md max-w-md w-full">
                    <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Conteúdo Privado</h2>
                    <p className="text-zinc-400 mb-6">
                      Este pack contém {pack.photos.length} arquivos de mídia exclusivos.
                      Desbloqueie para visualizar e baixar.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                      <Shield className="h-4 w-4" />
                      Compra Segura e Anônima
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails Grid (Blurred if locked) */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {pack.photos.map((photo, idx) => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                  <img 
                    src={photo.url} 
                    alt={`Preview ${idx}`}
                    className={`w-full h-full object-cover ${isPurchased ? 'cursor-pointer hover:opacity-80' : 'blur-md opacity-30'}`}
                  />
                  {!isPurchased && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-zinc-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Purchase & Info */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-zinc-800 rounded-2xl p-6 sticky top-24">
              {/* Creator Header */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-800">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-700 ring-2 ring-primary/20">
                  <img src={pack.creator.avatarUrl} alt={pack.creator.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-white">{pack.creator.name}</h3>
                    {pack.creator.verified && (
                      <BadgeCheck className="h-4 w-4 text-primary fill-primary text-white" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">{pack.creator.username}</p>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">{pack.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  {pack.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {pack.postedAt}
                </span>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                {pack.description}
              </p>

              {purchaseError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {purchaseError}
                </div>
              )}

              {isPurchased ? (
                <div className="space-y-3">
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold">
                    <CheckCircle className="h-5 w-5" />
                    Adquirido
                  </div>
                  <button className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Download className="h-5 w-5" />
                    Baixar Tudo (.ZIP)
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-zinc-400 text-sm">Preço do pack</span>
                    <span className="text-3xl font-bold text-white">R$ {pack.price.toFixed(2)}</span>
                  </div>
                  
                                   <button 
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
                      isPurchasing 
                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                        : 'bg-primary hover:bg-primary-hover text-white shadow-primary/25 hover:-translate-y-0.5'
                    }`}
                  >
                    {isPurchasing ? 'Processando...' : 'Comprar Acesso'}
                  </button>
                  
                  <p className="text-center text-xs text-zinc-500">
                    Acesso imediato após a confirmação.
                  </p>
                </div>
              )}

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {pack.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Content Gallery */}
        {isPurchased && (
          <div className="mt-16 border-t border-zinc-800 pt-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Unlock className="h-6 w-6 text-emerald-500" />
              Galeria Desbloqueada
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pack.photos.map((photo) => (
                <div key={photo.id} className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                  <img 
                    src={photo.url} 
                    alt={photo.caption}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <p className="text-white font-medium text-lg mb-1">{photo.caption}</p>
                    <div className="flex gap-3 mt-2">
                      <button className="bg-white text-black text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                        <Download className="h-4 w-4" />
                        Baixar
                      </button>
                      <button className="bg-black/50 backdrop-blur-md text-white text-sm font-bold py-2 px-4 rounded-lg border border-white/20 hover:bg-black/70 transition-colors">
                        Visualizar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackDetail;
