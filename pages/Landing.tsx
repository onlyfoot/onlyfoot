import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Shield, Lock, Globe } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <span className="font-bold text-white text-2xl">O</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">Onlyfoot</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:bg-dark-800">Entrar</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary">Cadastrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-olive-500/10 rounded-full blur-[128px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Conecte-se com seus <span className="text-brand-500">criadores</span> favoritos.
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Onlyfoot é a plataforma premium para conteúdo exclusivo. Apoie criadores, desbloqueie experiências e junte-se à comunidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="px-12 h-14 text-lg">Comece Grátis</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="px-12 h-14 text-lg">Entrar</Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto px-4">
          <div className="bg-dark-800/50 border border-dark-700 p-6 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-brand-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto text-brand-500">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Conteúdo Exclusivo</h3>
            <p className="text-gray-400 text-sm">Acesse fotos, vídeos e stories premium disponíveis apenas para assinantes.</p>
          </div>
          <div className="bg-dark-800/50 border border-dark-700 p-6 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto text-gold-500">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Comunidade Global</h3>
            <p className="text-gray-400 text-sm">Conecte-se com criadores e fãs de todo o mundo em um espaço seguro.</p>
          </div>
          <div className="bg-dark-800/50 border border-dark-700 p-6 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-olive-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto text-olive-500">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Seguro e Privado</h3>
            <p className="text-gray-400 text-sm">Seus dados e pagamentos são protegidos com segurança padrão da indústria.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 Onlyfoot. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-200 transition-colors">Termos de Serviço</a>
            <a href="#" className="hover:text-brand-200 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-brand-200 transition-colors">Política de Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};