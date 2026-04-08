import React, { useState } from 'react';
import { User, FileText, Bookmark, Bell, Moon, Globe, HelpCircle, FileWarning, Shield, LogOut, ChevronRight, ArrowLeft, MapPin, Heart, MessageSquare, ExternalLink, Mail, MessageCircle, StickyNote, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Tab } from '../App';
import { AdDetail } from './AdDetail';
import { Ad, Note } from '../data';

interface SettingsProps {
  onNavigate: (tab: Tab) => void;
}

type SettingsView = 'main' | 'personal_data' | 'my_ads' | 'saved' | 'notes' | 'help' | 'terms' | 'privacy' | 'language' | 'integrations';

export function Settings({ onNavigate }: SettingsProps) {
  const { currentUser, updateCurrentUser, ads, toggleLikeAd, darkMode, toggleDarkMode, language, setLanguage, notes, addNote, updateNote, deleteNote } = useAppContext();
  const [activeView, setActiveView] = useState<SettingsView>('main');
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });

  // Form state for personal data
  const [formData, setFormData] = useState({
    name: currentUser.name,
    specialty: currentUser.specialty,
    location: currentUser.location,
    password: '',
    avatar: currentUser.avatar
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, avatar: imageUrl });
    }
  };

  const handleAction = (action: string) => {
    alert(`Funcionalidad en desarrollo: ${action}`);
  };

  const handleSavePersonalData = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: formData.name,
      specialty: formData.specialty,
      location: formData.location,
      avatar: formData.avatar
    });
    alert('Datos actualizados correctamente');
    setActiveView('main');
  };

  if (selectedAd) {
    return (
      <AdDetail 
        ad={selectedAd} 
        onClose={() => setSelectedAd(null)} 
        onNavigate={onNavigate} 
        onUserClick={() => {}} // We don't navigate to user profile from here for simplicity
      />
    );
  }

  if (activeView === 'notes') {
    const myNotes = notes.filter(n => n.authorId === currentUser.id);

    const handleSaveNote = () => {
      if (!noteForm.title.trim() && !noteForm.content.trim()) return;
      
      if (selectedNote) {
        updateNote(selectedNote.id, noteForm);
      } else {
        addNote(noteForm);
      }
      setIsEditingNote(false);
      setSelectedNote(null);
      setNoteForm({ title: '', content: '' });
    };

    const handleDeleteNote = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      deleteNote(id);
      if (selectedNote?.id === id) {
        setIsEditingNote(false);
        setSelectedNote(null);
        setNoteForm({ title: '', content: '' });
      }
    };

    if (isEditingNote) {
      return (
        <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
          <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown flex items-center justify-between sticky top-0 z-10 transition-colors">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setIsEditingNote(false);
                  setSelectedNote(null);
                  setNoteForm({ title: '', content: '' });
                }} 
                className="p-2 -ml-2 text-arch-dark/60 hover:text-arch-dark dark:text-arch-light/60 dark:hover:text-arch-light transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-cinzel font-bold text-arch-dark dark:text-arch-light">
                {selectedNote ? 'Editar Nota' : 'Nueva Nota'}
              </h1>
            </div>
            <button 
              onClick={handleSaveNote}
              className="text-arch-navy dark:text-arch-gold font-bold text-sm hover:underline"
            >
              Guardar
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Título"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              className="w-full bg-transparent text-xl font-bold text-arch-dark dark:text-arch-light placeholder:text-arch-dark/40 dark:placeholder:text-arch-light/40 focus:outline-none"
            />
            <textarea
              placeholder="Escribe tu nota aquí..."
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              className="w-full flex-1 bg-transparent text-base text-arch-dark/80 dark:text-arch-light/80 placeholder:text-arch-dark/40 dark:placeholder:text-arch-light/40 focus:outline-none resize-none"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
        <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown flex items-center justify-between sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveView('main')} className="p-2 -ml-2 text-arch-dark/60 hover:text-arch-dark dark:text-arch-light/60 dark:hover:text-arch-light transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-cinzel font-bold text-arch-dark dark:text-arch-light">Mis Notas</h1>
          </div>
          <button 
            onClick={() => {
              setNoteForm({ title: '', content: '' });
              setSelectedNote(null);
              setIsEditingNote(true);
            }}
            className="p-2 -mr-2 text-arch-navy dark:text-arch-gold hover:bg-arch-navy/5 dark:hover:bg-arch-gold/10 rounded-full transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {myNotes.length === 0 ? (
            <div className="text-center py-12 text-arch-dark/60 dark:text-arch-light/60">
              <StickyNote size={48} className="mx-auto mb-4 opacity-20" />
              <p>No tienes notas guardadas.</p>
            </div>
          ) : (
            myNotes.map(note => (
              <div 
                key={note.id} 
                onClick={() => {
                  setSelectedNote(note);
                  setNoteForm({ title: note.title, content: note.content });
                  setIsEditingNote(true);
                }} 
                className="bg-white dark:bg-arch-brown/20 p-4 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown cursor-pointer hover:border-arch-navy dark:hover:border-arch-gold transition-colors group relative"
              >
                <h3 className="font-bold text-arch-dark dark:text-arch-light leading-tight mb-2 font-cinzel pr-8">{note.title || 'Sin título'}</h3>
                <p className="text-sm text-arch-dark/80 dark:text-arch-light/80 line-clamp-3 mb-3">{note.content}</p>
                <div className="flex items-center justify-between pt-3 border-t border-arch-border dark:border-arch-brown">
                  <span className="text-[10px] text-arch-dark/40 dark:text-arch-light/40 font-medium">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  className="absolute top-4 right-4 p-1.5 text-arch-dark/40 dark:text-arch-light/40 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'integrations') {
    const isAiAvailable = !!process.env.GEMINI_API_KEY;
    
    return (
      <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
        <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown flex items-center gap-4 sticky top-0 z-10 transition-colors">
          <button onClick={() => setActiveView('main')} className="p-2 -ml-2 text-arch-dark/60 hover:text-arch-dark dark:text-arch-light/60 dark:hover:text-arch-light transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-cinzel font-bold text-arch-dark dark:text-arch-light">Integraciones</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-white dark:bg-arch-brown/20 p-6 rounded-3xl shadow-sm border border-arch-border dark:border-arch-brown transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-3 rounded-2xl text-arch-navy dark:text-arch-gold">
                <Globe size={32} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-arch-dark dark:text-arch-light font-cinzel">Gemini AI</h2>
                <p className="text-xs text-arch-dark/60 dark:text-arch-light/60">Asistente inteligente Sapientia</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-arch-light dark:bg-arch-navy/40 rounded-2xl border border-arch-border dark:border-arch-brown">
                <span className="text-sm font-medium text-arch-dark dark:text-arch-light">Estado de conexión</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isAiAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  <span className={`text-xs font-bold ${isAiAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isAiAvailable ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
              </div>
              
              {!isAiAvailable && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-200 dark:border-rose-900/50">
                  <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                    La API de Gemini no está configurada. Para habilitar la IA, asegúrate de haber configurado el secreto <code className="font-mono bg-rose-100 dark:bg-rose-900/40 px-1 rounded">GEMINI_API_KEY</code> en el panel de Secretos de AI Studio.
                  </p>
                </div>
              )}
              
              <div className="p-4 bg-arch-navy/5 dark:bg-arch-brown/10 rounded-2xl border border-arch-border dark:border-arch-brown">
                <h3 className="text-xs font-bold text-arch-dark dark:text-arch-light uppercase mb-2">Capacidades habilitadas</h3>
                <ul className="space-y-2">
                  {[
                    'Asistencia en chat arqueológico',
                    'Interpretación de hallazgos',
                    'Sugerencias de redacción',
                    'Búsqueda inteligente'
                  ].map((cap, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-arch-dark/70 dark:text-arch-light/70">
                      <CheckCircle size={14} className="text-emerald-500" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'help') {
    return (
      <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
        <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown flex items-center gap-4 sticky top-0 z-10 transition-colors">
          <button onClick={() => setActiveView('main')} className="p-2 -ml-2 text-arch-dark/60 hover:text-arch-dark dark:text-arch-light/60 dark:hover:text-arch-light transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-cinzel font-bold text-arch-dark dark:text-arch-light">Ayuda y Soporte</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-arch-navy/5 dark:bg-arch-brown/20 p-6 rounded-3xl border border-arch-border dark:border-arch-brown text-center transition-colors">
            <HelpCircle size={48} className="mx-auto text-arch-navy dark:text-arch-gold mb-4" />
            <h2 className="text-lg font-bold text-arch-dark dark:text-arch-light mb-2 font-cinzel">¿Cómo podemos ayudarte?</h2>
            <p className="text-sm text-arch-dark/80 dark:text-arch-light/80 mb-6">Encuentra respuestas a tus preguntas o contacta con nuestro equipo de soporte.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white dark:bg-arch-brown/20 p-4 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown flex flex-col items-center gap-2 hover:bg-arch-navy/5 dark:hover:bg-arch-brown/40 transition-colors">
                <MessageCircle size={24} className="text-arch-navy dark:text-arch-gold" />
                <span className="text-xs font-bold text-arch-dark dark:text-arch-light">Chat en vivo</span>
              </button>
              <button className="bg-white dark:bg-arch-brown/20 p-4 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown flex flex-col items-center gap-2 hover:bg-arch-navy/5 dark:hover:bg-arch-brown/40 transition-colors">
                <Mail size={24} className="text-arch-navy dark:text-arch-gold" />
                <span className="text-xs font-bold text-arch-dark dark:text-arch-light">Enviar email</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-arch-dark dark:text-arch-light px-2 font-cinzel">Preguntas Frecuentes</h3>
            
            {[
              { q: '¿Cómo publico un nuevo proyecto?', a: 'Ve a la pantalla principal y pulsa el botón flotante con el símbolo "+" en la parte inferior de la pantalla.' },
              { q: '¿Cómo contacto con otro usuario?', a: 'Puedes dejar un comentario en su anuncio o ir a su perfil y pulsar "Enviar mensaje" para iniciar un chat privado.' },
              { q: '¿Es Sapientia gratuito?', a: 'Sí, Sapientia es una plataforma completamente gratuita para conectar a estudiantes y profesionales.' },
              { q: '¿Cómo elimino mi cuenta?', a: 'Por favor, contacta con soporte a través de email para procesar la eliminación de tu cuenta y datos asociados.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white dark:bg-arch-brown/20 p-4 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown transition-colors">
                <h4 className="font-bold text-arch-dark dark:text-arch-light text-sm mb-2 font-cinzel">{faq.q}</h4>
                <p className="text-sm text-arch-dark/80 dark:text-arch-light/80 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'terms') {
    return (
      <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
        <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown flex items-center gap-4 sticky top-0 z-10 transition-colors">
          <button onClick={() => setActiveView('main')} className="p-2 -ml-2 text-arch-dark/60 hover:text-arch-dark dark:text-arch-light/60 dark:hover:text-arch-light transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-cinzel font-bold text-arch-dark dark:text-arch-light">Términos y Condiciones</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white dark:bg-arch-brown/20 p-6 rounded-3xl shadow-sm border border-arch-border dark:border-arch-brown prose prose-sm prose-stone dark:prose-invert max-w-none transition-colors">
            <p className="text-xs text-arch-dark/60 dark:text-arch-light/60 mb-6">Última actualización: 4 de Marzo de 2026</p>
            
            <h3 className="text-base font-bold text-arch-dark dark:text-arch-light mb-2 font-cinzel">1. Aceptación de los términos</h3>
            <p className="text-arch-dark/80 dark:text-arch-light/80 mb-4 leading-relaxed">Al acceder y utilizar Sapientia, aceptas estar sujeto a estos Términos y Condiciones de uso, todas las leyes y regulaciones aplicables, y aceptas que eres responsable del cumplimiento de las leyes locales aplicables.</p>

            <h3 className="text-base font-bold text-arch-dark dark:text-arch-light mb-2 font-cinzel">2. Uso de la Licencia</h3>
            <p className="text-arch-dark/80 dark:text-arch-light/80 mb-4 leading-relaxed">Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en Sapientia para visualización transitoria personal y no comercial solamente.</p>

            <h3 className="text-base font-bold text-arch-dark dark:text-arch-light mb-2 font-cinzel">3. Conducta del Usuario</h3>
            <p className="text-arch-dark/80 dark:text-arch-light/80 mb-4 leading-relaxed">Como usuario de Sapientia, te comprometes a no utilizar la plataforma para publicar contenido ofensivo, discriminatorio, falso o que infrinja los derechos de propiedad intelectual de terceros. Nos reservamos el derecho de suspender cuentas que violen estas normas.</p>

            <h3 className="text-base font-bold text-arch-dark dark:text-arch-light mb-2 font-cinzel">4. Propiedad del Contenido</h3>
            <p className="text-arch-dark/80 dark:text-arch-light/80 mb-4 leading-relaxed">Mantienes todos los derechos sobre el contenido que publicas en Sapientia. Sin embargo, al publicar contenido, nos otorgas una licencia mundial, no exclusiva y libre de regalías para usar, reproducir y mostrar dicho contenido en conexión con los servicios de la plataforma.</p>

            <h3 className="text-base font-bold text-arch-dark dark:text-arch-light mb-2 font-cinzel">5. Limitaciones</h3>
            <p className="text-arch-dark/80 dark:text-arch-light/80 mb-4 leading-relaxed">En ningún caso Sapientia o sus proveedores serán responsables de ningún daño (incluyendo, sin limitación, daños por pérdida de datos o beneficios, o debido a la interrupción del negocio) que surjan del uso o la incapacidad de usar los materiales en Sapientia.</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'privacy') {
    return (
      <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
        <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown flex items-center gap-4 sticky top-0 z-10 transition-colors">
          <button onClick={() => setActiveView('main')} className="p-2 -ml-2 text-arch-dark/60 hover:text-arch-dark dark:text-arch-light/60 dark:hover:text-arch-light transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-cinzel font-bold text-arch-dark dark:text-arch-light">Política de Privacidad</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white dark:bg-arch-brown/20 p-6 rounded-3xl shadow-sm border border-arch-border dark:border-arch-brown prose prose-sm prose-stone dark:prose-invert max-w-none transition-colors">
            <div className="flex items-center gap-3 mb-6 p-4 bg-arch-navy/10 dark:bg-arch-brown/40 text-arch-navy dark:text-arch-gold rounded-xl border border-arch-border dark:border-arch-brown">
              <Shield size={24} className="shrink-0" />
              <p className="text-xs font-medium m-0">Tu privacidad es importante para nosotros. Es política de Sapientia respetar tu privacidad con respecto a cualquier información que podamos recopilar.</p>
            </div>

            <h3 className="text-base font-bold text-arch-dark dark:text-arch-light mb-2 font-cinzel">Información que recopilamos</h3>
            <p className="text-arch-dark/80 dark:text-arch-light/80 mb-4 leading-relaxed">Solo solicitamos información personal cuando realmente la necesitamos para brindarte un servicio. La recopilamos por medios justos y legales, con tu conocimiento y consentimiento. También te informamos por qué la recopilamos y cómo se utilizará.</p>
            <ul className="list-disc pl-5 text-arch-dark/80 dark:text-arch-light/80 mb-4 space-y-1">
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Especialidad académica o profesional</li>
              <li>Ubicación aproximada</li>
              <li>Contenido de los proyectos y mensajes</li>
            </ul>

            <h3 className="text-base font-bold text-arch-dark dark:text-arch-light mb-2 font-cinzel">Uso de la información</h3>
            <p className="text-arch-dark/80 dark:text-arch-light/80 mb-4 leading-relaxed">Utilizamos la información recopilada para operar y mantener la plataforma Sapientia, facilitar la comunicación entre usuarios, personalizar tu experiencia y mejorar nuestros servicios.</p>

            <h3 className="text-base font-bold text-arch-dark dark:text-arch-light mb-2 font-cinzel">Retención de datos</h3>
            <p className="text-arch-dark/80 dark:text-arch-light/80 mb-4 leading-relaxed">Solo retenemos la información recopilada durante el tiempo que sea necesario para brindarte el servicio solicitado. Los datos que almacenamos, los protegeremos dentro de medios comercialmente aceptables para evitar pérdidas y robos, así como el acceso, divulgación, copia, uso o modificación no autorizados.</p>

            <h3 className="text-base font-bold text-arch-dark dark:text-arch-light mb-2 font-cinzel">Compartir información</h3>
            <p className="text-arch-dark/80 dark:text-arch-light/80 mb-4 leading-relaxed">No compartimos ninguna información de identificación personal públicamente o con terceros, excepto cuando lo exija la ley.</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'language') {
    const languages = [
      'Inglés', 'Chino Mandarín', 'Hindi', 'Español', 'Árabe', 
      'Francés', 'Portugués', 'Ruso', 'Alemán', 'Japonés', 'Catalán'
    ];
    
    return (
      <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
        <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown flex items-center gap-4 sticky top-0 z-10 transition-colors">
          <button onClick={() => setActiveView('main')} className="p-2 -ml-2 text-arch-dark/60 hover:text-arch-dark dark:text-arch-light/60 dark:hover:text-arch-light transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-cinzel font-bold text-arch-dark dark:text-arch-light">Idioma</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white dark:bg-arch-brown/20 rounded-3xl shadow-sm border border-arch-border dark:border-arch-brown overflow-hidden transition-colors">
            {languages.map((lang, index) => (
              <button 
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setActiveView('main');
                }}
                className={`w-full flex items-center justify-between p-4 hover:bg-arch-light dark:hover:bg-arch-brown/40 transition-colors ${index !== languages.length - 1 ? 'border-b border-arch-border dark:border-arch-brown' : ''}`}
              >
                <span className={`font-medium text-sm ${language === lang ? 'text-arch-navy dark:text-arch-gold font-bold' : 'text-arch-dark dark:text-arch-light'}`}>
                  {lang}
                </span>
                {language === lang && (
                  <div className="w-2 h-2 rounded-full bg-arch-navy dark:bg-arch-gold"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'personal_data') {
    return (
      <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
        <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown flex items-center gap-4 sticky top-0 z-10 transition-colors">
          <button onClick={() => setActiveView('main')} className="p-2 -ml-2 text-arch-dark/60 hover:text-arch-dark dark:text-arch-light/60 dark:hover:text-arch-light transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-cinzel font-bold text-arch-dark dark:text-arch-light">Datos Personales</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSavePersonalData} className="space-y-6">
            <div className="flex flex-col items-center mb-8">
              <img src={formData.avatar} alt={formData.name} className="w-24 h-24 shrink-0 rounded-full object-cover border-4 border-white dark:border-arch-brown shadow-sm mb-4" />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-arch-navy dark:text-arch-gold font-bold hover:underline"
              >
                Cambiar foto de perfil
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase tracking-wider mb-2">Nombre y Apellidos</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40 focus:border-arch-navy dark:focus:border-arch-gold transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase tracking-wider mb-2">Especialidad</label>
                <input 
                  type="text" 
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40 focus:border-arch-navy dark:focus:border-arch-gold transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase tracking-wider mb-2">Ubicación</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40 focus:border-arch-navy dark:focus:border-arch-gold transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase tracking-wider mb-2">Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Dejar en blanco para no cambiar"
                  className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40 focus:border-arch-navy dark:focus:border-arch-gold transition-all"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-arch-navy dark:bg-arch-gold text-white dark:text-arch-navy font-bold py-4 rounded-xl shadow-sm hover:bg-arch-navy/90 dark:hover:bg-yellow-500 transition-colors mt-8">
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (activeView === 'my_ads') {
    const myAds = ads.filter(ad => ad.authorId === currentUser.id);
    return (
      <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
        <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown flex items-center gap-4 sticky top-0 z-10 transition-colors">
          <button onClick={() => setActiveView('main')} className="p-2 -ml-2 text-arch-dark/60 hover:text-arch-dark dark:text-arch-light/60 dark:hover:text-arch-light transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-cinzel font-bold text-arch-dark dark:text-arch-light">Mis Anuncios</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {myAds.length === 0 ? (
            <div className="text-center py-12 text-arch-dark/60 dark:text-arch-light/60">
              <FileText size={48} className="mx-auto mb-4 opacity-20" />
              <p>No has publicado ningún anuncio todavía.</p>
            </div>
          ) : (
            myAds.map(ad => (
              <div key={ad.id} onClick={() => setSelectedAd(ad)} className="bg-white dark:bg-arch-brown/20 p-4 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown cursor-pointer hover:border-arch-navy dark:hover:border-arch-gold transition-colors">
                <h3 className="font-bold text-arch-dark dark:text-arch-light leading-tight mb-2 font-cinzel">{ad.title}</h3>
                <div className="flex items-center gap-2 text-arch-dark/60 dark:text-arch-light/60 text-xs mb-3 font-medium">
                  <MapPin size={14} />
                  <span>{ad.location}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-arch-border dark:border-arch-brown">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                    ad.projectStatus === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 
                    ad.projectStatus === 'Ongoing' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 
                    ad.projectStatus === 'Urgent' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' :
                    'bg-arch-navy/10 dark:bg-arch-gold/20 text-arch-navy dark:text-arch-gold'
                  }`}>
                    {ad.projectStatus === 'Completed' ? 'Completado' : ad.projectStatus === 'Ongoing' ? 'En curso' : ad.projectStatus === 'Urgent' ? 'Urgente' : 'Propuesto'}
                  </span>
                  <div className="flex items-center gap-3 text-arch-dark/40 dark:text-arch-light/40">
                    <div className="flex items-center gap-1">
                      <Heart size={14} />
                      <span className="text-xs font-medium">{ad.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      <span className="text-xs font-medium">{ad.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'saved') {
    const savedAds = ads.filter(ad => ad.likedBy.includes(currentUser.id));
    return (
      <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
        <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown flex items-center gap-4 sticky top-0 z-10 transition-colors">
          <button onClick={() => setActiveView('main')} className="p-2 -ml-2 text-arch-dark/60 hover:text-arch-dark dark:text-arch-light/60 dark:hover:text-arch-light transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-cinzel font-bold text-arch-dark dark:text-arch-light">Guardados</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedAds.length === 0 ? (
            <div className="text-center py-12 text-arch-dark/60 dark:text-arch-light/60">
              <Bookmark size={48} className="mx-auto mb-4 opacity-20" />
              <p>No has guardado ningún proyecto todavía.</p>
            </div>
          ) : (
            savedAds.map(ad => (
              <div key={ad.id} onClick={() => setSelectedAd(ad)} className="bg-white dark:bg-arch-brown/20 p-4 rounded-2xl shadow-sm border border-arch-border dark:border-arch-brown cursor-pointer hover:border-arch-navy dark:hover:border-arch-gold transition-colors">
                <h3 className="font-bold text-arch-dark dark:text-arch-light leading-tight mb-2 font-cinzel">{ad.title}</h3>
                <p className="text-sm text-arch-dark/80 dark:text-arch-light/80 line-clamp-2 mb-3">{ad.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-arch-border dark:border-arch-brown">
                  <div className="flex items-center gap-2 text-arch-dark/60 dark:text-arch-light/60 text-xs font-medium">
                    <MapPin size={14} />
                    <span>{ad.location}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLikeAd(ad.id); }}
                    className="text-arch-gold flex items-center gap-1"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-arch-light dark:bg-arch-navy transition-colors">
      <div className="bg-white dark:bg-arch-navy px-6 pt-12 pb-4 shadow-sm border-b border-arch-border dark:border-arch-brown sticky top-0 z-10 transition-colors">
        <h1 className="text-2xl font-cinzel font-bold text-arch-dark dark:text-arch-light mb-2">Ajustes</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Profile Summary */}
        <div className="bg-white dark:bg-arch-brown/20 p-5 rounded-3xl shadow-sm border border-arch-border dark:border-arch-brown flex items-center gap-4 transition-colors">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 shrink-0 rounded-full object-cover border-2 border-arch-navy/20 dark:border-arch-gold/40" />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-arch-dark dark:text-arch-light text-lg truncate font-cinzel">{currentUser.name}</h2>
            <p className="text-sm text-arch-navy dark:text-arch-gold font-medium truncate font-cormorant">{currentUser.specialty}</p>
            <button onClick={() => setActiveView('personal_data')} className="text-xs text-arch-dark/60 dark:text-arch-light/60 mt-1 hover:text-arch-navy dark:hover:text-arch-gold font-medium transition-colors">
              Editar perfil
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <section>
          <h3 className="text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase tracking-wider mb-3 px-2">Tu Cuenta</h3>
          <div className="bg-white dark:bg-arch-brown/20 rounded-3xl shadow-sm border border-arch-border dark:border-arch-brown overflow-hidden transition-colors">
            <button onClick={() => setActiveView('personal_data')} className="w-full flex items-center justify-between p-4 hover:bg-arch-light dark:hover:bg-arch-brown/40 transition-colors border-b border-arch-border dark:border-arch-brown">
              <div className="flex items-center gap-3">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-2 rounded-xl text-arch-navy dark:text-arch-gold">
                  <User size={20} />
                </div>
                <span className="font-medium text-arch-dark dark:text-arch-light text-sm">Datos personales</span>
              </div>
              <ChevronRight size={20} className="text-arch-dark/40 dark:text-arch-light/40" />
            </button>
            <button onClick={() => setActiveView('my_ads')} className="w-full flex items-center justify-between p-4 hover:bg-arch-light dark:hover:bg-arch-brown/40 transition-colors border-b border-arch-border dark:border-arch-brown">
              <div className="flex items-center gap-3">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-2 rounded-xl text-arch-navy dark:text-arch-gold">
                  <FileText size={20} />
                </div>
                <span className="font-medium text-arch-dark dark:text-arch-light text-sm">Mis anuncios</span>
              </div>
              <ChevronRight size={20} className="text-arch-dark/40 dark:text-arch-light/40" />
            </button>
            <button onClick={() => setActiveView('saved')} className="w-full flex items-center justify-between p-4 hover:bg-arch-light dark:hover:bg-arch-brown/40 transition-colors border-b border-arch-border dark:border-arch-brown">
              <div className="flex items-center gap-3">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-2 rounded-xl text-arch-navy dark:text-arch-gold">
                  <Bookmark size={20} />
                </div>
                <span className="font-medium text-arch-dark dark:text-arch-light text-sm">Guardados</span>
              </div>
              <ChevronRight size={20} className="text-arch-dark/40 dark:text-arch-light/40" />
            </button>
            <button onClick={() => setActiveView('notes')} className="w-full flex items-center justify-between p-4 hover:bg-arch-light dark:hover:bg-arch-brown/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-2 rounded-xl text-arch-navy dark:text-arch-gold">
                  <StickyNote size={20} />
                </div>
                <span className="font-medium text-arch-dark dark:text-arch-light text-sm">Notas</span>
              </div>
              <ChevronRight size={20} className="text-arch-dark/40 dark:text-arch-light/40" />
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h3 className="text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase tracking-wider mb-3 px-2">Preferencias</h3>
          <div className="bg-white dark:bg-arch-brown/20 rounded-3xl shadow-sm border border-arch-border dark:border-arch-brown overflow-hidden transition-colors">
            <div className="w-full flex items-center justify-between p-4 border-b border-arch-border dark:border-arch-brown">
              <div className="flex items-center gap-3">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-2 rounded-xl text-arch-navy dark:text-arch-gold">
                  <Bell size={20} />
                </div>
                <span className="font-medium text-arch-dark dark:text-arch-light text-sm">Notificaciones</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-arch-border dark:bg-arch-brown peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-arch-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-arch-navy dark:peer-checked:bg-arch-gold"></div>
              </label>
            </div>
            <div className="w-full flex items-center justify-between p-4 border-b border-arch-border dark:border-arch-brown">
              <div className="flex items-center gap-3">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-2 rounded-xl text-arch-navy dark:text-arch-gold">
                  <Moon size={20} />
                </div>
                <span className="font-medium text-arch-dark dark:text-arch-light text-sm">Modo oscuro</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={toggleDarkMode} />
                <div className="w-11 h-6 bg-arch-border dark:bg-arch-brown peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-arch-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-arch-navy dark:peer-checked:bg-arch-gold"></div>
              </label>
            </div>
            <button onClick={() => setActiveView('language')} className="w-full flex items-center justify-between p-4 hover:bg-arch-light dark:hover:bg-arch-brown/40 transition-colors border-b border-arch-border dark:border-arch-brown">
              <div className="flex items-center gap-3">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-2 rounded-xl text-arch-navy dark:text-arch-gold">
                  <Globe size={20} />
                </div>
                <span className="font-medium text-arch-dark dark:text-arch-light text-sm">Idioma</span>
              </div>
              <div className="flex items-center gap-2 text-arch-dark/40 dark:text-arch-light/40">
                <span className="text-sm font-medium">{language}</span>
                <ChevronRight size={20} />
              </div>
            </button>
            <button onClick={() => setActiveView('integrations')} className="w-full flex items-center justify-between p-4 hover:bg-arch-light dark:hover:bg-arch-brown/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-2 rounded-xl text-arch-navy dark:text-arch-gold">
                  <Plus size={20} />
                </div>
                <span className="font-medium text-arch-dark dark:text-arch-light text-sm">Integraciones</span>
              </div>
              <ChevronRight size={20} className="text-arch-dark/40 dark:text-arch-light/40" />
            </button>
          </div>
        </section>

        {/* Support */}
        <section>
          <h3 className="text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase tracking-wider mb-3 px-2">Soporte</h3>
          <div className="bg-white dark:bg-arch-brown/20 rounded-3xl shadow-sm border border-arch-border dark:border-arch-brown overflow-hidden transition-colors">
            <button onClick={() => setActiveView('help')} className="w-full flex items-center justify-between p-4 hover:bg-arch-light dark:hover:bg-arch-brown/40 transition-colors border-b border-arch-border dark:border-arch-brown">
              <div className="flex items-center gap-3">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-2 rounded-xl text-arch-navy dark:text-arch-gold">
                  <HelpCircle size={20} />
                </div>
                <span className="font-medium text-arch-dark dark:text-arch-light text-sm">Ayuda</span>
              </div>
              <ChevronRight size={20} className="text-arch-dark/40 dark:text-arch-light/40" />
            </button>
            <button onClick={() => setActiveView('terms')} className="w-full flex items-center justify-between p-4 hover:bg-arch-light dark:hover:bg-arch-brown/40 transition-colors border-b border-arch-border dark:border-arch-brown">
              <div className="flex items-center gap-3">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-2 rounded-xl text-arch-navy dark:text-arch-gold">
                  <FileWarning size={20} />
                </div>
                <span className="font-medium text-arch-dark dark:text-arch-light text-sm">Términos y condiciones</span>
              </div>
              <ChevronRight size={20} className="text-arch-dark/40 dark:text-arch-light/40" />
            </button>
            <button onClick={() => setActiveView('privacy')} className="w-full flex items-center justify-between p-4 hover:bg-arch-light dark:hover:bg-arch-brown/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-arch-navy/10 dark:bg-arch-navy/40 p-2 rounded-xl text-arch-navy dark:text-arch-gold">
                  <Shield size={20} />
                </div>
                <span className="font-medium text-arch-dark dark:text-arch-light text-sm">Política de privacidad</span>
              </div>
              <ChevronRight size={20} className="text-arch-dark/40 dark:text-arch-light/40" />
            </button>
          </div>
        </section>

        <button onClick={() => handleAction('Cerrar sesión')} className="w-full bg-white dark:bg-arch-brown/20 p-4 rounded-3xl shadow-sm border border-arch-border dark:border-arch-brown flex items-center justify-center gap-2 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors mt-8">
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
        
        <div className="text-center pb-8 pt-4">
          <p className="text-xs text-arch-dark/40 dark:text-arch-light/40 font-medium">Sapientia v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

