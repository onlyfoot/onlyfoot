import React, { useState, useEffect } from 'react';
import { Heart, Lock, Star, ChevronDown, ShieldCheck, ArrowRight } from 'lucide-react';

// --- Components ---

const AgeGate = ({ onVerify }: { onVerify: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-brand-800 rounded-2xl p-8 text-center shadow-2xl shadow-brand-900/20">
        <ShieldCheck className="w-16 h-16 text-brand-600 mx-auto mb-6" />
        <h2 className="text-3xl font-serif font-bold text-brand-50 mb-4">Conteúdo Exclusivo</h2>
        <p className="text-neutral-400 mb-8">
          Este site contém material destinado apenas para adultos. Ao entrar, você confirma que tem mais de 18 anos.
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onVerify}
            className="w-full py-4 bg-brand-700 hover:bg-brand-600 text-white font-bold rounded-lg transition-all duration-300 uppercase tracking-wider shadow-lg shadow-brand-900/50"
          >
            Tenho mais de 18 anos
          </button>
          <button 
            onClick={() => window.location.href = "https://google.com"} 
            className="w-full py-3 text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
          >
            Sair do site
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 w-full z-40 bg-neutral-950/80 backdrop-blur-md border-b border-brand-900/30">
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="text-2xl font-serif font-bold text-brand-500 tracking-widest">
        SCARLET
      </div>
      <div className="flex items-center gap-6">
        <button className="text-neutral-300 hover:text-brand-400 text-xs font-bold uppercase tracking-wide transition-colors">
          Cadastro
        </button>
        <button className="px-6 py-2 bg-brand-700 hover:bg-brand-600 rounded-full text-xs font-bold uppercase tracking-wide transition-all shadow-[0_0_15px_-3px_rgba(225,29,72,0.4)]">
          Login
        </button>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <header id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://picsum.photos/id/338/1920/1080" 
        alt="Background" 
        className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-[2s]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-brand-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/10 via-transparent to-transparent"></div>
    </div>

    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-950/30 text-brand-300 text-xs uppercase tracking-widest mb-6 animate-fade-in">
        <Star className="w-3 h-3 fill-brand-300" /> Top 1% Creator
      </div>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-brand-200 mb-6 drop-shadow-lg">
        A Arte da <br/> <span className="text-brand-600 italic">Sedução</span>
      </h1>
      <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
        Explore um mundo de elegância e fetiche. Conteúdo exclusivo, ângulos perfeitos e uma experiência intimista que você não encontrará em nenhum outro lugar.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <a href="#gallery" className="w-full md:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg shadow-[0_0_30px_-5px_rgba(225,29,72,0.6)] transition-all duration-300 transform hover:scale-105 uppercase tracking-wider">
          Ver Galeria
        </a>
        <a href="#benefits" className="w-full md:w-auto px-8 py-4 border border-brand-700 hover:bg-brand-950/50 text-brand-100 font-medium rounded-lg transition-all duration-300 uppercase tracking-wider">
          Saiba Mais
        </a>
      </div>
    </div>

    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-brand-700">
      <ChevronDown className="w-8 h-8" />
    </div>
  </header>
);

const Gallery = () => {
  const images = [
    { id: 101, locked: false, alt: "Preview 1" },
    { id: 102, locked: false, alt: "Preview 2" },
    { id: 103, locked: true, alt: "Locked Content" },
    { id: 104, locked: true, alt: "Locked Content" },
    { id: 106, locked: true, alt: "Locked Content" },
    { id: 107, locked: true, alt: "Locked Content" },
  ];

  return (
    <section id="gallery" className="py-24 bg-neutral-950 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-50 mb-4">Galeria Preview</h2>
          <div className="h-1 w-24 bg-brand-700 mx-auto rounded-full"></div>
          <p className="mt-4 text-neutral-400">Uma pequena amostra do que espera por você.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800">
              <img 
                src={`https://picsum.photos/id/${img.id}/400/600`} 
                alt={img.alt}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${img.locked ? 'blur-xl opacity-50' : 'opacity-90 group-hover:opacity-100'}`}
              />
              
              {img.locked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                  <div className="p-4 bg-brand-950/80 backdrop-blur-md rounded-full border border-brand-700/50 shadow-lg">
                    <Lock className="w-6 h-6 text-brand-400" />
                  </div>
                  <span className="mt-3 text-xs font-bold uppercase tracking-widest text-brand-200">Exclusivo Assinantes</span>
                </div>
              )}

              {!img.locked && (
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-sm font-medium text-brand-100">Ver em HD</span>
                </div>
              )}
            </div>
          ))}
               </div>
        
        <div className="mt-12 text-center">
          <p className="text-neutral-500 italic mb-6">
            Mais de 500+ fotos e 50+ vídeos disponíveis imediatamente.
          </p>
          <button className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-bold uppercase tracking-wide border-b border-brand-800 pb-1 hover:border-brand-400 transition-all">
            Quero Acesso VIP <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

const Features = () => (
  <section id="benefits" className="py-20 bg-neutral-900 border-y border-neutral-800">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-12">
        <div className="text-center p-6 rounded-2xl bg-neutral-950/50 border border-neutral-800 hover:border-brand-800 transition-colors duration-300">
          <div className="w-16 h-16 mx-auto bg-brand-900/20 rounded-full flex items-center justify-center mb-6 text-brand-500">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-brand-100 mb-3">Conteúdo Diário</h3>
          <p className="text-neutral-400 leading-relaxed">
            Novas fotos e vídeos postados todos os dias. Você nunca ficará sem novidades para apreciar.
          </p>
        </div>
        <div className="text-center p-6 rounded-2xl bg-neutral-950/50 border border-neutral-800 hover:border-brand-800 transition-colors duration-300">
          <div className="w-16 h-16 mx-auto bg-brand-900/20 rounded-full flex items-center justify-center mb-6 text-brand-500">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-brand-100 mb-3">Pedidos Personalizados</h3>
          <p className="text-neutral-400 leading-relaxed">
            Realizo seus desejos específicos. Peça vídeos e fotos feitos sob medida para o seu gosto.
          </p>
        </div>
        <div className="text-center p-6 rounded-2xl bg-neutral-950/50 border border-neutral-800 hover:border-brand-800 transition-colors duration-300">
          <div className="w-16 h-16 mx-auto bg-brand-900/20 rounded-full flex items-center justify-center mb-6 text-brand-500">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-brand-100 mb-3">Chat Privado</h3>
          <p className="text-neutral-400 leading-relaxed">
            Converse diretamente comigo. Respondo todas as mensagens dos assinantes VIP pessoalmente.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-neutral-900 border-t border-neutral-800 py-12">
    <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
      <h4 className="text-2xl font-serif font-bold text-brand-600 mb-2">SCARLET</h4>
      <p className="text-neutral-500 text-sm">© 2024 Todos os direitos reservados.</p>
    </div>
  </footer>
);

// --- Main Component ---

const LandingPage = () => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified');
    if (isVerified === 'true') {
      setVerified(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setVerified(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-brand-50 font-sans selection:bg-brand-900 selection:text-white">
      {!verified && <AgeGate onVerify={handleVerify} />}
      
      <div className={!verified ? 'blur-sm h-screen overflow-hidden' : ''}>
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Gallery />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
