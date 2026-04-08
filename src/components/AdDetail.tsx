import React, { useState } from 'react';
import { ArrowLeft, Heart, MessageSquare, Send, MapPin } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Ad, User } from '../data';

interface AdDetailProps {
  ad: Ad;
  onClose: () => void;
  onNavigate: (tab: any) => void;
  onUserClick: (user: User) => void;
}

export function AdDetail({ ad, onClose, onNavigate, onUserClick }: AdDetailProps) {
  const { ads, users, currentUser, toggleLikeAd, addCommentToAd, createChat, setActiveChatId } = useAppContext();
  const [commentText, setCommentText] = useState('');
  
  // Get the latest version of the ad from context
  const currentAd = ads.find(a => a.id === ad.id) || ad;
  const author = users.find(u => u.id === currentAd.authorId);

  const handleAddComment = () => {
    if (commentText.trim()) {
      addCommentToAd(currentAd.id, commentText);
      setCommentText('');
    }
  };

  const handleOfrecerAyuda = () => {
    const chatId = createChat(currentAd.authorId, `Hola, me interesa ayudarte con: ${currentAd.title}`);
    setActiveChatId(chatId);
    onNavigate('chat');
  };

  return (
    <div className="fixed inset-0 bg-arch-light dark:bg-arch-navy z-50 flex flex-col">
      <div className="bg-white dark:bg-arch-navy px-4 py-3 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-arch-border dark:border-arch-brown">
        <button onClick={onClose} className="p-2 -ml-2 text-arch-dark/60 dark:text-arch-light/60 hover:bg-arch-light dark:hover:bg-arch-brown/40 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bold text-arch-dark dark:text-arch-light truncate flex-1 font-cinzel">Detalles del Anuncio</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="bg-white dark:bg-arch-brown/20 p-6 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown mb-6">
          <h1 className="text-2xl font-bold text-arch-dark dark:text-arch-light mb-3 font-cinzel">{currentAd.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {currentAd.projectStatus && (
              <span className="bg-arch-navy/10 dark:bg-arch-gold/20 text-arch-navy dark:text-arch-gold text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                {currentAd.projectStatus}
              </span>
            )}
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {currentAd.timePeriod}
            </span>
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {currentAd.artifactType}
            </span>
          </div>
          
          <div 
            className="flex items-center gap-3 mb-6 p-3 bg-arch-light dark:bg-arch-brown/40 rounded-xl cursor-pointer hover:bg-arch-border dark:hover:bg-arch-brown/60 transition-colors"
            onClick={() => author && onUserClick(author)}
          >
            <img src={author?.avatar} alt={author?.name} className="w-10 h-10 shrink-0 rounded-full object-cover" />
            <div>
              <p className="text-sm font-bold text-arch-dark dark:text-arch-light font-cinzel">{author?.name}</p>
              <p className="text-xs text-arch-dark/60 dark:text-arch-light/60 font-cormorant">{author?.specialty}</p>
            </div>
          </div>

          <p className="text-arch-dark/80 dark:text-arch-light/80 leading-relaxed mb-6">{currentAd.description}</p>
          
          <div className="flex items-center gap-4 pt-4 border-t border-arch-border dark:border-arch-brown">
            <button 
              onClick={() => toggleLikeAd(currentAd.id)}
              className={`flex items-center gap-2 transition-colors ${currentAd.likedBy.includes(currentUser.id) ? 'text-arch-gold' : 'text-arch-dark/60 dark:text-arch-light/60 hover:text-arch-gold dark:hover:text-yellow-500'}`}
            >
              <Heart size={20} fill={currentAd.likedBy.includes(currentUser.id) ? "currentColor" : "none"} />
              <span className="font-bold">{currentAd.likes}</span>
            </button>
            <div className="flex items-center gap-2 text-arch-dark/60 dark:text-arch-light/60">
              <MessageSquare size={20} />
              <span className="font-bold">{currentAd.comments.length}</span>
            </div>
          </div>
        </div>

        {currentAd.authorId !== currentUser.id && (
          <button 
            onClick={handleOfrecerAyuda}
            className="w-full mb-8 bg-arch-navy dark:bg-arch-gold text-white dark:text-arch-navy font-bold py-4 rounded-xl hover:bg-arch-navy/90 dark:hover:bg-yellow-500 transition-colors shadow-sm"
          >
            Ofrecer Ayuda
          </button>
        )}

        <h3 className="font-bold text-arch-dark dark:text-arch-light mb-4 font-cinzel">Comentarios ({currentAd.comments.length})</h3>
        
        <div className="space-y-4 mb-6">
          {currentAd.comments.map(comment => {
            const commentAuthor = users.find(u => u.id === comment.authorId);
            return (
              <div key={comment.id} className="bg-white dark:bg-arch-brown/20 p-4 rounded-xl shadow-sm border border-arch-border dark:border-arch-brown">
                <div className="flex items-center gap-2 mb-2">
                  <img src={commentAuthor?.avatar} alt={commentAuthor?.name} className="w-6 h-6 shrink-0 rounded-full object-cover" />
                  <span className="text-xs font-bold text-arch-dark dark:text-arch-light font-cinzel">{commentAuthor?.name}</span>
                  <span className="text-[10px] text-arch-dark/40 dark:text-arch-light/40 ml-auto">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-arch-dark/80 dark:text-arch-light/80">{comment.text}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-arch-brown/20 p-2 rounded-xl border border-arch-border dark:border-arch-brown sticky bottom-4">
          <input 
            type="text" 
            placeholder="Añadir un comentario..." 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            className="flex-1 bg-transparent px-3 py-2 focus:outline-none text-sm text-arch-dark dark:text-arch-light placeholder-arch-dark/40 dark:placeholder-arch-light/40"
          />
          <button 
            onClick={handleAddComment}
            disabled={!commentText.trim()}
            className="bg-arch-navy/10 dark:bg-arch-gold/20 text-arch-navy dark:text-arch-gold p-2 rounded-lg disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
