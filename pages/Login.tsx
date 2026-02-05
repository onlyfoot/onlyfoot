import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Preencha todos os campos.');
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Email ou senha incorretos.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao tentar entrar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-brand-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Bem-vindo de volta
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Acesse sua área exclusiva
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-dark-800 rounded-t-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                placeholder="Endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-dark-800 rounded-b-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm pr-10"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-brand-500 text-sm bg-brand-900/30 p-3 rounded-md border border-brand-900/50">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white ${
                isSubmitting
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors`}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="font-medium text-brand-500 hover:text-brand-400"
              >
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
