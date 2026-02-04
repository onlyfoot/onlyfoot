import React, { useState } from 'react';
import { LayoutGrid, Sparkles } from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  products: Product[];
  purchasedIds: string[];
}

const Home: React.FC<HomeProps> = ({ products, purchasedIds }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'Todos') return true;
    if (selectedCategory === 'VIP') return product.price > 30;
    return product.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-darker pb-20">
      
      {/* Preview Carousel Section */}
      <div className="pt-6 pb-2">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-sm font-bold text-zinc-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-primary" />
            Prévias do Clube
          </h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
            {products.map((product) => (
              <div 
                key={`preview-${product.id}`} 
                className="flex-none w-64 sm:w-80 aspect-[16/10] relative rounded-xl overflow-hidden snap-center border border-zinc-800 group cursor-pointer hover:border-primary/50 transition-all select-none"
                onContextMenu={(e) => e.preventDefault()} // Prevent right-click context menu
              >
                {/* Unblurred Image for Preview */}
                <img 
                  src={product.thumbnailUrl} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" // Disable pointer events on image to prevent dragging
                  draggable={false}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full p-[1px] bg-primary">
                      <img src={product.creator.avatarUrl} className="w-full h-full rounded-full object-cover" draggable={false} />
                    </div>
                    <span className="text-xs text-zinc-200 font-medium shadow-black drop-shadow-md">{product.creator.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Galeria Recente
          </h2>
          <span className="text-sm text-zinc-500">{filteredProducts.length} pacotes disponíveis</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isPurchased={purchasedIds.includes(product.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
            <p className="text-zinc-500">Nenhum conteúdo encontrado.</p>
            <button 
              onClick={() => setSelectedCategory('Todos')}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Ver tudo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;