import { useState } from 'react';
import { Bell, MapPin, Heart, MessageSquare, Briefcase, Users, CheckCircle, Clock, Plus } from 'lucide-react';
import { Tab } from '../App';
import { useAppContext } from '../AppContext';
import { AdDetail } from './AdDetail';
import { UserProfile } from './UserProfile';
import { Ad, User } from '../data';

interface HomeProps {
  onNavigate: (tab: Tab) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { ads, users, chats, currentUser, toggleLikeAd, setActiveChatId, markChatAsRead } = useAppContext();
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const totalUnread = chats.reduce((acc, chat) => chat.participants.includes(currentUser.id) ? acc + chat.unreadCount : acc, 0);
  const featuredAds = ads.slice(0, 3);
  const myActiveProjects = ads.filter(ad => ad.authorId === currentUser.id);

  const handleBellClick = () => {
    // Find first chat with unread messages
    const unreadChat = chats.find(c => c.participants.includes(currentUser.id) && c.unreadCount > 0);
    if (unreadChat) {
      setActiveChatId(unreadChat.id);
      markChatAsRead(unreadChat.id);
    } else {
      setActiveChatId(null);
    }
    onNavigate('chat');
  };

  if (selectedAd) {
    return (
      <AdDetail 
        ad={selectedAd} 
        onClose={() => setSelectedAd(null)} 
        onNavigate={onNavigate} 
        onUserClick={(user) => { setSelectedUser(user); setSelectedAd(null); }}
      />
    );
  }

