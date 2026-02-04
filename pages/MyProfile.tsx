import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { PostCard } from '../components/PostCard';
import { CURRENT_USER } from '../constants';
import { db } from '../services/db';
import { Post, Album } from '../types';
import { Camera, Settings, Key, LogOut, Save, Loader2, Grid, Image as ImageIcon, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyProfile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'albums' | 'settings'>('posts');
  
  // Data State
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [myAlbums, setMyAlbums] = useState<Album[]>([]);
  const [isFetchingContent, setIsFetchingContent] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: CURRENT_USER.name,
    handle: CURRENT_USER.handle,
    bio: CURRENT_USER.bio || 'Just a fan of exclusive content.',
    avatar: CURRENT_USER.avatar,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (activeTab === 'posts' || activeTab === 'albums') {
      fetchContent();
    }
  }, [activeTab]);

  const fetchContent = async () => {
    setIsFetchingContent(true);
    try {
      const [posts, albums] = await Promise.all([
        db.getUserPosts(CURRENT_USER.id),
        db.getUserAlbums(CURRENT_USER.id)
      ]);
      setMyPosts(posts);
      setMyAlbums(albums);
    } catch (error) {
      console.error("Failed to fetch profile content", error);
    } finally {
      setIsFetchingContent(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await db.updateProfile(CURRENT_USER.id, {
        name: formData.name,
        bio: formData.bio,
        avatar: formData.avatar
      });
      setTimeout(() => setIsLoading(false), 800);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pb-12">
        {/* Cover Image Area */}
        <div className="relative h-48 bg-dark-800 group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 p-2 rounded-full text-white">
              <Camera className="w-6 h-6" />
            </div>
          </div>
          <img 
            src="https://picsum.photos/id/314/1200/400" 
            alt="Cover" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        <div className="px-4 md:px-8 -mt-16">
          {/* Avatar */}
          <div className="relative inline-block mb-6">
            <img 
              src={formData.avatar} 
              alt="Profile" 
              className="w-32 h-32 rounded-full border-4 border-dark-900 object-cover bg-dark-800"
            />
            <button className="absolute bottom-2 right-2 bg-brand-500 text-white p-2 rounded-full hover:bg-brand-600 border-2 border-dark-900">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">{formData.name}</h1>
              <p className="text-gray-400">{formData.handle}</p>
            </div>
            <Button variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 border-b border-dark-700 mb-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'posts' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              My Posts
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`pb-4 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'albums' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Folder className="w-4 h-4" />
              My Albums
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'settings' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Content Area */}
          {activeTab === 'posts' && (
            <div className="max-w-xl mx-auto">
              {isFetchingContent ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-brand-500" /></div>
              ) : myPosts.length > 0 ? (
                myPosts.map(post => (
                  <PostCard key={post.id} post={post} creator={CURRENT_USER} />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>You haven't posted anything yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'albums' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {isFetchingContent ? (
                <div className="col-span-full flex justify-center py-8"><Loader2 className="animate-spin text-brand-500" /></div>
              ) : myAlbums.length > 0 ? (
                myAlbums.map(album => (
                  <Link to={`/album/${album.id}`} key={album.id} className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 group cursor-pointer">
                    <div className="aspect-square relative">
                      <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Folder className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-white truncate">{album.title}</h3>
                      <p className="text-xs text-gray-500">{album.postCount} items</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Folder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No albums created yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSave} className="max-w-xl space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Display Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Avatar URL (Temporary)</label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-4 border-t border-dark-700 mt-8">
                <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current Password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};