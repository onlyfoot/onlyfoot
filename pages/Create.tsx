import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { db } from '../services/db';
import { Album } from '../types';
import { CURRENT_USER } from '../constants';
import { Image as ImageIcon, Lock, Unlock, FolderPlus, Upload, X, Loader2, ChevronDown, Calendar, ShieldCheck, Tag, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Create: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [price, setPrice] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [albumMode, setAlbumMode] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  
  // Upload Progress
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // New Features
  const [scheduledDate, setScheduledDate] = useState('');
  const [hasWatermark, setHasWatermark] = useState(true);
  const [tags, setTags] = useState('');
  
  // Album Selection State
  const [userAlbums, setUserAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | undefined>(undefined);
  const [showAlbumDropdown, setShowAlbumDropdown] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      const albums = await db.getUserAlbums(CURRENT_USER.id);
      setUserAlbums(albums);
    };
    fetchAlbums();
  }, []);

  const handleFileSelect = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setSelectedFile(`https://picsum.photos/id/${randomId}/800/800`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Wait for "upload"
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadProgress(100);

      if (albumMode) {
        await db.createAlbum({
          title: albumTitle,
          isLocked: isLocked
        });
      } else {
        await db.createPost({
          content,
          mediaUrl: selectedFile || undefined,
          isLocked,
          price: isLocked ? Number(price) : 0,
          albumId: selectedAlbumId,
          scheduledFor: scheduledDate || undefined,
          hasWatermark,
          tags: tags.split(',').map(t => t.trim()).filter(t => t)
        });
      }
      
      // Small delay to show 100%
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/profile');
    } catch (error) {
      console.error(error);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const getSelectedAlbumName = () => {
    const album = userAlbums.find(a => a.id === selectedAlbumId);
    return album ? album.title : 'Adicionar ao Álbum (Opcional)';
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 min-h-screen pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Criar Conteúdo</h1>
          <p className="text-gray-400 text-sm">Compartilhe fotos, vídeos ou crie um novo álbum.</p>
        </div>

        <div className="flex gap-4 mb-8 bg-dark-800 p-1 rounded-xl inline-flex border border-dark-700">
          <button
            onClick={() => setAlbumMode(false)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              !albumMode ? 'bg-brand-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Novo Post
          </button>
          <button
            onClick={() => setAlbumMode(true)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              albumMode ? 'bg-brand-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Novo Álbum
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {!albumMode && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Mídia</label>
              <div 
                onClick={handleFileSelect}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  selectedFile ? 'border-brand-500 bg-dark-800' : 'border-dark-600 hover:border-brand-500 hover:bg-dark-800'
                }`}
              >
                {selectedFile ? (
                  <div className="relative">
                    <img src={selectedFile} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    {hasWatermark && (
                      <div className="absolute bottom-4 right-4 bg-black/50 px-2 py-1 rounded text-xs text-white/70 pointer-events-none">
                        Onlyfoot • @{CURRENT_USER.handle.replace('@', '')}
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-white font-medium mb-1">Clique para enviar foto ou vídeo</p>
                    <p className="text-gray-500 text-xs">MP4, JPG, PNG até 50MB</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              {albumMode ? 'Título do Álbum' : 'Legenda'}
            </label>
            {albumMode ? (
              <input
                type="text"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="ex: Férias de Verão 2024"
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                required
              />
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva algo sobre este post..."
                rows={4}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
              />
            )}
          </div>

          <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isLocked ? 'bg-brand-500/20 text-brand-500' : 'bg-green-500/20 text-green-500'}`}>
                  {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-white">Conteúdo Exclusivo</h3>
                  <p className="text-xs text-gray-400">
                    {isLocked ? 'Apenas assinantes ou usuários pagantes podem ver.' : 'Todos podem ver este conteúdo.'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isLocked}
                  onChange={() => setIsLocked(!isLocked)}
                />
                <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>

            {isLocked && !albumMode && (
              <div className="mt-4 pt-4 border-t border-dark-700 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Preço de Desbloqueio (R$)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                />
                <p className="text-xs text-gray-500 mt-2">Deixe vazio para disponibilizar apenas para assinantes.</p>
              </div>
            )}
          </div>

          {!albumMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scheduling */}
              <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-white">Agendar Post</span>
                </div>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Watermark */}
              <div className="bg-dark-800 rounded-xl p-4 border border-dark-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="font-medium text-white block">Marca d'água</span>
                    <span className="text-xs text-gray-500">Proteja seu conteúdo</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={hasWatermark}
                    onChange={() => setHasWatermark(!hasWatermark)}
                  />
                  <div className="w-9 h-5 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                </label>
              </div>
            </div>
          )}

          {!albumMode && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Tags</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="fitness, lifestyle, viagem (separado por vírgula)"
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {!albumMode && (
            <div className="relative">
              <div 
                onClick={() => setShowAlbumDropdown(!showAlbumDropdown)}
                className="flex items-center justify-between bg-dark-800 border border-dark-700 rounded-xl p-3 cursor-pointer hover:border-brand-500 transition-colors"
              >
                <div className="flex items-center gap-3 text-gray-300">
                  <FolderPlus className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium">{getSelectedAlbumName()}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showAlbumDropdown ? 'rotate-180' : ''}`} />
              </div>

              {showAlbumDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-10 overflow-hidden">
                  <div 
                    onClick={() => { setSelectedAlbumId(undefined); setShowAlbumDropdown(false); }}
                    className="px-4 py-3 text-sm text-gray-300 hover:bg-dark-700 cursor-pointer border-b border-dark-700"
                  >
                    Nenhum (Sem Álbum)
                  </div>
                  {userAlbums.map(album => (
                    <div 
                      key={album.id}
                      onClick={() => { setSelectedAlbumId(album.id); setShowAlbumDropdown(false); }}
                      className="px-4 py-3 text-sm text-gray-300 hover:bg-dark-700 cursor-pointer flex justify-between items-center"
                    >
                      <span>{album.title}</span>
                      {selectedAlbumId === album.id && <div className="w-2 h-2 bg-brand-500 rounded-full"></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {isLoading && (
            <div className="w-full bg-dark-700 rounded-full h-2.5 mb-4">
              <div 
                className="bg-brand-500 h-2.5 rounded-full transition-all duration-200" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-center mt-1 text-gray-400">{uploadProgress}% Enviado</p>
            </div>
          )}

          <div className="pt-4">
            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              disabled={isLoading || (!content && !selectedFile && !albumTitle)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {uploadProgress < 100 ? 'Enviando...' : 'Processando...'}
                </>
              ) : (
                scheduledDate ? 'Agendar Post' : `Publicar ${albumMode ? 'Álbum' : 'Post'}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};