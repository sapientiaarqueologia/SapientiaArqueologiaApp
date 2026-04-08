import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GoogleGenAI } from '@google/genai';
import { User, Ad, ImageItem, VideoItem, FileItem, NewsItem, Chat, Message, Review, Note, MOCK_USERS, MOCK_ADS, MOCK_IMAGES, MOCK_VIDEOS, MOCK_FILES, MOCK_NEWS, MOCK_CHATS, MOCK_NOTES, CURRENT_USER } from './data';

interface AppContextType {
  users: User[];
  ads: Ad[];
  images: ImageItem[];
  videos: VideoItem[];
  files: FileItem[];
  news: NewsItem[];
  chats: Chat[];
  notes: Note[];
  currentUser: User;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  addAd: (ad: Omit<Ad, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'comments' | 'authorId'>) => void;
  addImage: (image: Omit<ImageItem, 'id' | 'authorId' | 'likes'>) => void;
  addVideo: (video: Omit<VideoItem, 'id' | 'authorId' | 'views'>) => void;
  addFile: (file: Omit<FileItem, 'id' | 'authorId'>) => void;
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  addNote: (note: Omit<Note, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Omit<Note, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>>) => void;
  deleteNote: (id: string) => void;
  deleteChat: (chatId: string) => void;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  createChat: (participantId: string, initialMessage?: string) => string;
  toggleLikeAd: (adId: string) => void;
  addCommentToAd: (adId: string, text: string) => void;
  addReview: (userId: string, rating: number, comment: string) => void;
  markChatAsRead: (chatId: string) => void;
  updateCurrentUser: (data: Partial<User>) => void;
  analyzeImage: (base64Data: string, mimeType: string) => Promise<string>;
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [ads, setAds] = useState<Ad[]>(MOCK_ADS);
  const [images, setImages] = useState<ImageItem[]>(MOCK_IMAGES);
  const [videos, setVideos] = useState<VideoItem[]>(MOCK_VIDEOS);
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('Español');

  // Apply dark mode to document body
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const addAd = (adData: Omit<Ad, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'comments' | 'authorId'>) => {
    const newAd: Ad = {
      ...adData,
      id: `a${Date.now()}`,
      authorId: CURRENT_USER.id,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: []
    };
    setAds([newAd, ...ads]);
  };

  const addImage = (imageData: Omit<ImageItem, 'id' | 'authorId' | 'likes'>) => {
    const newImage: ImageItem = {
      ...imageData,
      id: `i${Date.now()}`,
      authorId: CURRENT_USER.id,
      likes: 0
    };
    setImages([newImage, ...images]);
  };

  const addVideo = (videoData: Omit<VideoItem, 'id' | 'authorId' | 'views'>) => {
    const newVideo: VideoItem = {
      ...videoData,
      id: `v${Date.now()}`,
      authorId: CURRENT_USER.id,
      views: 0
    };
    setVideos([newVideo, ...videos]);
  };

  const addFile = (fileData: Omit<FileItem, 'id' | 'authorId'>) => {
    const newFile: FileItem = {
      ...fileData,
      id: `f${Date.now()}`,
      authorId: CURRENT_USER.id
    };
    setFiles([newFile, ...files]);
  };

  const addNews = (newsData: Omit<NewsItem, 'id'>) => {
    const newNews: NewsItem = {
      ...newsData,
      id: `n${Date.now()}`
    };
    setNews([newNews, ...news]);
  };

  const addNote = (noteData: Omit<Note, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: `note_${Date.now()}`,
      authorId: CURRENT_USER.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id: string, noteData: Partial<Omit<Note, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>>) => {
    setNotes(prevNotes => prevNotes.map(note => {
      if (note.id === id) {
        return {
          ...note,
          ...noteData,
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    }));
  };

  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const deleteChat = (chatId: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const sendMessage = async (chatId: string, text: string) => {
    // Optimistically add user message
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: CURRENT_USER.id,
      text,
      createdAt: new Date().toISOString()
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));
  };

  const createChat = (participantId: string, initialMessage?: string) => {
    // Check if chat already exists
    const existingChat = chats.find(c => c.participants.includes(CURRENT_USER.id) && c.participants.includes(participantId));
    if (existingChat) {
      if (initialMessage) {
        sendMessage(existingChat.id, initialMessage);
      }
      return existingChat.id;
    }

    const newChat: Chat = {
      id: `ch${Date.now()}`,
      participants: [CURRENT_USER.id, participantId],
      unreadCount: 0,
      messages: initialMessage ? [{
        id: `m${Date.now()}`,
        senderId: CURRENT_USER.id,
        text: initialMessage,
        createdAt: new Date().toISOString()
      }] : []
    };
    setChats([newChat, ...chats]);
    return newChat.id;
  };

  const toggleLikeAd = (adId: string) => {
    setAds(prevAds => prevAds.map(ad => {
      if (ad.id === adId) {
        const hasLiked = ad.likedBy.includes(CURRENT_USER.id);
        if (hasLiked) {
          return {
            ...ad,
            likes: ad.likes - 1,
            likedBy: ad.likedBy.filter(id => id !== CURRENT_USER.id)
          };
        } else {
          return {
            ...ad,
            likes: ad.likes + 1,
            likedBy: [...ad.likedBy, CURRENT_USER.id]
          };
        }
      }
      return ad;
    }));
  };

  const addCommentToAd = (adId: string, text: string) => {
    setAds(prevAds => prevAds.map(ad => {
      if (ad.id === adId) {
        return {
          ...ad,
          comments: [...ad.comments, {
            id: `c${Date.now()}`,
            authorId: CURRENT_USER.id,
            text,
            createdAt: new Date().toISOString()
          }]
        };
      }
      return ad;
    }));
  };

  const addReview = (userId: string, rating: number, comment: string) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        const newReview: Review = {
          id: `r${Date.now()}`,
          authorId: CURRENT_USER.id,
          rating,
          comment,
          createdAt: new Date().toISOString()
        };
        const newReviews = [...user.reviews, newReview];
        const newRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
        return {
          ...user,
          reviews: newReviews,
          rating: Number(newRating.toFixed(1))
        };
      }
      return user;
    }));
  };

  const markChatAsRead = (chatId: string) => {
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          unreadCount: 0
        };
      }
      return chat;
    }));
  };

  const updateCurrentUser = (data: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
    // Also update the user in the users array
    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? { ...u, ...data } : u));
  };

  const analyzeImage = async (base64Data: string, mimeType: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            },
            {
              text: "Actúa como un experto arqueólogo. Analiza esta imagen de un posible artefacto o sitio arqueológico. Proporciona una descripción detallada, identifica de qué podría tratarse, sugiere un periodo histórico probable y explica su importancia cultural. Responde en español con un tono profesional y educativo. Usa formato Markdown."
            }
          ]
        }
      });
      return response.text || "No se pudo generar un análisis para esta imagen.";
    } catch (error) {
      console.error('Error analyzing image with Gemini:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      users, ads, images, videos, files, news, chats, notes, currentUser,
      activeChatId, setActiveChatId,
      addAd, addImage, addVideo, addFile, addNews, addNote, updateNote, deleteNote, deleteChat, sendMessage, createChat, toggleLikeAd, addCommentToAd, addReview, markChatAsRead, updateCurrentUser,
      analyzeImage,
      darkMode, toggleDarkMode, language, setLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
