import React, { useState } from 'react';
import { X, CreditCard, Lock, Loader2, CheckCircle } from 'lucide-react';
import { Button } from './Button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  amount: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  amount
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  if (!isOpen) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await onConfirm();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsProcessing(false);
        onClose();
      }, 1500);
    } catch (error) {
      setIsProcessing(false);
      alert("Pagamento falhou. Por favor, tente novamente.");
    }
  };

  // Format card number with spaces
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(v);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md p-6 relative shadow-2xl">
        <button 
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pagamento com Sucesso!</h3>
            <p className="text-gray-400">Obrigado pela sua compra.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-500/10 rounded-lg">
                  <CreditCard className="w-6 h-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-dark-900/50 rounded-lg border border-dark-700 flex justify-between items-center">
                <span className="text-sm text-gray-300">Total a pagar</span>
                <span className="text-xl font-bold text-white">R$ {amount.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Número do Cartão</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardChange}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    required
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-500 transition-all"
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Validade</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/AA"
                    maxLength={5}
                    required
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">CVC</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                      maxLength={3}
                      required
                      className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-500 transition-all"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg"
                  disabled={isProcessing || !cardNumber || !expiry || !cvc}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    `Pagar R$ ${amount.toFixed(2)}`
                  )}
                </Button>
                <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Pagamentos são seguros e criptografados
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};