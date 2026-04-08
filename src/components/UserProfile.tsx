import React, { useState } from 'react';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { User, Ad } from '../data';
import { Tab } from '../App';

interface UserProfileProps {
  user: User;
  onClose: () => void;
  onAdClick: (ad: Ad) => void;
  onNavigate: (tab: Tab) => void;
}

export function UserProfile({ user, onClose, onAdClick, onNavigate }: UserProfileProps) {
  const { ads, users, currentUser, createChat, addReview, setActiveChatId } = useAppContext();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Get latest user data
  const userData = users.find(u => u.id === user.id) || user;
  const userAds = ads.filter(a => a.authorId === userData.id);

  const handleContactUser = () => {
    const chatId = createChat(userData.id);
    setActiveChatId(chatId);
    onNavigate('chat');
    onClose();
  };

  const handleAddReview = () => {
    if (reviewText.trim()) {
      addReview(userData.id, reviewRating, reviewText);
      setReviewText('');
      setReviewRating(5);
    }
  };

  return (
    <div className="fixed inset-0 bg-arch-light dark:bg-arch-navy z-50 flex flex-col transition-colors">
      <div className="bg-white dark:bg-arch-navy px-4 py-3 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-arch-border dark:border-arch-brown transition-colors">
        <button onClick={onClose} className="p-2 -ml-2 text-arch-dark/80 dark:text-arch-light/60 hover:bg-arch-border/50 dark:hover:bg-arch-brown/30 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bold text-arch-dark dark:text-arch-light truncate flex-1 font-cinzel">Perfil de {userData.name}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="bg-white dark:bg-arch-brown/20 p-6 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown mb-6 text-center transition-colors">
          <img src={userData.avatar} alt={userData.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-arch-light dark:border-arch-brown" />
          <h1 className="text-2xl font-bold text-arch-dark dark:text-arch-light font-cinzel">{userData.name}</h1>
          <p className="text-arch-navy dark:text-arch-gold font-medium mb-2 font-cormorant text-lg">{userData.specialty}</p>
          <div className="flex items-center justify-center gap-2 text-arch-dark/60 dark:text-arch-light/60 text-sm mb-4">
            <MapPin size={16} />
            <span>{userData.location}</span>
          </div>
          
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-arch-dark dark:text-arch-light font-cinzel">{userData.projects}</p>
              <p className="text-[10px] text-arch-dark/60 dark:text-arch-light/60 uppercase font-bold">Proyectos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-arch-dark dark:text-arch-light flex items-center justify-center gap-1 font-cinzel">
                {userData.rating} <Star size={16} className="text-arch-gold" fill="currentColor" />
              </p>
              <p className="text-[10px] text-arch-dark/60 dark:text-arch-light/60 uppercase font-bold">Valoración</p>
            </div>
          </div>

          {userData.id !== currentUser.id && (
            <button 
              onClick={handleContactUser}
              className="bg-arch-navy dark:bg-arch-gold text-white dark:text-arch-navy font-bold py-3 px-8 rounded-xl hover:bg-arch-navy/90 dark:hover:bg-yellow-500 transition-colors shadow-sm"
            >
              Enviar Mensaje
            </button>
          )}
        </div>

        <h3 className="font-bold text-arch-dark dark:text-arch-light mb-4 font-cinzel text-lg">Anuncios ({userAds.length})</h3>
        <div className="space-y-4 mb-8">
          {userAds.map(ad => (
            <div key={ad.id} onClick={() => onAdClick(ad)} className="bg-white dark:bg-arch-brown/20 p-4 rounded-xl shadow-sm border border-arch-border dark:border-arch-brown cursor-pointer hover:border-arch-navy dark:hover:border-arch-gold transition-colors">
              <h4 className="font-bold text-arch-dark dark:text-arch-light mb-1 font-cinzel">{ad.title}</h4>
              <p className="text-xs text-arch-dark/60 dark:text-arch-light/60 line-clamp-2">{ad.description}</p>
            </div>
          ))}
          {userAds.length === 0 && <p className="text-sm text-arch-dark/60 dark:text-arch-light/60">Este usuario no tiene anuncios activos.</p>}
        </div>

        <h3 className="font-bold text-arch-dark dark:text-arch-light mb-4 font-cinzel text-lg">Valoraciones ({userData.reviews.length})</h3>
        <div className="space-y-4 mb-6">
          {userData.reviews.map(review => {
            const reviewAuthor = users.find(u => u.id === review.authorId);
            return (
              <div key={review.id} className="bg-white dark:bg-arch-brown/20 p-4 rounded-xl shadow-sm border border-arch-border dark:border-arch-brown transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src={reviewAuthor?.avatar} alt={reviewAuthor?.name} className="w-6 h-6 shrink-0 rounded-full object-cover border border-arch-border dark:border-arch-brown/50" />
                    <span className="text-xs font-bold text-arch-dark dark:text-arch-light">{reviewAuthor?.name}</span>
                  </div>
                  <div className="flex text-arch-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-arch-dark/80 dark:text-arch-light/80">{review.comment}</p>
              </div>
            );
          })}
          {userData.reviews.length === 0 && <p className="text-sm text-arch-dark/60 dark:text-arch-light/60">Aún no hay valoraciones.</p>}
        </div>

        {userData.id !== currentUser.id && (
          <div className="bg-white dark:bg-arch-brown/20 p-4 rounded-2xl border border-arch-border dark:border-arch-brown transition-colors">
            <h4 className="font-bold text-arch-dark dark:text-arch-light mb-3 text-sm font-cinzel">Dejar una valoración</h4>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setReviewRating(star)} className="text-arch-gold">
                  <Star size={24} fill={star <= reviewRating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <textarea 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Escribe tu experiencia colaborando..."
              className="w-full bg-arch-light dark:bg-arch-brown/40 text-arch-dark dark:text-arch-light placeholder-arch-dark/40 dark:placeholder-arch-light/40 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40 mb-3 resize-none h-24 border border-transparent dark:border-arch-brown/50 transition-colors"
            />
            <button 
              onClick={handleAddReview}
              disabled={!reviewText.trim()}
              className="w-full bg-arch-navy dark:bg-arch-gold text-white dark:text-arch-navy font-bold py-2 rounded-xl disabled:opacity-50 transition-colors"
            >
              Enviar Valoración
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
