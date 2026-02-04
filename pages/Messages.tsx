import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { db } from '../services/db';
import { ChatSession, Message } from '../types';
import { Search, Send, Image as ImageIcon, DollarSign, MoreVertical, ArrowLeft, Lock, Loader2, X } from 'lucide-react';
import { CURRENT_USER } from '../constants';
import { Button } from '../components/Button';

export const Messages: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  
  // Paid Message State
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [messagePrice, setMessagePrice] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      const data = await db.getChatSessions();
      setSessions(data);
    };
    loadSessions();

    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeSessionId) {
      const loadMessages = async () => {
        const data = await db.getMessages(activeSessionId);
        setMessages(data);
      };
      loadMessages();
    }
  }, [activeSessionId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedMedia) || !activeSessionId) return;

    const session = sessions.find(s => s.id === activeSessionId);
    if (!session) return;

    setIsSending(true);
    try {
      const price = messagePrice ? parseFloat(messagePrice) : undefined;
      const msg = await db.sendMessage(session.participantId, newMessage, selectedMedia || undefined, price);
      setMessages([...messages, msg]);
      
      // Reset
      setNewMessage('');
      setSelectedMedia(null);
      setMessagePrice('');
      setShowPaidModal(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleUnlockMessage = async (msg: Message) => {
    if (!msg.price) return;
    setUnlockingId(msg.id);
    try {
      const success = await db.unlockMessage(msg.id, msg.price);
      if (success) {
        // Update local state
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isLocked: false, isPaid: true } : m));
      } else {
        alert("Saldo insuficiente!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUnlockingId(null);
    }
  };

  const handleMediaSelect = () => {
    // Mock media selection
    const randomId = Math.floor(Math.random() * 1000);
    setSelectedMedia(`https://picsum.photos/id/${randomId}/600/400`);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] md:h-screen flex bg-dark-900 relative">
        {/* Sessions List */}
        <div className={`${isMobileView && activeSessionId ? 'hidden' : 'flex'} flex-col w-full md:w-80 border-r border-dark-700`}>
          <div className="p-4 border-b border-dark-700">
            <h1 className="text-xl font-bold text-white mb-4">Mensagens</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar mensagens" 
                className="w-full bg-dark-800 border border-dark-700 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sessions.map(session => (
              <div 
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-dark-800 transition-colors ${activeSessionId === session.id ? 'bg-dark-800' : ''}`}
              >
                <div className="relative">
                  <img src={session.participantAvatar} alt={session.participantName} className="w-12 h-12 rounded-full object-cover" />
                  {session.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-dark-900">
                      {session.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-white truncate">{session.participantName}</h3>
                    <span className="text-xs text-gray-500">{session.lastMessageTime}</span>
                  </div>
                  <p className={`text-sm truncate ${session.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                    {session.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${isMobileView && !activeSessionId ? 'hidden' : 'flex'} flex-col flex-1 bg-dark-900`}>
          {activeSession ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-dark-700 flex items-center justify-between bg-dark-900/95 backdrop-blur">
                <div className="flex items-center gap-3">
                  {isMobileView && (
                    <button onClick={() => setActiveSessionId(null)} className="text-gray-400 hover:text-white">
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                  )}
                  <img src={activeSession.participantAvatar} alt={activeSession.participantName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-white">{activeSession.participantName}</h3>
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Online
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => {
                  const isMe = msg.senderId === CURRENT_USER.id;
                  const isLocked = msg.isLocked && !isMe && !msg.isPaid;

                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl overflow-hidden ${
                        isMe ? 'bg-brand-500 text-white rounded-tr-none' : 'bg-dark-800 text-gray-200 rounded-tl-none'
                      }`}>
                        {/* Media Content */}
                        {msg.mediaUrl && (
                          <div className="relative">
                            {isLocked ? (
                              <div className="relative w-64 h-64 bg-black flex flex-col items-center justify-center p-4">
                                <img src={msg.mediaUrl} className="absolute inset-0 w-full h-full object-cover blur-xl opacity-50" />
                                <Lock className="w-8 h-8 text-white mb-2 relative z-10" />
                                <p className="text-white font-bold mb-3 relative z-10">Conteúdo Premium</p>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleUnlockMessage(msg)}
                                  disabled={unlockingId === msg.id}
                                  className="relative z-10"
                                >
                                  {unlockingId === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : `Desbloquear R$ ${msg.price}`}
                                </Button>
                              </div>
                            ) : (
                              <img src={msg.mediaUrl} className="w-full max-w-sm object-cover" />
                            )}
                          </div>
                        )}

                        {/* Text Content */}
                        {(msg.text || (msg.price && msg.price > 0)) && (
                          <div className="px-4 py-2">
                            {msg.text}
                            {msg.price && msg.price > 0 && isMe && (
                              <div className="text-xs bg-black/20 inline-block px-2 py-0.5 rounded mt-1">
                                Preço: R$ {msg.price}
                              </div>
                            )}
                            <div className={`text-[10px] mt-1 ${isMe ? 'text-brand-200' : 'text-gray-500'}`}>
                              {msg.timestamp}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-dark-700">
                {selectedMedia && (
                  <div className="mb-2 relative inline-block">
                    <img src={selectedMedia} className="h-20 rounded-lg border border-dark-600" />
                    <button 
                      onClick={() => setSelectedMedia(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={handleMediaSelect}
                    className="p-2 text-gray-400 hover:text-brand-500 transition-colors"
                  >
                    <ImageIcon className="w-6 h-6" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowPaidModal(true)}
                    className={`p-2 transition-colors ${messagePrice ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
                  >
                    <DollarSign className="w-6 h-6" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={messagePrice ? `Enviar mensagem paga (R$ ${messagePrice})...` : "Digite uma mensagem..."}
                      className="w-full bg-dark-800 border border-dark-700 rounded-full py-3 pl-4 pr-10 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={(!newMessage.trim() && !selectedMedia) || isSending}
                    className="p-3 bg-brand-500 text-white rounded-full hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-4">
                <Send className="w-10 h-10 opacity-20" />
              </div>
              <p>Selecione uma conversa para começar a enviar mensagens</p>
            </div>
          )}
        </div>

        {/* Paid Message Modal */}
        {showPaidModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-sm p-6 relative">
              <button 
                onClick={() => setShowPaidModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Definir Preço da Mensagem</h3>
                <p className="text-sm text-gray-400">O destinatário deve pagar para ver esta mensagem.</p>
              </div>

              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                <input
                  type="number"
                  value={messagePrice}
                  onChange={(e) => setMessagePrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <Button 
                onClick={() => setShowPaidModal(false)} 
                fullWidth 
              >
                Confirmar Preço
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};