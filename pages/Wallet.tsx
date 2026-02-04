import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { db } from '../services/db';
import { Transaction } from '../types';
import { CURRENT_USER } from '../constants';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, CreditCard, Download, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const Wallet: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await db.getTransactions();
    setTransactions(data);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0 || amount > CURRENT_USER.balance) return;

    setIsWithdrawing(true);
    try {
      const success = await db.requestWithdrawal(amount);
      if (success) {
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        loadData(); // Refresh transactions
      } else {
        alert("Saque falhou. Verifique seu saldo.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Mock data for chart
  const chartData = [
    { name: 'Seg', amount: 120 },
    { name: 'Ter', amount: 200 },
    { name: 'Qua', amount: 150 },
    { name: 'Qui', amount: 300 },
    { name: 'Sex', amount: 250 },
    { name: 'Sab', amount: 400 },
    { name: 'Dom', amount: 380 },
  ];

  return (
    <Layout>
      <div className="p-4 md:p-6 min-h-screen pb-20 relative">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Carteira</h1>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-brand-900 to-dark-800 rounded-2xl p-6 mb-8 border border-brand-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10">
            <p className="text-brand-200 text-sm font-medium mb-1">Saldo Total</p>
            <h2 className="text-4xl font-bold text-white mb-6">R$ {CURRENT_USER.balance.toFixed(2)}</h2>
            
            <div className="flex gap-3">
              <Button variant="primary" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Fundos
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowWithdrawModal(true)}
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Sacar
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-dark-700 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeTab === 'transactions' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            Transações
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Chart */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h3 className="text-lg font-bold text-white mb-4">Atividade de Ganhos</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{ fill: '#262626' }}
                    />
                    <Bar dataKey="amount" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Métodos de Pagamento</h3>
                <button className="text-brand-500 text-sm font-medium hover:underline">Gerenciar</button>
              </div>
              <div className="flex items-center gap-4 p-4 bg-dark-900/50 rounded-lg border border-dark-700">
                <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Visa final 4242</p>
                  <p className="text-xs text-gray-500">Expira 12/25</p>
                </div>
                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded border border-green-500/20">Padrão</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-dark-800 rounded-xl border border-dark-700">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{tx.description}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <div className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-sm p-6 relative">
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-brand-500/20 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Sacar Fundos</h3>
                <p className="text-sm text-gray-400">Disponível: R$ {CURRENT_USER.balance.toFixed(2)}</p>
              </div>

              <form onSubmit={handleWithdraw}>
                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    max={CURRENT_USER.balance}
                    min="10"
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-brand-500"
                  />
                  <p className="text-xs text-gray-500 mt-2 ml-1">Saque mínimo: R$ 10,00</p>
                </div>

                <Button 
                  type="submit"
                  fullWidth 
                  disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) > CURRENT_USER.balance}
                >
                  {isWithdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Saque'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};