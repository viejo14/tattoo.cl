import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { FaqItem } from '../../lib/supabaseClient';
import { usePreview } from '../../context/PreviewContext';
import { Loader2, Plus, Trash2, Save, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

const emptyFaq = (): Omit<FaqItem, 'id'> => ({
  question_es: '', answer_es: '', question_en: '', answer_en: '', order: 0, active: true,
});

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newFaq, setNewFaq] = useState(emptyFaq());
  const [saving, setSaving] = useState(false);
  const { isPreviewMode, previewData, updatePreview } = usePreview();

  useEffect(() => {
    if (isPreviewMode) {
      setFaqs(previewData.faqs);
      setLoading(false);
      return;
    }
    supabase.from('faqs').select('*').order('order')
      .then(({ data }) => { setFaqs(data ?? []); setLoading(false); });
  }, [isPreviewMode, previewData.faqs]);

  const handleAdd = async () => {
    setSaving(true);
    const order = faqs.length > 0 ? Math.max(...faqs.map(f => f.order)) + 1 : 0;
    
    if (isPreviewMode) {
      const newItem: FaqItem = { ...newFaq, id: crypto.randomUUID(), order };
      updatePreview('faqs', [...faqs, newItem]);
      setNewFaq(emptyFaq());
      setAdding(false);
      setSaving(false);
      return;
    }

    const { data } = await supabase.from('faqs').insert({ ...newFaq, order }).select().single();
    if (data) { setFaqs(prev => [...prev, data]); setNewFaq(emptyFaq()); setAdding(false); }
    setSaving(false);
  };

  const handleUpdate = async (faq: FaqItem) => {
    if (isPreviewMode) {
      const updated = faqs.map(f => f.id === faq.id ? faq : f);
      updatePreview('faqs', updated);
      return;
    }
    await supabase.from('faqs').update(faq).eq('id', faq.id);
    setFaqs(prev => prev.map(f => f.id === faq.id ? faq : f));
  };

  const handleDelete = async (id: string) => {
    if (isPreviewMode) {
      updatePreview('faqs', faqs.filter(f => f.id !== id));
      if (expandedId === id) setExpandedId(null);
      return;
    }
    await supabase.from('faqs').delete().eq('id', id);
    setFaqs(prev => prev.filter(f => f.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {isPreviewMode && (
        <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-500 text-sm font-medium">Modo Sandbox Activo</p>
            <p className="text-amber-500/60 text-xs">Puedes añadir y editar preguntas frecuentes de prueba.</p>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white tracking-wide mb-1">FAQs</h1>
          <p className="text-white/30 text-sm">Preguntas frecuentes en español e inglés.</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Añadir
        </button>
      </div>

      {/* Add new FAQ form */}
      {adding && (
        <div className="mb-6 p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4">
          <p className="text-white/50 text-xs uppercase tracking-widest font-medium">Nueva pregunta</p>
          {(['es', 'en'] as const).map(lang => (
            <div key={lang} className="space-y-2">
              <p className="text-white/30 text-xs uppercase tracking-wider">{lang === 'es' ? '🇨🇱 Español' : '🇺🇸 English'}</p>
              <input
                value={newFaq[`question_${lang}`]}
                onChange={e => setNewFaq(p => ({ ...p, [`question_${lang}`]: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30"
                placeholder="Pregunta..."
              />
              <textarea
                value={newFaq[`answer_${lang}`]}
                onChange={e => setNewFaq(p => ({ ...p, [`answer_${lang}`]: e.target.value }))}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30 resize-none"
                placeholder="Respuesta..."
              />
            </div>
          ))}
          <button onClick={handleAdd} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Guardar FAQ'}
          </button>
        </div>
      )}

      {faqs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <p className="text-white/20 text-sm">No hay FAQs. Añade la primera.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map(faq => (
            <div key={faq.id} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <p className="text-white/70 text-sm flex-1">{faq.question_es || <span className="text-white/25 italic">Sin pregunta</span>}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(faq.id); }}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {expandedId === faq.id ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                </div>
              </button>

              {expandedId === faq.id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                  {(['es', 'en'] as const).map(lang => (
                    <div key={lang} className="space-y-2">
                      <p className="text-white/30 text-xs uppercase tracking-wider">{lang === 'es' ? '🇨🇱 Español' : '🇺🇸 English'}</p>
                      <input
                        value={faq[`question_${lang}`]}
                        onChange={e => handleUpdate({ ...faq, [`question_${lang}`]: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30"
                        placeholder="Pregunta..."
                      />
                      <textarea
                        value={faq[`answer_${lang}`]}
                        onChange={e => handleUpdate({ ...faq, [`answer_${lang}`]: e.target.value })}
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30 resize-none"
                        placeholder="Respuesta..."
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => handleUpdate(faq)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 text-xs"
                  >
                    <Save className="w-3 h-3" /> Guardar cambios
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
