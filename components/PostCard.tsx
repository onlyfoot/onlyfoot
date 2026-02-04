import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Lock, Bookmark, Loader2, Send, DollarSign, X, MoreVertical, Flag, AlertTriangle, Trash2, Edit2, Check } from 'lucide-react';
import { Post, Creator, User, Comment } from '../types';
import { Button } from './Button';
import { PaymentModal } from './PaymentModal';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { CURRENT_USER } from '../constants';

interface PostCardProps {
  post: Post;
  creator: Creator | User;
}

export const PostCard: React.FC<PostCardProps> = ({ post, creator }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isUnlocked, setIsUnlocked] = useState(!post.isLocked);
  const [isDeleted, setIsDeleted] = useState(false);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSaving, setIsSaving] = useState(false);

  // Comments State
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Tipping & Payment State
  const [showTipModal, setShowTipModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('5');

  // Options State
  const [showOptions, setShowOptions] = useState(false);

  const isOwner = creator.id === CURRENT_USER.id;

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      await db.toggleLike(post.id);
    } catch (error) {
      setIsLiked(!newLikedState);
      setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
    }
  };

  const handleUnlock = async () => {
    try {
      const success = await db.unlockPost(post.id);
      if (success) {
        setIsUnlocked(true);
      } else {
        alert("Saldo insuficiente!");
      }
    } catch (error) {
      console.error("Falha ao desbloquear", error);
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      setIsLoadingComments(true);
      setShowComments(true);
      try {
        const data = await db.getComments(post.id);
        setComments(data);
      } finally {
        setIsLoadingComments(false);
      }
    } else {
      setShowComments(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await db.addComment(post.id, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error("Falha ao postar comentário", error);
    }
  };

  const handleTip = async () => {
    try {
      const success = await db.sendTip(creator.id, Number(tipAmount));
      if (success) {
        alert(`Gorjeta de R$ ${tipAmount} enviada com sucesso!`);
      } else {
        alert("Saldo insuficiente!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReport = () => {
    db.submitReport(post.id, 'post', 'Conteúdo inapropriado');
    alert("Post denunciado à administração.");
    setShowOptions(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este post?")) {
      await db.deletePost(post.id);
      setIsDeleted(true);
    }
    setShowOptions(false);
  };

  const handleEdit = async () => {
    setIsSaving(true);
    try {
      await db.updatePost(post.id, editContent);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (isDeleted) return null;

  return (
    <div className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 mb-6">
      {/* Payment Modals */}
      <PaymentModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onConfirm={handleUnlock}
        title="Desbloquear Post"
        description="Pagamento único para ver este conteúdo"
        amount={post.price || 5.00}
      />

      <PaymentModal
        isOpen={showTipModal}
        onClose={() => setShowTipModal(false)}
        onConfirm={handleTip}
        title="Enviar Gorjeta"
        description={`Apoie ${creator.name}`}
        amount={Number(tipAmount)}
      />

      {/* Header */}
      <div className="p-4 flex items-center justify-between relative">
        <Link to={creator.id.startsWith('c') ? `/creator/${creator.id}` : '#'} className="flex items-center gap-3">
          <img 
            src={creator.avatar} 
            alt={creator.name} 
            className="w-10 h-10 rounded-full object-cover border border-dark-600"
          />
          <div>
            <h3 className="font-semibold text-sm text-white hover:underline">{creator.name}</h3>
            <p className="text-xs text-gray-400">{post.timestamp}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {!isOwner && (
            <button 
              onClick={() => setShowTipModal(true)}
              className="text-brand-500 hover:text-brand-400 flex items-center gap-1 text-xs font-bold border border-brand-500/30 px-3 py-1 rounded-full hover:bg-brand-500/10 transition-colors"
            >
              <DollarSign className="w-3 h-3" />
              GORJETA
            </button>
          )}
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="text-gray-400 hover:text-white p-1"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showOptions && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-10 overflow-hidden">
                {isOwner ? (
                  <>
                    <button 
                      onClick={() => { setIsEditing(true); setShowOptions(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-dark-700 flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar Post
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-dark-700 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleReport}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-dark-700 flex items-center gap-2"
                  >
                    <Flag className="w-4 h-4" />
                    Denunciar Post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Text */}
      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="mb-2">
            <textarea 
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-brand-500"
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setIsEditing(false)} className="text-xs text-gray-400 hover:text-white">Cancelar</button>
              <button 
                onClick={handleEdit}
                disabled={isSaving}
                className="text-xs bg-brand-500 text-white px-3 py-1 rounded-full flex items-center gap-1"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-200">{post.content}</p>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs text-brand-500 hover:underline cursor-pointer">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Media Area */}
      <div className="relative w-full bg-black aspect-[4/5] sm:aspect-video">
        {isUnlocked ? (
          <div className="relative w-full h-full">
            <img 
              src={post.mediaUrl} 
              alt="Post content" 
              className="w-full h-full object-cover"
            />
            {post.hasWatermark && (
              <div className="absolute bottom-4 right-4 bg-black/50 px-2 py-1 rounded text-xs text-white/70 pointer-events-none select-none">
                Onlyfoot • {creator.handle}
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={post.mediaUrl} 
              alt="Locked content" 
              className="w-full h-full object-cover blur-2xl opacity-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-6 text-center">
              <div className="bg-dark-800/80 p-4 rounded-full mb-4 backdrop-blur-sm">
                <Lock className="w-8 h-8 text-brand-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Conteúdo Premium</h3>
              <p className="text-sm text-gray-300 mb-6 max-w-xs">
                Desbloqueie este post por R$ {post.price?.toFixed(2)} para ver o conteúdo exclusivo.
              </p>
              <Button 
                onClick={() => setShowUnlockModal(true)} 
                variant="primary" 
                className="w-full max-w-xs"
              >
                Desbloquear por R$ {post.price?.toFixed(2)}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked ? 'text-brand-500' : 'text-gray-400 hover:text-white'}`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={toggleComments}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${showComments ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>
        <div className="text-sm font-semibold text-white">
          {likesCount.toLocaleString()} curtidas
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-dark-700 bg-dark-900/30 p-4">
          <form onSubmit={handlePostComment} className="flex gap-3 mb-4">
            <img src={CURRENT_USER.avatar} alt="Eu" className="w-8 h-8 rounded-full" />
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..."
                className="w-full bg-dark-900 border border-dark-600 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-brand-500"
              />
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-500 disabled:opacity-50 hover:text-brand-400"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {isLoadingComments ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <img src={comment.userAvatar} alt={comment.userName} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-white">{comment.userName}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-300">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-gray-500 py-2">Nenhum comentário ainda.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};