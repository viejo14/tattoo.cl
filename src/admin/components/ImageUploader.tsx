import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { usePreview } from '../../context/PreviewContext';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';

interface Props {
  bucket: string;
  folder: string;
  onUpload: (url: string) => void;
  label?: string;
  accept?: string;
}

export default function ImageUploader({ bucket, folder, onUpload, label = 'Subir imagen', accept = 'image/*' }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { isPreviewMode } = usePreview();

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    if (isPreviewMode) {
      // Sandbox Mode: Use local blob URL
      await new Promise(r => setTimeout(r, 800)); // Fake realistic delay
      const localUrl = URL.createObjectURL(file);
      onUpload(localUrl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setUploading(false);
      return;
    }

    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    onUpload(data.publicUrl);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setUploading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [isPreviewMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      <label
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center gap-3 w-full p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all
          ${dragging ? 'border-white/40 bg-white/5' : 'border-white/10 hover:border-white/25 hover:bg-white/[0.02]'}
        `}
      >
        <input type="file" accept={accept} onChange={handleChange} className="sr-only" />

        {uploading ? (
          <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
        ) : success ? (
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        ) : (
          <Upload className="w-8 h-8 text-white/30" />
        )}

        <p className="text-sm text-white/40 text-center">
          {uploading ? 'Subiendo...' : success ? '¡Imagen subida!' : (
            <><span className="text-white/70 font-medium">{label}</span><br />Arrastra o haz clic</>
          )}
        </p>
      </label>

      {error && (
        <div className="flex items-center gap-2 mt-3 text-red-400 text-xs p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          <X className="w-3 h-3 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
