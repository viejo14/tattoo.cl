import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  // Helper to get nested translation keys like 'hero.title'
  const t = (path: string) => {
    const keys = path.split('.');
    let result: any = translations[language];
    
    for (const key of keys) {
      if (result[key] === undefined) return path;
      result = result[key];
    }
    
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations: any = {
  es: {
    nav: {
      artist: "Artista",
      portfolio: "Portafolio",
      booking: "Reservar",
      button: "Agendar Cita"
    },
    hero: {
      title_part1: "El tipo de tatuaje",
      title_italic: "del que no te arrepentirás.",
      subtitle: "Oscuro, Surrealista y Diseñado a Medida para Ti.",
      btn_work: "Ver Trabajo del Artista",
      btn_book: "Reservar Consulta"
    },
    artist: {
      meet: "Conoce",
      the_artist: "Al Artista",
      features: [
        {
          title: "Diseños personalizados adaptados a tu visión y flujo corporal.",
          desc: "Cada pieza se dibuja desde cero, asegurando un ajuste perfecto y una obra de arte única."
        },
        {
          title: "Más de 10 años de experiencia con reconocimiento internacional.",
          desc: "Especializado en realismo oscuro, surrealismo y blackwork intrincado."
        },
        {
          title: "Un espacio seguro e inclusivo con los más altos estándares de higiene.",
          desc: "Tu comodidad y seguridad son tan importantes como el tatuaje final."
        }
      ]
    },
    gallery: {
      title: "En El",
      board: "Tablero",
      notes: {
        sold: "Vendido",
        available: "Disponible",
        reserved: "Reservado",
        new: "Nuevo"
      }
    },
    timeline: {
      title_part1: "De la Idea",
      title_part2: "A la Tinta",
      subtitle: "Cada tatuaje es un viaje colaborativo. Desde la chispa inicial de una idea hasta las etapas finales de curación, aseguro un proceso fluido, transparente y emocionante.",
      steps: [
        {
          title: "Consulta",
          desc: "Una breve reunión para discutir tu concepto, ubicación y tamaño. Esbozaremos la dirección artística y estableceremos expectativas realistas."
        },
        {
          title: "Diseño y Refinamiento",
          desc: "Basado en nuestra consulta, dibujaré un diseño personalizado. Tendrás la oportunidad de revisar y solicitar ajustes."
        },
        {
          title: "La Sesión de Tatuaje",
          desc: "¡El día ha llegado! En un ambiente limpio y cómodo, aplicaremos el stencil y daremos vida a la obra de arte."
        },
        {
          title: "Curación y Cuidados",
          desc: "La curación adecuada es crucial. Proporcionaré instrucciones detalladas y bálsamos premium para asegurar una curación vibrante."
        }
      ]
    },
    faq: {
      title_part1: "Preguntas",
      title_part2: "Frecuentes",
      questions: [
        {
          question: "¿Cuánto costará mi tatuaje?",
          answer: "El precio depende del tamaño, detalle y ubicación. Cobro por hora para piezas grandes y tarifas fijas para diseños pequeños."
        },
        {
          question: "¿Haces coberturas (coverups)?",
          answer: "Sí, las coberturas son posibles dependiendo del tatuaje existente. Necesitaremos verlo en persona para discutir las opciones."
        },
        {
          question: "Sobre el proceso de depósito",
          answer: "Se requiere un depósito no reembolsable para asegurar tu reserva, el cual se descuenta del costo final del tatuaje."
        },
        {
          question: "Sobre diseños personalizados",
          answer: "Todos los diseños son completamente personalizados. No copio el trabajo de otros artistas. Puedes traer referencias."
        },
        {
          question: "¿Es amigable para veganos?",
          answer: "Absolutamente. Utilizo tintas 100% veganas y bálsamos de cuidado posterior veganos."
        },
        {
          question: "¿Dolerá mucho?",
          answer: "El dolor es subjetivo. Sin embargo, el ambiente de mi estudio está diseñado para mantenerte relajado y cómodo."
        }
      ]
    },
    contact: {
      title_part1: "Creemos Algo",
      title_part2: "Permanente.",
      subtitle: "Para reservar una cita o discutir tus ideas, por favor completa el formulario a continuación. Normalmente respondo en 48 horas.",
      cards: {
        location: "Estudio Local",
        portfolio: "Portafolio",
        direct: "Info Directa"
      },
      form: {
        name: "Nombre",
        name_placeholder: "Ingresa tu nombre completo",
        email: "Correo Electrónico",
        email_placeholder: "tu@correo.com",
        message: "Tu Idea",
        message_placeholder: "Ubicación, tamaño, estilo, referencias...",
        submit: "Enviar Solicitud"
      }
    },
    footer: {
      desc: "Creemos algo permanente. Diseños personalizados y ejecución profesional en un ambiente acogedor.",
      rights: "© 2026 Tattoo Studio. Todos los derechos reservados.",
      privacy: "Privacidad",
      terms: "Términos"
    }
  },
  en: {
    nav: {
      artist: "Artist",
      portfolio: "Portfolio",
      booking: "Booking",
      button: "Book Appointment"
    },
    hero: {
      title_part1: "The Kind of Tattoo",
      title_italic: "You Won't Regret.",
      subtitle: "Dark, Surreal & Custom-Designed Just For You.",
      btn_work: "View Artist Work",
      btn_book: "Book Consultation"
    },
    artist: {
      meet: "Meet",
      the_artist: "The Artist",
      features: [
        {
          title: "Custom designs tailored to your vision and body flow.",
          desc: "Every piece is drawn from scratch, ensuring a perfect fit and unique artwork."
        },
        {
          title: "Over 10 years of experience with international recognition.",
          desc: "Specializing in dark realism, surrealism, and intricate blackwork."
        },
        {
          title: "A safe, inclusive space with the highest hygiene standards.",
          desc: "Your comfort and safety are just as important as the final tattoo."
        }
      ]
    },
    gallery: {
      title: "On The",
      board: "Board",
      notes: {
        sold: "Sold",
        available: "Available",
        reserved: "Reserved",
        new: "New"
      }
    },
    timeline: {
      title_part1: "From Idea",
      title_part2: "To Ink",
      subtitle: "Every tattoo is a collaborative journey. From the initial spark of an idea to the final healing stages, I ensure a smooth, transparent, and exciting process.",
      steps: [
        {
          title: "Consultation",
          desc: "A brief meeting to discuss your concept, placement, and size. We'll outline the artistic direction and set realistic expectations."
        },
        {
          title: "Design & Refinement",
          desc: "Based on our consultation, I'll sketch a custom design. You'll have the opportunity to review and request adjustments."
        },
        {
          title: "The Tattoo Session",
          desc: "The day has arrived! In a clean, comfortable environment, we'll apply the stencil and bring the artwork to life."
        },
        {
          title: "Healing & Aftercare",
          desc: "Proper healing is crucial for longevity. I'll provide detailed aftercare instructions and premium balms."
        }
      ]
    },
    faq: {
      title_part1: "Frequently",
      title_part2: "Asked Questions",
      questions: [
        {
          question: "How much will my tattoo cost?",
          answer: "Pricing depends on size, detail, and placement. I charge by the hour for large pieces and give flat rates for smaller designs."
        },
        {
          question: "Do you do coverups?",
          answer: "Yes, coverups are possible depending on the existing tattoo. We will need to see it in person to discuss options."
        },
        {
          question: "About the deposit process",
          answer: "A non-refundable deposit is required to secure your booking and goes towards the final cost of the tattoo."
        },
        {
          question: "About custom designs",
          answer: "All designs are completely custom. I do not copy other artists' work. You can bring references."
        },
        {
          question: "Is it vegan friendly?",
          answer: "Absolutely. I use 100% vegan inks, cruelty-free stencil application products, and vegan aftercare balms."
        },
        {
          question: "How will it hurt?",
          answer: "Pain is subjective and varies by placement and individual tolerance. My studio is designed to keep you relaxed."
        }
      ]
    },
    contact: {
      title_part1: "Let's Create",
      title_part2: "Something Permanent.",
      subtitle: "To book an appointment or discuss your ideas, please fill out the form below. I typically reply within 48 hours.",
      cards: {
        location: "Local Studio",
        portfolio: "Portfolio",
        direct: "Direct Info"
      },
      form: {
        name: "Name",
        name_placeholder: "Enter your full name",
        email: "Email Address",
        email_placeholder: "your@email.com",
        message: "Your Idea",
        message_placeholder: "Placement, size, style, references...",
        submit: "Submit Request"
      }
    },
    footer: {
      desc: "Let's create something permanent. Custom designs and professional execution in a welcoming environment.",
      rights: "© 2026 Tattoo Studio. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service"
    }
  }
};
