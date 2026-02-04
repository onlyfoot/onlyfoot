import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PostCard } from '../components/PostCard';
import { Button } from '../components/Button';
import { PaymentModal } from '../components/PaymentModal';
import { CREATORS, POSTS } from '../constants';
import { db } from '../services/db';
import { BadgeCheck, MapPin, Link as LinkIcon, Grid, Image as ImageIcon, Video, ArrowLeft, Loader2, MoreVertical, Ban } from 'lucide-react';

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [creator, setCreator] = useState(CREATORS[0]);
  const [posts, setPosts] = useState(POSTS);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoadingSub, setIsLoadingSub] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'videos'>('all');
  const [showOptions, setShowOptions] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const foundCreator = CREATORS.find(c => c.id === id);
    if (foundCreator) {
      setCreator(foundCreator);
      setPosts(POSTS.filter(p => p.creatorId === foundCreator.id));
      checkSubscription(foundCreator.id);
    }
  }, [id]);

  const checkSubscription = async (creatorId: string) => {
    const status = await db.isSubscribed(creatorId);
    setIsSubscribed(status);
  };

  const handleSubscribeClick = () => {
    if (isSubscribed) {
      // Unsubscribe logic directly
      handleSubscriptionToggle();
    } else {
      // Show payment modal for new subscription
      setShowPaymentModal(true);
    }
  };

  const handleSubscriptionToggle = async () => {
    setIsLoadingSub(true);
    try {
      const newStatus = await db.toggleSubscription(creator.id);
      setIsSubscribed(newStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSub(false);
    }
  };

  const handleBlock = async () => {
    await db.toggleBlockUser(creator.id);
    alert(`Bloqueou ${creator.name}`);
    setShowOptions(false);
  };

  if (!creator) return <div>Carregando...</div>;

  return (
    <Layout>
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handleSubscriptionToggle}
        title={`Assinar ${creator.name}`}
        description="Acesso mensal ao conteúdo exclusivo"
        amount={creator.price}
      />

      {/* Header Nav for Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-transparent p-4 flex justify-between items-center">
        <Link to="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white"
          >
            <MoreVertical className="w-6 h-6" />
          </button>
          {showOptions && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-10 overflow-hidden">
              <button 
                onClick={handleBlock}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-dark-700 flex items-center gap-2"
              >
                <Ban className="w-4 h-4" />
                Bloquear Usuário
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Banner */}
      <div className="relative h-48 md:h-64 w-full bg-dark-800">
        <img 
          src={creator.banner} 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-dark-900/90"></div>
      </div>

      {/* Profile Info */}
      <div className="px-4 md:px-8 relative -mt-16 mb-6">
        <div className="flex justify-between items-end mb-4">
          <div className="relative">
            <img 
              src={creator.avatar} 
              alt={creator.name} 
              className="w-32 h-32 rounded-full border-4 border-dark-900 object-cover"
            />
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-dark-900 rounded-full"></div>
          </div>
          <div className="flex gap-2 mb-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <ShareIcon className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <div className="relative hidden sm:block">
              <Button variant="outline" size="sm" onClick={() => setShowOptions(!showOptions)}>
                <MoreVertical className="w-4 h-4" />
              </Button>
              {showOptions && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-10 overflow-hidden">
                  <button 
                    onClick={handleBlock}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-dark-700 flex items-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    Bloquear Usuário
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">{creator.name}</h1>
            {creator.isVerified && <BadgeCheck className="w-6 h-6 text-gold-500 fill-gold-500/10" />}
          </div>
          <p className="text-gray-400 mb-4">{creator.handle}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>Brasil</span>
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon className="w-4 h-4 text-gray-500" />
              <a href="#" className="text-brand-500 hover:underline">instagram.com/{creator.handle.replace('@', '')}</a>
            </div>
          </div>

          <p className="text-gray-200 leading-relaxed max-w-2xl mb-6">
            {creator.bio}
          </p>

          <div className="flex gap-6 border-y border-dark-700 py-4 mb-6">
            <div className="text-center">
              <div className="font-bold text-lg text-white">{creator.postsCount}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-white">{creator.photosCount}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Fotos</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-white">{creator.videosCount}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Vídeos</div>
            </div>
            <div className="text-center ml-auto">
              <div className="font-bold text-lg text-white">{creator.subscribers}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Fãs</div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-dark-800 rounded-xl p-1 border border-dark-700 mb-8">
            <div className="bg-gradient-to-r from-brand-900/20 to-dark-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Assinatura</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">R$ {creator.price}</span>
                  <span className="text-sm text-gray-400">/ mês</span>
                </div>
              </div>
              <Button 
                onClick={handleSubscribeClick}
                variant={isSubscribed ? 'outline' : 'primary'}
                className="min-w-[140px]"
                disabled={isLoadingSub}
              >
                {isLoadingSub ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isSubscribed ? (
                  'Inscrito'
                ) : (
                  'Assinar Agora'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="border-b border-dark-700 mb-6">
          <div className="flex gap-8">
            <TabButton 
              active={activeTab === 'all'} 
              onClick={() => setActiveTab('all')} 
              icon={Grid} 
              label="Posts" 
            />
            <TabButton 
              active={activeTab === 'photos'} 
              onClick={() => setActiveTab('photos')} 
              icon={ImageIcon} 
              label="Fotos" 
            />
            <TabButton 
              active={activeTab === 'videos'} 
              onClick={() => setActiveTab('videos')} 
              icon={Video} 
              label="Vídeos" 
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-xl mx-auto">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} creator={creator} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="bg-dark-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Nenhum post ainda</h3>
              <p className="text-gray-500">Este criador ainda não postou nada nesta categoria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
      active 
        ? 'border-brand-500 text-brand-500' 
        : 'border-transparent text-gray-500 hover:text-gray-300'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium text-sm uppercase tracking-wide">{label}</span>
  </button>
);

const ShareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);