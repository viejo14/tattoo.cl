import React, { createContext, useContext, useState, useEffect } from 'react';
import type { HeroSlide, ArtistInfo, PortfolioItem, FaqItem, ContactSettings } from '../lib/supabaseClient';

interface PreviewData {
  hero_slides: HeroSlide[];
  artist_info: ArtistInfo | null;
  portfolio_items: PortfolioItem[];
  faqs: FaqItem[];
  contact_settings: ContactSettings | null;
}

interface PreviewContextType {
  isPreviewMode: boolean;
  setPreviewMode: (val: boolean) => void;
  previewData: PreviewData;
  updatePreview: (section: keyof PreviewData, data: any) => void;
  clearPreview: () => void;
}

const DEFAULT_DATA: PreviewData = {
  hero_slides: [],
  artist_info: null,
  portfolio_items: [],
  faqs: [],
  contact_settings: null,
};

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [isPreviewMode, setIsPreviewMode] = useState(() => {
    return sessionStorage.getItem('demo_mode') === 'true';
  });

  const [previewData, setPreviewData] = useState<PreviewData>(() => {
    const saved = sessionStorage.getItem('demo_data');
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });

  useEffect(() => {
    sessionStorage.setItem('demo_mode', isPreviewMode.toString());
  }, [isPreviewMode]);

  useEffect(() => {
    sessionStorage.setItem('demo_data', JSON.stringify(previewData));
  }, [previewData]);

  const setPreviewMode = (val: boolean) => {
    setIsPreviewMode(val);
    if (!val) {
      sessionStorage.removeItem('demo_mode');
    }
  };

  const updatePreview = (section: keyof PreviewData, data: any) => {
    setPreviewData(prev => ({ ...prev, [section]: data }));
  };

  const clearPreview = () => {
    setPreviewData(DEFAULT_DATA);
    sessionStorage.removeItem('demo_data');
  };

  return (
    <PreviewContext.Provider value={{ isPreviewMode, setPreviewMode, previewData, updatePreview, clearPreview }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (context === undefined) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
}
