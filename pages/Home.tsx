import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { CreatorCard } from '../components/CreatorCard';
import { PostCard } from '../components/PostCard';
import { StoryRail } from '../components/StoryRail';
import { CREATORS } from '../constants';
import { db } from '../services/db';
import { Post, Creator, User } from '../types';
import { Flame, Star, TrendingUp, Loader2 } from 'lucide-react';

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'feed'>('featured');
  const [feedItems, setFeedItems] = useState<{ post: Post; creator: Creator | User }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'feed') {
      loadFeed();
    }
  }, [activeTab]);

  const loadFeed = async () => {
    setIsLoading(true);
    try {
      const items = await db.getFeed();
      setFeedItems(items);
    } catch (error) {
      console.error("Failed to load feed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Tabs */}
      <div className="sticky top-16 md:top-0 z-40 bg-dark-900/95 backdrop-blur border-b border-dark-700 px-4">
        <div className="flex items-center gap-8 h-14">
          <button 
            onClick={() => setActiveTab('featured')}
            className={`h-full relative font-medium text-sm transition-colors ${
              activeTab === 'featured' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Destaques
            {activeTab === 'featured' && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-t-full"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('feed')}
            className={`h-full relative font-medium text-sm transition-colors ${
              activeTab === 'feed' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Atividade Recente
            {activeTab === 'feed' && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-t-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Stories */}
      <div className="border-b border-dark-700 bg-dark-900/50">
        <StoryRail />
      </div>

      <div className="p-4 md:p-6">
        {activeTab === 'featured' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <h2 className="text-xl font-bold">Em Alta Agora</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CREATORS.slice(0, 2).map(creator => (
                  <CreatorCard key={creator.id} creator={creator} />
                ))}
              </div>
            </section>

            {/* Trending Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold">Criadores Tendência</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {CREATORS.slice(2, 6).map(creator => (
                  <CreatorCard key={creator.id} creator={creator} />
                ))}
              </div>
            </section>

            {/* New Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <h2 className="text-xl font-bold">Novos e Notáveis</h2>
              </div>
              <div className="overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar flex gap-4">
                {CREATORS.map(creator => (
                  <div key={`new-${creator.id}`} className="min-w-[280px]">
                    <CreatorCard creator={creator} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : (
              <>
                {feedItems.map(({ post, creator }) => (
                  <PostCard key={post.id} post={post} creator={creator as Creator} />
                ))}
                <div className="text-center py-8 text-gray-500 text-sm">
                  Você chegou ao fim do feed.
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};