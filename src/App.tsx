import { useState } from 'react';
import { Home as HomeIcon, Search as SearchIcon, Plus, MessageCircle, Settings as SettingsIcon } from 'lucide-react';
import { Home } from './components/Home';
import { Search } from './components/Search';
import { ChatList } from './components/ChatList';
import { Settings } from './components/Settings';
import { CreateMenu } from './components/CreateMenu';
import { useAppContext } from './AppContext';

export type Tab = 'home' | 'search' | 'chat' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const { chats, currentUser } = useAppContext();

  // Calculate total unread messages
  const totalUnread = chats.reduce((acc, chat) => {
    if (chat.participants.includes(currentUser.id)) {
      return acc + chat.unreadCount;
    }
    return acc;
  }, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onNavigate={setActiveTab} />;
      case 'search': return <Search onNavigate={setActiveTab} />;
      case 'chat': return <ChatList onNavigate={setActiveTab} />;
      case 'settings': return <Settings onNavigate={setActiveTab} />;
      default: return <Home onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-arch-light dark:bg-arch-navy text-arch-dark dark:text-arch-light font-sans overflow-hidden transition-colors">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>

      {/* Create Menu Overlay */}
      {isCreateMenuOpen && (
        <CreateMenu onClose={() => setIsCreateMenuOpen(false)} onNavigate={setActiveTab} />
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-arch-navy border-t border-arch-brown px-6 py-3 flex justify-between items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-colors">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-arch-gold' : 'text-arch-light/60 hover:text-arch-light'}`}
        >
          <HomeIcon size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Inicio</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'search' ? 'text-arch-gold' : 'text-arch-light/60 hover:text-arch-light'}`}
        >
          <SearchIcon size={24} strokeWidth={activeTab === 'search' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Buscar</span>
        </button>

        {/* Floating Action Button */}
        <div className="relative -top-6">
          <button 
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className="bg-arch-gold text-arch-navy p-4 rounded-full shadow-lg hover:bg-yellow-500 transition-transform active:scale-95 flex items-center justify-center"
          >
            <Plus size={28} strokeWidth={2.5} className={`transition-transform duration-300 ${isCreateMenuOpen ? 'rotate-45' : ''}`} />
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('chat')}
          className={`relative flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-arch-gold' : 'text-arch-light/60 hover:text-arch-light'}`}
        >
          <div className="relative">
            <MessageCircle size={24} strokeWidth={activeTab === 'chat' ? 2.5 : 2} />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-arch-navy">
                {totalUnread}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Chat</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-arch-gold' : 'text-arch-light/60 hover:text-arch-light'}`}
        >
          <SettingsIcon size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}
