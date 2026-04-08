import React, { useState } from 'react';
import { Search as SearchIcon, Heart, MessageSquare, MapPin, Star, Download, PlayCircle, FileText, User, Image as ImageIcon, Video, Newspaper } from 'lucide-react';
import { Tab } from '../App';
import { useAppContext } from '../AppContext';
import { Ad, User as UserType } from '../data';
import { AdDetail } from './AdDetail';
import { UserProfile } from './UserProfile';

type SearchCategory = 'ads' | 'profiles' | 'images' | 'videos' | 'files' | 'news';

interface SearchProps {
  onNavigate: (tab: Tab) => void;
}

export function Search({ onNavigate }: SearchProps) {
  const { ads, users, images, videos, files, news, currentUser, toggleLikeAd } = useAppContext();
  
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('ads');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Detail Views
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [expandedNews, setExpandedNews] = useState<string[]>([]);

  const toggleNews = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNews(prev => 
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };
  
  const categories = [
    { id: 'ads', label: 'Anuncios', icon: FileText },
    { id: 'profiles', label: 'Perfiles', icon: User },
    { id: 'images', label: 'Imágenes', icon: ImageIcon },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'files', label: 'Archivos', icon: Download },
    { id: 'news', label: 'Noticias', icon: Newspaper },
  ] as const;

  // Render Ad Detail View
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

  // Render User Profile View
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

  // Main Search View
  return (
    <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
      {/* Header & Search Bar */}
      <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown sticky top-0 z-10 transition-colors">
        <h1 className="text-2xl font-cinzel font-bold text-arch-navy dark:text-arch-light mb-4">Buscador</h1>
        <div className="relative flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-arch-dark/40 dark:text-arch-light/40" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por palabra clave, ubicación..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-arch-light dark:bg-arch-brown/20 text-arch-dark dark:text-arch-light rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/20 transition-all font-medium placeholder:font-normal border border-transparent dark:border-arch-brown/50"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white dark:bg-arch-navy border-b border-arch-border dark:border-arch-brown overflow-x-auto scrollbar-hide transition-colors">
        <div className="flex px-6 py-3 gap-6 min-w-max">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 transition-colors ${isActive ? 'border-arch-navy dark:border-arch-gold text-arch-navy dark:text-arch-gold' : 'border-transparent text-arch-dark/40 hover:text-arch-dark/60 dark:text-arch-light/40 dark:hover:text-arch-light/60'}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-bold uppercase tracking-wider">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeCategory === 'ads' && (
          <div className="space-y-4">
            {ads.filter(ad => {
              return ad.title.toLowerCase().includes(searchQuery.toLowerCase()) || ad.description.toLowerCase().includes(searchQuery.toLowerCase());
            }).map(ad => {
              const author = users.find(u => u.id === ad.authorId);
              return (
                <div key={ad.id} onClick={() => setSelectedAd(ad)} className="bg-white dark:bg-arch-brown/20 p-5 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown cursor-pointer hover:border-arch-navy dark:hover:border-arch-gold transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-arch-dark dark:text-arch-light leading-tight font-cormorant text-2xl">{ad.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-arch-dark/60 dark:text-arch-light/60 text-xs mb-3 font-medium">
                    <MapPin size={14} />
                    <span>{ad.location}</span>
                  </div>
                  <p className="text-sm text-arch-dark/80 dark:text-arch-light/80 line-clamp-3 mb-4">{ad.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-arch-light dark:bg-arch-brown/40 text-arch-dark/80 dark:text-arch-light/80 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">{ad.timePeriod}</span>
                    <span className="bg-arch-light dark:bg-arch-brown/40 text-arch-dark/80 dark:text-arch-light/80 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">{ad.artifactType}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-arch-light dark:border-arch-brown/50">
                    <div className="flex items-center gap-3" onClick={(e) => { e.stopPropagation(); setSelectedUser(author || null); }}>
                      <img src={author?.avatar} alt={author?.name} className="w-8 h-8 shrink-0 rounded-full object-cover border border-arch-border dark:border-arch-brown/50" />
                      <div>
                        <p className="text-xs font-bold text-arch-dark dark:text-arch-light hover:underline">{author?.name}</p>
                        <p className="text-[10px] text-arch-dark/60 dark:text-arch-light/60">{author?.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-arch-dark/40 dark:text-arch-light/40">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleLikeAd(ad.id); }}
                        className={`flex items-center gap-1.5 transition-colors ${ad.likedBy.includes(currentUser.id) ? 'text-rose-500' : 'hover:text-rose-500 dark:hover:text-rose-400'}`}
                      >
                        <Heart size={18} fill={ad.likedBy.includes(currentUser.id) ? "currentColor" : "none"} />
                        <span className="text-xs font-medium">{ad.likes}</span>
                      </button>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare size={18} />
                        <span className="text-xs font-medium">{ad.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeCategory === 'profiles' && (
          <div className="grid grid-cols-1 gap-4">
            {users.filter(u => {
              return u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.specialty.toLowerCase().includes(searchQuery.toLowerCase());
            }).map(user => (
              <div key={user.id} onClick={() => setSelectedUser(user)} className="bg-white dark:bg-arch-brown/20 p-5 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown flex items-center gap-4 cursor-pointer hover:border-arch-navy dark:hover:border-arch-gold transition-colors">
                <div className="relative shrink-0">
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-arch-brown shadow-sm" />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-arch-brown rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-arch-dark dark:text-arch-light text-lg truncate font-cinzel">{user.name}</h3>
                  <p className="text-sm text-arch-navy dark:text-arch-gold font-medium truncate">{user.specialty}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-arch-dark/60 dark:text-arch-light/60">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {user.location}</span>
                    <span className="flex items-center gap-1 text-arch-gold"><Star size={12} fill="currentColor" /> {user.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeCategory === 'images' && (
          <div className="grid grid-cols-2 gap-4">
            {images.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase())).map(img => (
              <div key={img.id} className="bg-white dark:bg-arch-brown/20 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown overflow-hidden cursor-pointer group transition-colors">
                <div className="relative aspect-square">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-white text-xs font-bold truncate">{img.title}</p>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-arch-dark/60 dark:text-arch-light/60 text-xs">
                    <Heart size={14} /> {img.likes}
                  </div>
                  <span className="text-[10px] text-arch-dark/40 dark:text-arch-light/40 truncate max-w-[80px]">{img.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeCategory === 'videos' && (
          <div className="space-y-4">
            {videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())).map(video => (
              <div key={video.id} className="bg-white dark:bg-arch-brown/20 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown overflow-hidden cursor-pointer group transition-colors">
                <div className="relative aspect-video">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <PlayCircle size={48} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    {video.duration}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-arch-dark dark:text-arch-light line-clamp-2 mb-1 font-cormorant text-lg leading-tight">{video.title}</h3>
                  <p className="text-xs text-arch-dark/60 dark:text-arch-light/60">{video.views.toLocaleString()} vistas</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeCategory === 'files' && (
          <div className="space-y-3">
            {files.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase())).map(file => (
              <div key={file.id} className="bg-white dark:bg-arch-brown/20 p-4 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown flex items-center gap-4 cursor-pointer hover:border-arch-navy dark:hover:border-arch-gold transition-colors">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/30 p-3 rounded-xl text-arch-navy dark:text-arch-light">
                  <FileText size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-arch-dark dark:text-arch-light truncate">{file.title}</h3>
                  <p className="text-xs text-arch-dark/60 dark:text-arch-light/60 mt-0.5">{file.type} • {file.size}</p>
                </div>
                <button className="p-2 text-arch-dark/40 dark:text-arch-light/40 hover:text-arch-navy dark:hover:text-arch-gold transition-colors">
                  <Download size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeCategory === 'news' && (
          <div className="space-y-4">
            {news.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())).map(newsItem => {
              const isExpanded = expandedNews.includes(newsItem.id);
              return (
                <div key={newsItem.id} className="bg-white dark:bg-arch-brown/20 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown overflow-hidden cursor-pointer hover:border-arch-navy dark:hover:border-arch-gold transition-colors">
                  <img src={newsItem.image} alt={newsItem.title} className="w-full h-48 object-cover" />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-arch-light dark:bg-arch-brown/40 text-arch-dark/80 dark:text-arch-light/80 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{newsItem.source}</span>
                      <span className="text-[10px] text-arch-dark/40 dark:text-arch-light/40">{newsItem.date}</span>
                    </div>
                    <h3 className="font-bold text-arch-dark dark:text-arch-light text-xl leading-tight mb-2 font-cormorant">{newsItem.title}</h3>
                    <p className={`text-sm text-arch-dark/80 dark:text-arch-light/80 ${isExpanded ? '' : 'line-clamp-2'}`}>{newsItem.summary}</p>
                    <button 
                      onClick={(e) => toggleNews(newsItem.id, e)}
                      className="mt-4 text-arch-navy dark:text-arch-gold text-sm font-bold hover:underline"
                    >
                      {isExpanded ? 'Leer menos' : 'Leer más'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

