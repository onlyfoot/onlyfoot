import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Bell, User, PlusSquare, Menu, LogOut, UserPlus, LogIn, MessageCircle, Wallet, Settings, BarChart2, Shield } from 'lucide-react';
import { CURRENT_USER } from '../constants';
import { Button } from './Button';
import { db } from '../services/db';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await db.logout();
    navigate('/');
  };

  const navItems = [
    { icon: Home, label: 'Início', path: '/home' },
    { icon: Search, label: 'Explorar', path: '/explore' },
    { icon: PlusSquare, label: 'Criar', path: '/create' },
    { icon: MessageCircle, label: 'Mensagens', path: '/messages' },
    { icon: Bell, label: 'Notificações', path: '/notifications' },
    { icon: Wallet, label: 'Carteira', path: '/wallet' },
    { icon: User, label: 'Perfil', path: '/profile' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  // Add Analytics for creators (mock check)
  if (CURRENT_USER.id === 'u1' || CURRENT_USER.isCreator) {
    navItems.splice(6, 0, { icon: BarChart2, label: 'Analytics', path: '/analytics' });
  }

  // Add Admin for admin users (mock check)
  if (CURRENT_USER.isAdmin) {
    navItems.push({ icon: Shield, label: 'Admin', path: '/admin' });
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-dark-700 bg-dark-900 z-50">
        <div className="p-6">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-xl">O</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">Onlyfoot</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                isActive(item.path) 
                  ? 'bg-brand-500 text-white font-medium' 
                  : 'text-brand-200 hover:bg-dark-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-700 space-y-4">
          {/* Sign Up Call to Action */}
          <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
            <p className="text-xs text-gray-400 mb-3">Junte-se à comunidade para desbloquear acesso total.</p>
            <div className="flex gap-2">
              <Link to="/signup" className="flex-1">
                <Button fullWidth size="sm" variant="primary">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Cadastrar
                </Button>
              </Link>
              <Link to="/login" className="flex-1">
                <Button fullWidth size="sm" variant="secondary">
                  <LogIn className="w-4 h-4 mr-1" />
                  Entrar
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-dark-800 cursor-pointer transition-colors">
            <img 
              src={CURRENT_USER.avatar} 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{CURRENT_USER.name}</p>
              <p className="text-xs text-gray-400 truncate">{CURRENT_USER.handle}</p>
            </div>
            <LogOut className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-700 px-4 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-lg">O</span>
          </div>
          <span className="text-xl font-bold">Onlyfoot</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button size="sm" variant="secondary" className="px-3">
              Entrar
            </Button>
          </Link>
          <button className="p-2 text-gray-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto md:border-r md:border-dark-700 min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      {/* Right Sidebar (Suggestions) - Desktop Only */}
      <aside className="hidden lg:block w-80 h-screen sticky top-0 p-6 overflow-y-auto no-scrollbar">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar criadores..." 
              className="w-full bg-dark-800 border border-dark-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <h3 className="font-bold mb-4 text-lg">Criadores em Alta</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-dark-700 animate-pulse"></div>
                  <div className="space-y-1">
                    <div className="w-20 h-3 bg-dark-700 rounded animate-pulse"></div>
                    <div className="w-12 h-2 bg-dark-700 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-dark-700 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-xs text-gray-500 flex flex-wrap gap-2">
          <a href="#" className="hover:underline hover:text-brand-200">Termos</a>
          <span>•</span>
          <a href="#" className="hover:underline hover:text-brand-200">Privacidade</a>
          <span>•</span>
          <a href="#" className="hover:underline hover:text-brand-200">Cookies</a>
          <span>•</span>
          <span>© 2024 Onlyfoot</span>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-700 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive(item.path) ? 'text-brand-500' : 'text-brand-200'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'fill-current' : ''}`} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};