import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { ArtistInfo } from '../../lib/supabaseClient';
import { usePreview } from '../../context/PreviewContext';
import ImageUploader from '../components/ImageUploader';
import { Loader2, Save, AlertCircle } from 'lucide-react';

export default function ArtistPage() {
  const [info, setInfo] = useState<ArtistInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { isPreviewMode, previewData, updatePreview } = usePreview();

  useEffect(() => {
    if (isPreviewMode) {
      setInfo(previewData.artist_info || { id: '', name: 'Rowan Black', photo_url: null, polaroid_url: null, updated_at: '' });
      setLoading(false);
      return;
    }
    supabase.from('artist_info').select('*').limit(1).single()
      .then(({ data }) => {
        setInfo(data);
        setLoading(false);
      });
  }, [isPreviewMode, previewData.artist_info]);

  const handleSave = async () => {
    if (!info) return;
    setSaving(true);

    if (isPreviewMode) {
      updatePreview('artist_info', { ...info, updated_at: new Date().toISOString() });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }

    const { id, ...rest } = info;
    if (id) {
      await supabase.from('artist_info').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      const { data } = await supabase.from('artist_info').insert(rest).select().single();
      if (data) setInfo(data);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
    </div>
  );

  const artist = info ?? { id: '', name: 'Rowan Black', photo_url: null, polaroid_url: null, updated_at: '' };

  return (
    <div className="max-w-2xl mx-auto">
      {isPreviewMode && (
        <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-500 text-sm font-medium">Modo Sandbox Activo</p>
            <p className="text-amber-500/60 text-xs">Los cambios en el perfil del artista son temporales.</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white tracking-wide mb-1">Artista</h1>
        <p className="text-white/30 text-sm">Foto de perfil y polaroid que aparecen en la sección "Conoce al artista".</p>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Nombre del artista</label>
          <input
            type="text"
            value={artist.name}
            onChange={e => setInfo({ ...artist, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm"
            placeholder="Rowan Black"
          />
        </div>

        {/* Profile Photo */}
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-widest mb-3">Foto de perfil principal</label>
          {artist.photo_url && (
            <img src={artist.photo_url} alt="Profile" className="w-32 h-40 object-cover rounded-xl border border-white/10 mb-3" />
          )}
          <ImageUploader
            bucket="media"
            folder="artist"
            onUpload={url => setInfo({ ...artist, photo_url: url })}
            label="Subir foto de perfil"
          />
        </div>

        {/* Polaroid */}
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-widest mb-3">Polaroid del estudio</label>
          {artist.polaroid_url && (
            <img src={artist.polaroid_url} alt="Polaroid" className="w-40 h-24 object-cover rounded-xl border border-white/10 mb-3" />
          )}
          <ImageUploader
            bucket="media"
            folder="artist"
            onUpload={url => setInfo({ ...artist, polaroid_url: url })}
            label="Subir imagen polaroid"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-sm font-medium uppercase tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
