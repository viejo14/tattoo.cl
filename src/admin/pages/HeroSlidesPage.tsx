import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { HeroSlide } from '../../lib/supabaseClient';
import ImageUploader from '../components/ImageUploader';
import { Trash2, GripVertical, Loader2, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSlides = async () => {
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order');
    setSlides(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleUpload = async (url: string) => {
    setSaving(true);
    const maxOrder = slides.length > 0 ? Math.max(...slides.map(s => s.order)) + 1 : 0;
    const { data, error } = await supabase
      .from('hero_slides')
      .insert({ image_url: url, order: maxOrder, active: true })
      .select()
      .single();
    if (!error && data) setSlides(prev => [...prev, data]);
    setSaving(false);
  };

  const toggleActive = async (slide: HeroSlide) => {
    const { data } = await supabase
      .from('hero_slides')
      .update({ active: !slide.active })
      .eq('id', slide.id)
      .select()
      .single();
    if (data) setSlides(prev => prev.map(s => s.id === data.id ? data : s));
  };

  const handleDelete = async (id: string) => {
    await supabase.from('hero_slides').delete().eq('id', id);
    setSlides(prev => prev.filter(s => s.id !== id));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white tracking-wide mb-1">Hero Slides</h1>
        <p className="text-white/30 text-sm">Imágenes del carrusel de portada. Se muestran 5 a la vez.</p>
      </div>

      <div className="mb-8">
        <ImageUploader
          bucket="media"
          folder="hero"
          onUpload={handleUpload}
          label="Añadir slide al hero"
        />
        {saving && <p className="text-white/30 text-xs mt-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Guardando...</p>}
      </div>

      {slides.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <Plus className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <p className="text-white/20 text-sm">No hay slides. Sube la primera imagen.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map(slide => (
            <div
              key={slide.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                slide.active ? 'border-white/10 bg-white/[0.03]' : 'border-white/5 bg-white/[0.01] opacity-50'
              }`}
            >
              <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0 cursor-grab" />
              <img
                src={slide.image_url}
                alt="slide"
                className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white/50 text-xs truncate">{slide.image_url.split('/').pop()}</p>
                <p className="text-white/25 text-xs mt-0.5">Orden: {slide.order}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(slide)}
                  title={slide.active ? 'Desactivar' : 'Activar'}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {slide.active
                    ? <ToggleRight className="w-5 h-5 text-emerald-400" />
                    : <ToggleLeft className="w-5 h-5 text-white/30" />
                  }
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
