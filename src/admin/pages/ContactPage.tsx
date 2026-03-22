import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { ContactSettings } from '../../lib/supabaseClient';
import { Loader2, Save, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const fields: { key: keyof Omit<ContactSettings, 'id'>; label: string; placeholder: string; icon: React.ElementType }[] = [
  { key: 'instagram', label: 'Instagram', placeholder: '@tattoo.studio', icon: Instagram },
  { key: 'email', label: 'Email', placeholder: 'contacto@tattoo.cl', icon: Mail },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: '+56 9 1234 5678', icon: Phone },
  { key: 'address', label: 'Dirección', placeholder: 'Santiago, Chile', icon: MapPin },
];

export default function ContactPage() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('contact_settings').select('*').limit(1).single()
      .then(({ data }) => { setSettings(data); setLoading(false); });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { id, ...rest } = settings;
    if (id) {
      await supabase.from('contact_settings').update(rest).eq('id', id);
    } else {
      const { data } = await supabase.from('contact_settings').insert(rest).select().single();
      if (data) setSettings(data);
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

  const data = settings ?? { id: '', instagram: null, email: null, whatsapp: null, address: null };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white tracking-wide mb-1">Contacto</h1>
        <p className="text-white/30 text-sm">Datos de contacto mostrados en el footer y sección de contacto.</p>
      </div>

      <div className="space-y-5">
        {fields.map(({ key, label, placeholder, icon: Icon }) => (
          <div key={key}>
            <label className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest mb-2">
              <Icon className="w-3.5 h-3.5" /> {label}
            </label>
            <input
              type="text"
              value={data[key] ?? ''}
              onChange={e => setSettings({ ...data, [key]: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm"
              placeholder={placeholder}
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-sm font-medium uppercase tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50 mt-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
