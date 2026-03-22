import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { PortfolioItem } from '../../lib/supabaseClient';
import { usePreview } from '../../context/PreviewContext';
import ImageUploader from '../components/ImageUploader';
import { Trash2, Loader2, Plus, ToggleLeft, ToggleRight, Save, Edit2, X, AlertCircle } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'Sin estado' },
  { value: 'available', label: 'Disponible' },
  { value: 'sold', label: 'Vendido' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'new', label: 'Nuevo' },
] as const;

const STATUS_COLORS: Record<string, string> = {
  available: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  sold: 'text-red-400 bg-red-500/10 border-red-500/20',
  reserved: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  new: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  '': 'text-white/40 bg-white/5 border-white/10',
};

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBuf, setEditBuf] = useState<Partial<PortfolioItem>>({});
  const { isPreviewMode, previewData, updatePreview } = usePreview();

  useEffect(() => {
    if (isPreviewMode) {
      setItems(previewData.portfolio_items);
      setLoading(false);
      return;
    }
    supabase.from('portfolio_items').select('*').order('order')
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, [isPreviewMode, previewData.portfolio_items]);

  const handleUpload = async (url: string) => {
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 0;
    
    if (isPreviewMode) {
      const newItem: PortfolioItem = {
        id: crypto.randomUUID(),
        image_url: url,
        title: 'Sin título',
        status: '',
        order: maxOrder,
        active: true,
        created_at: new Date().toISOString()
      };
      updatePreview('portfolio_items', [...items, newItem]);
      return;
    }

    const { data } = await supabase
      .from('portfolio_items')
      .insert({ image_url: url, title: 'Sin título', status: '', order: maxOrder, active: true })
      .select().single();
    if (data) setItems(prev => [...prev, data]);
  };

  const startEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setEditBuf({ title: item.title, status: item.status });
  };

  const saveEdit = async (item: PortfolioItem) => {
    if (isPreviewMode) {
      const updated = items.map(i => i.id === item.id ? { ...i, ...editBuf } : i);
      updatePreview('portfolio_items', updated);
      setEditingId(null);
      return;
    }
    const { data } = await supabase.from('portfolio_items')
      .update(editBuf).eq('id', item.id).select().single();
    if (data) setItems(prev => prev.map(i => i.id === data.id ? data : i));
    setEditingId(null);
  };

  const toggleActive = async (item: PortfolioItem) => {
    if (isPreviewMode) {
      const updated = items.map(i => i.id === item.id ? { ...i, active: !i.active } : i);
      updatePreview('portfolio_items', updated);
      return;
    }
    const { data } = await supabase.from('portfolio_items')
      .update({ active: !item.active }).eq('id', item.id).select().single();
    if (data) setItems(prev => prev.map(i => i.id === data.id ? data : i));
  };

  const handleDelete = async (id: string) => {
    if (isPreviewMode) {
      updatePreview('portfolio_items', items.filter(i => i.id !== id));
      return;
    }
    await supabase.from('portfolio_items').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {isPreviewMode && (
        <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-500 text-sm font-medium">Modo Sandbox Activo</p>
            <p className="text-amber-500/60 text-xs">Puedes añadir y editar piezas del portafolio libremente.</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white tracking-wide mb-1">Portafolio</h1>
        <p className="text-white/30 text-sm">Diseños "On the Board". Gestiona imágenes, títulos y estados.</p>
      </div>

      <div className="mb-8">
        <ImageUploader bucket="media" folder="portfolio" onUpload={handleUpload} label="Añadir pieza al portafolio" />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <Plus className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <p className="text-white/20 text-sm">No hay piezas. Sube la primera.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => (
            <div
              key={item.id}
              className={`rounded-2xl border overflow-hidden transition-all ${
                item.active ? 'border-white/10 bg-white/[0.03]' : 'border-white/5 opacity-50'
              }`}
            >
              <div className="relative">
                <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                {item.status && (
                  <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[item.status]}`}>
                    {STATUS_OPTIONS.find(o => o.value === item.status)?.label}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-3">
                {editingId === item.id ? (
                  <div className="space-y-2">
                    <input
                      value={editBuf.title ?? ''}
                      onChange={e => setEditBuf(p => ({ ...p, title: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-white/30"
                      placeholder="Título"
                    />
                    <select
                      value={editBuf.status ?? ''}
                      onChange={e => setEditBuf(p => ({ ...p, status: e.target.value as PortfolioItem['status'] }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none"
                    >
                      {STATUS_OPTIONS.map(o => (
                        <option key={o.value} value={o.value} className="bg-[#111]">{o.label}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(item)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-medium">
                        <Save className="w-3 h-3" /> Guardar
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-white/70 text-sm font-medium">{item.title}</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggleActive(item)} className="p-1.5 rounded-lg hover:bg-white/5">
                        {item.active
                          ? <ToggleRight className="w-4 h-4 text-emerald-400" />
                          : <ToggleLeft className="w-4 h-4 text-white/30" />
                        }
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
