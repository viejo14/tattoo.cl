import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface Props {
  children: React.ReactNode;
}

import { usePreview } from '../../context/PreviewContext';

export default function ProtectedRoute({ children }: Props) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const { isPreviewMode } = usePreview();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Allow access if we have a real session OR if we are in Sandbox Mode
  if (isPreviewMode) return <>{children}</>;

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