  if (selectedUser) {
    return (
      <UserProfile 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
        onAdClick={(ad) => { setSelectedAd(ad); setSelectedUser(null); }}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-arch-light dark:bg-arch-navy text-arch-dark dark:text-arch-light pb-24 transition-colors">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4 bg-white dark:bg-arch-navy sticky top-0 z-10 shadow-sm border-b border-arch-border dark:border-arch-brown transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              {/* Compass Points */}
              <path d="M50 4 L58 18 L42 18 Z" fill="#9C6B4E"/>
              <path d="M50 96 L58 82 L42 82 Z" fill="#9C6B4E"/>
              <path d="M96 50 L82 42 L82 58 Z" fill="#9C6B4E"/>
              <path d="M4 50 L18 42 L18 58 Z" fill="#9C6B4E"/>
              <path d="M82 18 L75 28 L68 21 Z" fill="#9C6B4E"/>
              <path d="M82 82 L75 72 L68 79 Z" fill="#9C6B4E"/>
              <path d="M18 82 L25 72 L32 79 Z" fill="#9C6B4E"/>
              <path d="M18 18 L25 28 L32 21 Z" fill="#9C6B4E"/>

              {/* Outer Ring */}
              <circle cx="50" cy="50" r="38" fill="#9C6B4E"/>
              
              {/* Ocean */}
              <circle cx="50" cy="50" r="34" fill="#F6E5D4"/>
              
              {/* Continents */}
              <path d="M 28 18 C 20 20, 18 30, 18 35 C 20 40, 25 45, 25 48 C 22 50, 28 55, 30 60 C 30 65, 32 75, 35 80 C 38 82, 42 78, 45 70 C 48 60, 45 55, 40 50 C 45 48, 48 45, 45 40 C 42 35, 45 30, 48 28 C 50 25, 45 20, 40 18 C 35 16, 30 16, 28 18 Z" fill="#2B3B68"/>
              <path d="M 55 18 C 65 16, 75 20, 80 28 C 82 35, 80 40, 75 42 C 70 45, 65 40, 60 38 C 55 35, 52 30, 55 18 Z" fill="#2B3B68"/>
              <path d="M 52 45 C 60 42, 70 45, 75 50 C 78 55, 80 65, 75 75 C 70 80, 60 78, 55 70 C 50 60, 48 50, 52 45 Z" fill="#2B3B68"/>
            </svg>
          </div>
          <h1 className="text-2xl font-cinzel font-bold text-arch-navy dark:text-arch-light tracking-tight">Sapientia</h1>
        </div>
        <button 
          onClick={handleBellClick}
          className="relative p-2 rounded-full hover:bg-arch-light dark:hover:bg-arch-brown/30 text-arch-dark/70 dark:text-arch-light/70 transition-colors"
        >
          <Bell size={24} />
          {totalUnread > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-arch-navy"></span>
          )}
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-8 p-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-arch-dark/60 dark:text-arch-light/60 text-sm font-medium font-cormorant italic text-lg">Bienvenido/a de nuevo,</p>
            <h2 className="text-arch-navy dark:text-arch-light text-2xl font-bold font-cinzel">{currentUser.name.split(' ')[0]} 👋</h2>
          </div>
          <div className="w-14 h-14 shrink-0 rounded-full border-2 border-white dark:border-arch-brown shadow-md overflow-hidden bg-arch-light dark:bg-arch-brown/50">
            <img alt={currentUser.name} className="w-full h-full object-cover" src={currentUser.avatar} />
          </div>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-arch-brown/20 p-4 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown text-center transition-colors">
            <div className="bg-arch-navy/10 dark:bg-arch-navy/40 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-arch-navy dark:text-arch-light">
              <Briefcase size={20} />
            </div>
            <p className="text-xl font-bold text-arch-navy dark:text-arch-light font-cinzel">{ads.length}</p>
            <p className="text-[10px] text-arch-dark/60 dark:text-arch-light/60 uppercase font-bold tracking-wider">Anuncios</p>
          </div>
          <div className="bg-arch-gold/10 dark:bg-arch-gold/20 p-4 rounded-2xl shadow-sm border border-arch-gold/30 dark:border-arch-gold/30 text-center transition-colors">
            <div className="bg-white dark:bg-arch-brown w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-arch-gold dark:text-arch-gold shadow-sm">
              <Users size={20} />
            </div>
            <p className="text-xl font-bold text-arch-navy dark:text-arch-light font-cinzel">{users.filter(u => u.isOnline).length}</p>
            <p className="text-[10px] text-arch-dark/60 dark:text-arch-light/60 uppercase font-bold tracking-wider">Online</p>
          </div>
          <button 
            onClick={() => onNavigate('settings')}
            className="bg-arch-brown/10 dark:bg-arch-brown/30 p-4 rounded-2xl shadow-sm border border-arch-brown/20 dark:border-arch-brown/40 text-center transition-colors hover:bg-arch-brown/20 dark:hover:bg-arch-brown/40"
          >
            <div className="bg-white dark:bg-arch-navy w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-arch-brown dark:text-arch-light shadow-sm">
              <Plus size={20} />
            </div>
            <p className="text-xl font-bold text-arch-navy dark:text-arch-light font-cinzel">AI</p>
            <p className="text-[10px] text-arch-dark/60 dark:text-arch-light/60 uppercase font-bold tracking-wider">Integración</p>
          </button>
        </section>

        {/* My Active Projects */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-lg font-bold text-arch-navy dark:text-arch-light font-cinzel">Mis Proyectos Activos</h3>
          </div>
          <div className="space-y-4">
            {myActiveProjects.length > 0 ? (
              myActiveProjects.map(ad => (
                <div 
                  key={ad.id} 
                  onClick={() => setSelectedAd(ad)}
                  className="bg-white dark:bg-arch-brown/20 p-5 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown cursor-pointer hover:border-arch-navy dark:hover:border-arch-gold transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-arch-dark dark:text-arch-light text-base font-cormorant text-xl leading-tight">{ad.title}</h4>
                    <span className="bg-arch-navy/10 dark:bg-arch-gold/20 text-arch-navy dark:text-arch-gold text-[10px] font-bold px-2 py-1 rounded-full uppercase ml-2 shrink-0">
                      {ad.projectStatus || 'Activo'}
                    </span>
                  </div>
                  <p className="text-xs text-arch-dark/70 dark:text-arch-light/70 line-clamp-1 mb-3">{ad.description}</p>
                  <div className="flex items-center gap-3 text-arch-dark/50 dark:text-arch-light/50 text-[10px] font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{ad.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>Actualizado recientemente</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-arch-light/50 dark:bg-arch-brown/10 p-8 rounded-2xl text-center border border-dashed border-arch-border dark:border-arch-brown">
                <p className="text-arch-dark/60 dark:text-arch-light/60 text-sm">No tienes proyectos activos actualmente.</p>
                <button 
                  onClick={() => onNavigate('search')}
                  className="mt-3 text-arch-navy dark:text-arch-gold font-bold text-sm hover:underline"
                >
                  Explorar oportunidades
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Featured Opportunities */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-bold text-arch-navy dark:text-arch-light font-cinzel">Oportunidades Destacadas</h3>
            <button onClick={() => onNavigate('search')} className="text-arch-navy dark:text-arch-gold text-sm font-semibold hover:underline">Ver Todo</button>
          </div>
          
          <div className="space-y-4">
            {featuredAds.map((ad, index) => {
              const author = users.find(u => u.id === ad.authorId);
              const isLiked = ad.likedBy.includes(currentUser.id);
              return (
                <div 
                  key={ad.id} 
                  onClick={() => setSelectedAd(ad)}
                  className="bg-white dark:bg-arch-brown/20 p-5 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown flex flex-col gap-4 cursor-pointer hover:border-arch-navy dark:hover:border-arch-gold transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex items-center gap-3"
                      onClick={(e) => { e.stopPropagation(); author && setSelectedUser(author); }}
                    >
                      <div className="w-10 h-10 shrink-0 rounded-full bg-arch-light dark:bg-arch-brown overflow-hidden border border-arch-border dark:border-arch-brown/50">
                        <img alt={author?.name} className="w-full h-full object-cover" src={author?.avatar} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-arch-dark dark:text-arch-light group-hover:text-arch-navy dark:group-hover:text-arch-gold transition-colors">{author?.name}</p>
                        <p className="text-[10px] text-arch-brown dark:text-arch-gold/80 font-bold uppercase tracking-wider">{author?.specialty}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {index === 0 && (
                        <span className="px-2 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase rounded-md">Urgente</span>
                      )}
                      <span className="px-2 py-1 bg-arch-light dark:bg-arch-brown/40 text-arch-dark/60 dark:text-arch-light/80 text-[10px] font-bold uppercase rounded-md">{ad.timePeriod}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-arch-dark dark:text-arch-light mb-1 group-hover:text-arch-navy dark:group-hover:text-arch-gold transition-colors leading-tight font-cormorant text-2xl">{ad.title}</h4>
                    <p className="text-arch-dark/70 dark:text-arch-light/70 text-sm leading-relaxed line-clamp-2">{ad.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-arch-light dark:border-arch-brown/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-arch-dark/50 dark:text-arch-light/50 text-xs font-medium">
                        <MapPin size={14} />
                        <span>{ad.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleLikeAd(ad.id); }}
                        className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-rose-500' : 'text-arch-dark/40 dark:text-arch-light/40 hover:text-rose-500 dark:hover:text-rose-400'}`}
                      >
                        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                        <span className="text-xs font-bold">{ad.likes}</span>
                      </button>
                      <div className="flex items-center gap-1.5 text-arch-dark/40 dark:text-arch-light/40">
                        <MessageSquare size={18} />
                        <span className="text-xs font-bold">{ad.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

