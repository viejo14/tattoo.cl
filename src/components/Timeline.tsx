import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function Timeline() {
  const { t } = useLanguage();
  
  const steps = t('timeline.steps');

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10 overflow-hidden">
      
      {/* Left side text */}
      <div className="w-full lg:w-1/3 lg:sticky top-40 self-start z-20">
        <motion.h2 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl lg:text-[5rem] font-serif text-white leading-[0.9] tracking-tight mb-8"
        >
          {t('timeline.title_part1')}<br/> {t('timeline.title_part2')}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted text-sm leading-relaxed max-w-sm"
        >
          {t('timeline.subtitle')}
        </motion.p>
      </div>

      {/* Right side timeline */}
      <div className="w-full lg:w-2/3 relative flex flex-col gap-12 md:gap-20 py-10">
        
        {/* The dotted path (visible on desktop mostly) */}
        <div className="absolute top-[80px] bottom-[80px] left-[50%] md:left-[45%] w-px border-l-2 border-dotted border-red-500/40 -z-10" />

        {steps.map((step: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50, y: 30 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: idx * 0.1 }}
            className={`flex w-full relative ${idx % 2 === 0 ? 'justify-end lg:justify-start lg:ml-[15%]' : 'justify-start lg:justify-end lg:mr-[15%]'}`}
          >
            <motion.div 
              whileHover={{ scale: 1.02, rotate: 0 }}
              className="relative bg-[#eeeade] text-black w-full max-w-md p-6 md:p-8 rounded-sm shadow-2xl transition-transform duration-500"
              style={{ rotate: idx % 2 === 0 ? '1deg' : '-1deg' }}
            >
              
              {/* Red Pin */}
              <div 
                className="absolute -top-3 w-6 h-6 bg-red-600 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.4),0_4px_6px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center border border-red-800"
                style={{ left: idx % 2 === 0 ? '-12px' : 'auto', right: idx % 2 === 0 ? 'auto' : '-12px' }}
              >
                <div className="w-2 h-2 bg-white/40 rounded-full mb-1 ml-1" />
              </div>
              
              {/* Number indicator */}
              <div className="absolute top-4 right-5 text-black/10 font-serif text-5xl italic leading-none pointer-events-none select-none">
                0{idx + 1}
              </div>

              <h4 className="text-xl font-serif font-bold mb-4 tracking-wide text-neutral-900 w-4/5">{step.title}</h4>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">{step.desc}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
