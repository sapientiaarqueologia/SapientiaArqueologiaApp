import React, { useState } from 'react';
import { X, Upload, Sparkles, Loader2, Camera } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../AppContext';

interface AIAnalyzerProps {
  onClose: () => void;
}

export function AIAnalyzer({ onClose }: AIAnalyzerProps) {
  const { analyzeImage } = useAppContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setAnalysis(null);
    setError(null);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Analyze
    setIsLoading(true);
    try {
      const base64Data = await fileToBase64(file);
      const result = await analyzeImage(base64Data, file.type);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Hubo un error al analizar la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 dark:bg-stone-950/60 backdrop-blur-sm z-50 flex flex-col justify-end">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-arch-light dark:bg-arch-navy rounded-t-3xl p-6 relative z-10 animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto border-t border-arch-border dark:border-arch-brown">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-arch-gold/20 p-2 rounded-lg text-arch-gold">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-cinzel font-bold text-arch-navy dark:text-arch-light">
              Analizador de Artefactos (IA)
            </h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white dark:bg-arch-brown/20 text-arch-dark/60 dark:text-arch-light/60 rounded-full hover:bg-arch-border/50 dark:hover:bg-arch-brown/40 transition-colors border border-arch-border dark:border-arch-brown">
            <X size={20} />
          </button>
        </div>

        {!selectedImage ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-arch-border dark:border-arch-brown rounded-2xl bg-white/50 dark:bg-arch-brown/10">
            <div className="bg-arch-navy/5 dark:bg-arch-gold/10 p-4 rounded-full text-arch-navy dark:text-arch-gold mb-4">
              <Camera size={48} strokeWidth={1.5} />
            </div>
            <p className="text-arch-dark/60 dark:text-arch-light/60 font-medium mb-4 text-center px-6">
              Sube una foto de un hallazgo para obtener un análisis arqueológico instantáneo.
            </p>
            <label className="bg-arch-navy dark:bg-arch-gold text-white dark:text-arch-navy font-bold px-6 py-3 rounded-xl cursor-pointer hover:scale-105 transition-transform flex items-center gap-2">
              <Upload size={20} />
              Seleccionar Imagen
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-arch-border dark:border-arch-brown shadow-lg">
              <img src={selectedImage} alt="Preview" className="w-full h-64 object-cover" />
              {isLoading && (
                <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <Loader2 size={48} className="animate-spin mb-4" />
                  <p className="font-cinzel font-bold animate-pulse">Analizando con Sapientia AI...</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-4 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium">
                {error}
              </div>
            )}

            {analysis && (
              <div className="bg-white dark:bg-arch-brown/20 border border-arch-border dark:border-arch-brown rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-arch-gold">
                  <Sparkles size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Análisis Arqueológico</span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-arch-dark dark:text-arch-light/90 prose-headings:font-cinzel prose-headings:text-arch-navy dark:prose-headings:text-arch-gold prose-strong:text-arch-navy dark:prose-strong:text-arch-gold">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
                <button 
                  onClick={() => {
                    setSelectedImage(null);
                    setAnalysis(null);
                  }}
                  className="w-full mt-6 py-3 border border-arch-border dark:border-arch-brown rounded-xl text-arch-dark/60 dark:text-arch-light/60 font-bold hover:bg-arch-border/20 dark:hover:bg-arch-brown/40 transition-colors text-sm"
                >
                  Analizar otra imagen
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-[10px] text-arch-dark/40 dark:text-arch-light/40 italic">
            * El análisis es generado por IA y debe ser verificado por un profesional.
          </p>
        </div>
      </div>
    </div>
  );
}
