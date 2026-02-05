import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from './Onlyfoot.png'; // sua logo dentro de components

interface NavbarProps {
  balance: number; // não usado, mas mantido para compatibilidade
}

const Navbar: React.FC<NavbarProps> = () => {
  const { logout, user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-darker border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* altura mais compacta */}
        <div className="flex items-center justify-between h-20">
          
          {/* Logo menor e alinhada à esquerda */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Onlyfoot Logo"
              className="h-14 w-auto" // logo proporcional
            />
          </Link>

          {/* Links principais */}
          <div className="hidden md:flex items-center gap-8 text-white font-medium">
            <Link to="/galeria" className="hover:text-primary">Galeria</Link>
            <Link to="/videos" className="hover:text-primary">Vídeos</Link>
            <Link to="/famosos" className="hover:text-primary">Famosos</Link>
          </div>

          {/* Perfil & Logout */}
          <div className="flex items-center gap-5">
            {/* Perfil */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-zinc-500">Membro</p>
              </div>
              <div className="w-10 h-10 bg-zinc-700 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-all">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            
            {/* Logout */}
            <button 
              onClick={logout}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
              title="Sair"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
