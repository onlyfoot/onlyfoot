import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PostCard } from '../components/PostCard';
import { db } from '../services/db';
import { Album, Post, Creator, User } from '../types';
import { CREATORS, CURRENT_USER } from '../constants';
import { ArrowLeft, Lock, FolderOpen, Loader2 } from 'lucide-react';

export const AlbumDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [creator, setCreator] = useState<Creator | User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const albumData = await db.getAlbum(id);
        if (albumData) {
          setAlbum(albumData);
          const albumPosts = await db.getAlbumPosts(id);
          setPosts(albumPosts);
          
          // Find creator
          if (albumData.creatorId === CURRENT_USER.id) {
            setCreator(CURRENT_USER);
          } else {
            const foundCreator = CREATORS.find(c => c.id === albumData.creatorId);
            if (foundCreator) setCreator(foundCreator);
          }
        }
      } catch (error) {
        console.error("Falha ao carregar álbum", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!album || !creator) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
          <FolderOpen className="w-16 h-16 mb-4 opacity-20" />
          <p>Álbum não encontrado</p>
          <Link to="/profile" className="text-brand-500 mt-4 hover:underline">Voltar</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pb-12">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur border-b border-dark-700 px-4 py-3 flex items-center gap-4">
          <Link to="/profile" className="p-2 -ml-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">{album.title}</h1>
            <p className="text-xs text-gray-400">{posts.length} itens</p>
          </div>
        </div>

        <div className="p-4 md:p-6 max-w-xl mx-auto">
          {/* Album Info Card */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 mb-8 flex items-center gap-6">
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
              <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
              {album.isLocked && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{album.title}</h2>
              <p className="text-sm text-gray-400 mb-3">Criado por {creator.name}</p>
              {album.isLocked && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-500/10 text-brand-500 border border-brand-500/20">
                  Álbum Premium
                </span>
              )}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map(post => (
                <PostCard key={post.id} post={post} creator={creator} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhum post neste álbum ainda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};