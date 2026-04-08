import { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, ArrowLeft, Send, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Chat, User } from '../data';
import { useAppContext } from '../AppContext';
import { UserProfile } from './UserProfile';
import { Tab } from '../App';

interface ChatListProps {
  onNavigate?: (tab: Tab) => void;
}

export function ChatList({ onNavigate }: ChatListProps) {
  const { chats, users, currentUser, sendMessage, markChatAsRead, activeChatId, setActiveChatId, deleteChat } = useAppContext();
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId);

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    markChatAsRead(chatId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isTyping]);

  const handleSendMessage = async () => {
    if (activeChatId && messageText.trim()) {
      const text = messageText;
      setMessageText('');
      setIsTyping(true);
      try {
        await sendMessage(activeChatId, text);
      } finally {
        setIsTyping(false);
      }
    }
  };

  if (selectedUser) {
    return (
      <UserProfile 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
        onAdClick={() => {}} // We don't handle ad clicks from here
        onNavigate={onNavigate || (() => {})}
      />
    );
  }

  if (activeChat) {
    const otherUserId = activeChat.participants.find(id => id !== currentUser.id);
    const otherUser = users.find(u => u.id === otherUserId);

    const handleDeleteChat = () => {
      if (window.confirm('¿Estás seguro de que quieres eliminar este chat?')) {
        deleteChat(activeChat.id);
      }
      setShowMenu(false);
    };

    return (
      <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
        {/* Chat Header */}
        <div className="bg-white dark:bg-arch-navy px-4 py-3 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-arch-border dark:border-arch-brown transition-colors">
          <button onClick={() => setActiveChatId(null)} className="p-2 -ml-2 text-arch-dark/80 dark:text-arch-light/60 hover:bg-arch-border/50 dark:hover:bg-arch-brown/30 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div 
            className="relative shrink-0 cursor-pointer"
            onClick={() => {
              if (otherUser) {
                setSelectedUser(otherUser as User);
              }
            }}
          >
            <img src={otherUser?.avatar} alt={otherUser?.name} className="w-10 h-10 rounded-full object-cover border border-arch-border dark:border-arch-brown/50" />
            {otherUser?.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-arch-navy rounded-full"></div>
            )}
          </div>
          <div 
            className="flex-1 min-w-0 cursor-pointer hover:opacity-80"
            onClick={() => {
              if (otherUser) {
                setSelectedUser(otherUser as User);
              }
            }}
          >
            <h2 className="font-bold text-arch-dark dark:text-arch-light truncate font-cinzel">{otherUser?.name}</h2>
            <p className="text-[10px] text-arch-navy dark:text-arch-gold font-medium">{otherUser?.isOnline ? 'En línea' : 'Desconectado'}</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-arch-dark/40 dark:text-arch-light/40 hover:bg-arch-border/50 dark:hover:bg-arch-brown/30 rounded-full transition-colors"
            >
              <MoreVertical size={20} />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-arch-brown rounded-xl shadow-lg border border-arch-border dark:border-arch-brown/50 z-20 overflow-hidden">
                  <button 
                    onClick={handleDeleteChat}
                    className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 size={16} />
                    Eliminar chat
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeChat.messages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-arch-navy dark:bg-arch-gold text-white dark:text-arch-navy rounded-tr-sm' : 'bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown text-arch-dark dark:text-arch-light rounded-tl-sm shadow-sm'}`}>
                  <div className={`prose prose-sm max-w-none prose-p:leading-snug prose-p:my-1 ${isMe ? 'text-white dark:text-arch-navy prose-p:text-white dark:prose-p:text-arch-navy prose-strong:text-white dark:prose-strong:text-arch-navy prose-li:text-white dark:prose-li:text-arch-navy prose-headings:text-white dark:prose-headings:text-arch-navy prose-a:text-white dark:prose-a:text-arch-navy' : 'dark:prose-invert'}`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-white/70 dark:text-arch-navy/70' : 'text-arch-dark/40 dark:text-arch-light/40'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-arch-navy p-4 border-t border-arch-border dark:border-arch-brown sticky bottom-0 transition-colors">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Escribe un mensaje..." 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-arch-light dark:bg-arch-brown/20 text-arch-dark dark:text-arch-light placeholder-arch-dark/40 dark:placeholder-arch-light/40 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40 transition-all text-sm border border-transparent dark:border-arch-brown/50"
            />
            <button 
              onClick={handleSendMessage}
              className={`p-3 rounded-full transition-colors ${messageText.trim() ? 'bg-arch-navy dark:bg-arch-gold text-white dark:text-arch-navy hover:bg-arch-navy/80 dark:hover:bg-yellow-500' : 'bg-arch-light dark:bg-arch-brown/20 text-arch-dark/40 dark:text-arch-light/40'}`}
              disabled={!messageText.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
      <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown sticky top-0 z-10 transition-colors">
        <h1 className="text-2xl font-cinzel font-bold text-arch-navy dark:text-arch-light mb-4">Mensajes</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-arch-dark/40 dark:text-arch-light/40" size={20} />
          <input 
            type="text" 
            placeholder="Buscar conversación..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-arch-light dark:bg-arch-brown/20 text-arch-dark dark:text-arch-light placeholder-arch-dark/40 dark:placeholder-arch-light/40 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40 transition-all font-medium placeholder:font-normal border border-transparent dark:border-arch-brown/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chats.filter(chat => {
          const otherUserId = chat.participants.find(id => id !== currentUser.id);
          const otherUser = users.find(u => u.id === otherUserId);
          return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
        }).sort((a, b) => {
          const aLastMessage = a.messages[a.messages.length - 1];
          const bLastMessage = b.messages[b.messages.length - 1];
          if (!aLastMessage) return 1;
          if (!bLastMessage) return -1;
          return new Date(bLastMessage.createdAt).getTime() - new Date(aLastMessage.createdAt).getTime();
        }).map(chat => {
          const otherUserId = chat.participants.find(id => id !== currentUser.id);
          const otherUser = users.find(u => u.id === otherUserId);
          const lastMessage = chat.messages[chat.messages.length - 1];
          const isUnread = chat.unreadCount > 0 && chat.participants.includes(currentUser.id);

          return (
            <button 
              key={chat.id} 
              onClick={() => handleSelectChat(chat.id)}
              className="w-full bg-white dark:bg-arch-brown/20 p-4 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown flex items-center gap-4 hover:border-arch-navy dark:hover:border-arch-gold transition-colors text-left"
            >
              <div className="relative shrink-0">
                <img src={otherUser?.avatar} alt={otherUser?.name} className="w-14 h-14 rounded-full object-cover border border-arch-border dark:border-arch-brown/50" />
                {otherUser?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-arch-brown rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-bold truncate font-cinzel ${isUnread ? 'text-arch-navy dark:text-arch-gold text-lg' : 'text-arch-dark dark:text-arch-light'}`}>{otherUser?.name}</h3>
                  <span className={`text-[10px] whitespace-nowrap ml-2 ${isUnread ? 'text-arch-navy dark:text-arch-gold font-bold' : 'text-arch-dark/40 dark:text-arch-light/40'}`}>
                    {lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className={`text-sm truncate ${isUnread ? 'text-arch-dark dark:text-arch-light font-medium' : 'text-arch-dark/60 dark:text-arch-light/60'}`}>
                    {lastMessage ? (lastMessage.senderId === currentUser.id ? 'Tú: ' : '') + lastMessage.text : 'Sin mensajes'}
                  </p>
                  {isUnread && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
