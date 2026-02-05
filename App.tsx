import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PackDetail from './pages/PackDetail'; // corrigido
import Login from './pages/Login';
import Register from './pages/Register';
import { PACKS } from './data'; // corrigido
import { AuthProvider, useAuth } from './context/AuthContext';

const AuthenticatedApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [purchasedSlugs, setPurchasedSlugs] = useState<string[]>([]); // corrigido
  const [balance, setBalance] = useState(150.00);

  // Load user-specific data
  useEffect(() => {
    if (user) {
      const savedPurchases = localStorage.getItem(`privacy_purchases_${user.id}`);
      const savedBalance = localStorage.getItem(`privacy_balance_${user.id}`);
      
      if (savedPurchases) {
        setPurchasedSlugs(JSON.parse(savedPurchases));
      } else {
        setPurchasedSlugs([]); // Reset if no data
      }

      if (savedBalance) {
        setBalance(parseFloat(savedBalance));
      } else {
        setBalance(150.00); // Reset to default if no data
      }
    }
  }, [user]);

  // Save user-specific data
  useEffect(() => {
    if (user) {
      localStorage.setItem(`privacy_purchases_${user.id}`, JSON.stringify(purchasedSlugs));
      localStorage.setItem(`privacy_balance_${user.id}`, balance.toString());
    }
  }, [purchasedSlugs, balance, user]);

  const handlePurchase = (slug: string, price: number): boolean => {
    if (purchasedSlugs.includes(slug)) return true;
    
    if (balance >= price) {
      setBalance(prev => prev - price);
      setPurchasedSlugs(prev => [...prev, slug]);
      return true;
    }
    return false;
  };

  if (isLoading) {
    return <div className="min-h-screen bg-darker flex items-center justify-center text-white">Carregando...</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-darker text-slate-200 font-sans selection:bg-primary/30 selection:text-primary">
      <Navbar balance={balance} />
      
      <Routes>
        <Route 
          path="/" 
          element={<Home packs={PACKS} purchasedSlugs={purchasedSlugs} />} // corrigido
        />
        <Route 
          path="/pack/:slug" // corrigido
          element={
            <PackDetail 
              packs={PACKS} 
              purchasedSlugs={purchasedSlugs} 
              onPurchase={handlePurchase} 
            />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Onlyfoot. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AuthenticatedApp />
      </Router>
    </AuthProvider>
  );
};

export default App;
