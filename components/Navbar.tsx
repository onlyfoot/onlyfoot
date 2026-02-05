import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from './Onlyfoot.png'; // sua logo dentro de components

interface NavbarProps {
  balance: number; // mantido para compatibilidade futura
}

const Navbar: React.FC<NavbarProps> = ({ balance }) => {
  const { logout, user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-dark-900 border-b border-dark-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* altura compacta */}
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Onlyfoot Logo"
              className="h-14 w-auto"
            />
          </Link>

          {/* Links principais */}
          <div className="hidden md:flex items-center gap-8 text-white font-medium">
            <Link to="/galeria" className="hover:text-brand-500 transition-colors">Galeria</Link>
            <Link to="/videos" className="hover:text-brand-500 transition-colors">Vídeos</Link>
            <Link to="/famosos" className="hover:text-brand-500 transition-colors">Famosos</Link>
          </div>

          {/* Perfil & Logout */}
          <div className="flex items-center gap-5">
            {/* Perfil */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-500">Membro</p>
              </div>
              <div className="w-10 h-10 bg-dark-700 rounded-full overflow-hidden border-2 border-transparent hover:border-brand-500 transition-all">
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
              className="p-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-full transition-colors"
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
