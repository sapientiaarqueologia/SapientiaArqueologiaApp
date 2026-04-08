import React, { useState } from 'react';
import { X, FileText, Image as ImageIcon, Video, Download, Newspaper } from 'lucide-react';
import { Tab } from '../App';
import { useAppContext } from '../AppContext';

interface CreateMenuProps {
  onClose: () => void;
  onNavigate: (tab: Tab) => void;
}

export function CreateMenu({ onClose, onNavigate }: CreateMenuProps) {
  const { addAd, addImage, addVideo, addFile, addNews } = useAppContext();
  const [activeForm, setActiveForm] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [artifactType, setArtifactType] = useState('');
  const [projectStatus, setProjectStatus] = useState<'Proposed' | 'Ongoing' | 'Completed' | 'Urgent'>('Proposed');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // In a real app, you would upload this file to a server and get a URL back.
      // For this demo, we'll just create a local object URL or use a placeholder.
      setUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = () => {
    if (!title) return;

    if (activeForm === 'ad') {
      addAd({
        title,
        description,
        location: location || 'Ubicación no especificada',
        tags: [timePeriod, artifactType],
        timePeriod,
        artifactType,
        projectStatus
      });
    } else if (activeForm === 'image') {
      addImage({
        title,
        location: location || 'Ubicación no especificada',
        url: url || 'https://picsum.photos/seed/new/600/400'
      });
    } else if (activeForm === 'video') {
      addVideo({
        title,
        duration: '0:00',
        thumbnail: url || 'https://picsum.photos/seed/new/600/400'
      });
    } else if (activeForm === 'file') {
      addFile({
        title,
        type: 'Documento',
        size: '1.0 MB'
      });
    } else if (activeForm === 'news') {
      addNews({
        title,
        source: 'Usuario',
        summary: description,
        date: 'Ahora mismo',
        url: '#',
        image: url || 'https://picsum.photos/seed/new/600/400'
      });
    }

    onNavigate('search');
    onClose();
  };

  if (activeForm) {
    return (
      <div className="fixed inset-0 bg-stone-900/40 dark:bg-stone-950/60 backdrop-blur-sm z-50 flex flex-col justify-end">
        <div className="absolute inset-0" onClick={onClose} />
        <div className="bg-arch-light dark:bg-arch-navy rounded-t-3xl p-6 relative z-10 animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto border-t border-arch-border dark:border-arch-brown">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-cinzel font-bold text-arch-navy dark:text-arch-light">
              {activeForm === 'ad' && 'Publicar Anuncio'}
              {activeForm === 'image' && 'Subir Imagen'}
              {activeForm === 'video' && 'Subir Video'}
              {activeForm === 'file' && 'Subir Archivo'}
              {activeForm === 'news' && 'Publicar Noticia'}
            </h2>
            <button onClick={() => setActiveForm(null)} className="p-2 bg-white dark:bg-arch-brown/20 text-arch-dark/60 dark:text-arch-light/60 rounded-full hover:bg-arch-border/50 dark:hover:bg-arch-brown/40 transition-colors border border-arch-border dark:border-arch-brown">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase mb-1">Título</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40" placeholder="Ej: Necesito experto en..." />
            </div>

            {(activeForm === 'ad' || activeForm === 'news') && (
              <div>
                <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase mb-1">Descripción</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40 h-24 resize-none" placeholder="Detalles..." />
              </div>
            )}

            {(activeForm === 'ad' || activeForm === 'image') && (
              <div>
                <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase mb-1">Ubicación</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40" placeholder="Ej: Madrid, España" />
              </div>
            )}

            {activeForm === 'ad' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase mb-1">Periodo</label>
                    <input type="text" value={timePeriod} onChange={e => setTimePeriod(e.target.value)} className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40" placeholder="Ej: Neolítico" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase mb-1">Categoría / Artefacto</label>
                    <input type="text" value={artifactType} onChange={e => setArtifactType(e.target.value)} className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40" placeholder="Ej: Cerámica" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase mb-1">Estado del Proyecto</label>
                  <select 
                    value={projectStatus} 
                    onChange={e => setProjectStatus(e.target.value as any)} 
                    className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40 appearance-none"
                  >
                    <option value="Proposed">Propuesto</option>
                    <option value="Ongoing">En curso</option>
                    <option value="Completed">Completado</option>
                    <option value="Urgent">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase mb-1">Adjuntar Archivo (Opcional)</label>
                  <input type="file" onChange={handleFileChange} className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-arch-navy/10 dark:file:bg-arch-brown/40 file:text-arch-navy dark:file:text-arch-gold hover:file:bg-arch-navy/20 dark:hover:file:bg-arch-brown/60" />
                </div>
              </>
            )}

            {(activeForm === 'image' || activeForm === 'video' || activeForm === 'file' || activeForm === 'news') && (
              <div>
                <label className="block text-xs font-bold text-arch-dark/60 dark:text-arch-light/60 uppercase mb-1">
                  {activeForm === 'image' ? 'Subir Imagen' : activeForm === 'video' ? 'Subir Video' : activeForm === 'file' ? 'Subir Archivo' : 'Imagen de la Noticia'}
                </label>
                <input 
                  type="file" 
                  accept={activeForm === 'image' || activeForm === 'news' ? 'image/*' : activeForm === 'video' ? 'video/*' : '*/*'}
                  onChange={handleFileChange} 
                  className="w-full bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-arch-navy/10 dark:file:bg-arch-brown/40 file:text-arch-navy dark:file:text-arch-gold hover:file:bg-arch-navy/20 dark:hover:file:bg-arch-brown/60 mb-2" 
                />
                <div className="text-center text-xs text-arch-dark/40 dark:text-arch-light/40 font-medium">O usa una URL:</div>
                <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="w-full mt-2 bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-xl px-4 py-3 text-arch-dark dark:text-arch-light focus:outline-none focus:ring-2 focus:ring-arch-navy/20 dark:focus:ring-arch-gold/40" placeholder="https://..." />
              </div>
            )}

            <button 
              onClick={handleSubmit}
              disabled={!title}
              className="w-full bg-arch-navy dark:bg-arch-gold text-white dark:text-arch-navy font-bold py-4 rounded-xl hover:bg-arch-navy/90 dark:hover:bg-yellow-500 transition-colors disabled:opacity-50 mt-4"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-stone-900/40 dark:bg-stone-950/60 backdrop-blur-sm z-50 flex flex-col justify-end">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="bg-arch-light dark:bg-arch-navy rounded-t-3xl p-6 relative z-10 animate-in slide-in-from-bottom-full duration-300 border-t border-arch-border dark:border-arch-brown">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-cinzel font-bold text-arch-navy dark:text-arch-light">Crear Contenido</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-white dark:bg-arch-brown/20 text-arch-dark/60 dark:text-arch-light/60 rounded-full hover:bg-arch-border/50 dark:hover:bg-arch-brown/40 transition-colors border border-arch-border dark:border-arch-brown"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-8">
          <button 
            onClick={() => setActiveForm('ad')}
            className="flex items-center gap-4 p-4 bg-white dark:bg-arch-brown/20 rounded-2xl border border-arch-border dark:border-arch-brown hover:border-arch-navy dark:hover:border-arch-gold transition-colors text-left group"
          >
            <div className="bg-arch-navy/10 dark:bg-arch-brown/40 p-3 rounded-xl text-arch-navy dark:text-arch-gold group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-arch-dark dark:text-arch-light font-cinzel">Publicar anuncio</h3>
              <p className="text-xs text-arch-dark/60 dark:text-arch-light/60 mt-0.5">Solicita ayuda o busca expertos</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveForm('image')}
            className="flex items-center gap-4 p-4 bg-white dark:bg-arch-brown/20 rounded-2xl border border-arch-border dark:border-arch-brown hover:border-arch-navy dark:hover:border-arch-gold transition-colors text-left group"
          >
            <div className="bg-arch-navy/10 dark:bg-arch-brown/40 p-3 rounded-xl text-arch-navy dark:text-arch-gold group-hover:scale-110 transition-transform">
              <ImageIcon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-arch-dark dark:text-arch-light font-cinzel">Subir imagen</h3>
              <p className="text-xs text-arch-dark/60 dark:text-arch-light/60 mt-0.5">Comparte fotos de hallazgos</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveForm('video')}
            className="flex items-center gap-4 p-4 bg-white dark:bg-arch-brown/20 rounded-2xl border border-arch-border dark:border-arch-brown hover:border-arch-navy dark:hover:border-arch-gold transition-colors text-left group"
          >
            <div className="bg-arch-navy/10 dark:bg-arch-brown/40 p-3 rounded-xl text-arch-navy dark:text-arch-gold group-hover:scale-110 transition-transform">
              <Video size={24} />
            </div>
            <div>
              <h3 className="font-bold text-arch-dark dark:text-arch-light font-cinzel">Subir video</h3>
              <p className="text-xs text-arch-dark/60 dark:text-arch-light/60 mt-0.5">Muestra procesos de excavación</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveForm('file')}
            className="flex items-center gap-4 p-4 bg-white dark:bg-arch-brown/20 rounded-2xl border border-arch-border dark:border-arch-brown hover:border-arch-navy dark:hover:border-arch-gold transition-colors text-left group"
          >
            <div className="bg-arch-navy/10 dark:bg-arch-brown/40 p-3 rounded-xl text-arch-navy dark:text-arch-gold group-hover:scale-110 transition-transform">
              <Download size={24} />
            </div>
            <div>
              <h3 className="font-bold text-arch-dark dark:text-arch-light font-cinzel">Subir archivo</h3>
              <p className="text-xs text-arch-dark/60 dark:text-arch-light/60 mt-0.5">Comparte informes o modelos 3D</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveForm('news')}
            className="flex items-center gap-4 p-4 bg-white dark:bg-arch-brown/20 rounded-2xl border border-arch-border dark:border-arch-brown hover:border-arch-navy dark:hover:border-arch-gold transition-colors text-left group"
          >
            <div className="bg-arch-navy/10 dark:bg-arch-brown/40 p-3 rounded-xl text-arch-navy dark:text-arch-gold group-hover:scale-110 transition-transform">
              <Newspaper size={24} />
            </div>
            <div>
              <h3 className="font-bold text-arch-dark dark:text-arch-light font-cinzel">Publicar noticia</h3>
              <p className="text-xs text-arch-dark/60 dark:text-arch-light/60 mt-0.5">Anuncia descubrimientos o eventos</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
