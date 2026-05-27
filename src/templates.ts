import { PresetTemplate } from "./types";

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "tech-cyberpunk",
    name: "Cyberpunk Tech",
    description: "Ideale per aggiornamenti tech, programmazione, intelligenza artificiale o crypto.",
    fontTitle: "font-mono tracking-tight font-extrabold uppercase",
    fontBody: "font-mono text-zinc-300",
    slides: [
      {
        title: "IL FUTURO DELL'AI SECONDO I NOSTRI TEST",
        subtitle: "TECH UPDATE",
        body: "Come l'intelligenza artificiale sta ridisegnando le app fullstack in meno di 5 minuti.",
        layout: "headline",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-zinc-950",
          toColor: "to-purple-950",
          pattern: "grid"
        },
        textColor: "text-white",
        accentColor: "#a855f7",
        stickers: [
          { id: "s1", type: "badge", icon: "Sparkles", label: "NEW TECH", x: 10, y: 12, scale: 1.1, rotation: -4, color: "#a855f7" },
          { id: "s2", type: "emoji", icon: "🚀", x: 80, y: 20, scale: 1.3 }
        ],
        filter: "cyber-neon"
      },
      {
        title: "1. GENERARE CODEBASE IN 10 SECONDI",
        subtitle: "LE CAPACITÀ",
        body: "I modelli moderni non solo scrivono software, ne convalidano e spiegano la logica architetturale in tempo reale.",
        layout: "split",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-purple-950",
          toColor: "to-zinc-950",
          pattern: "dots"
        },
        textColor: "text-white",
        accentColor: "#3b82f6",
        stickers: [
          { id: "s3", type: "emoji", icon: "💻", x: 85, y: 80, scale: 1.2 }
        ],
        filter: "cyber-neon"
      },
      {
        title: "«La singolarità tecnologica non è un punto di arrivo, ma una maratona in corso.»",
        subtitle: "CITAZIONE",
        body: "Il segreto per eccellere oggi è imparare a dialogare velocemente con i modelli generativi.",
        layout: "quote",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-zinc-950",
          toColor: "to-zinc-900",
          pattern: "none"
        },
        textColor: "text-slate-100",
        accentColor: "#ec4899",
        stickers: [],
        filter: "cyber-neon"
      },
      {
        title: "SALVA QUESTO POST E INIZIA A PROVARE!",
        subtitle: "CHIAMATA ALL'AZIONE",
        body: "Lascia un commento se hai mai usato un assistente AI per lo sviluppo del tuo prodotto digitale.",
        layout: "centered",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-indigo-950",
          toColor: "to-purple-950",
          pattern: "grid"
        },
        textColor: "text-white",
        accentColor: "#22c55e",
        stickers: [
          { id: "s4", type: "badge", icon: "Flame", label: "SWIPE UP 👉", x: 50, y: 80, scale: 1.2, rotation: 1, color: "#ec4899" }
        ],
        filter: "cyber-neon"
      }
    ]
  },
  {
    id: "coral-minimal",
    name: "Corallo Caldo",
    description: "Perfetto per creator digitali, mindfulness, lifestyle o consigli quotidiani.",
    fontTitle: "font-serif tracking-normal font-bold capitalize",
    fontBody: "font-sans text-neutral-800",
    slides: [
      {
        title: "5 Semplici Abitudini Per Una Mente Chiara",
        subtitle: "BENESSERE",
        body: "Come ritrovare lo spazio mentale in mezzo al caos digitale quotidiano. Bastano 10 minuti di focus.",
        layout: "headline",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-amber-100",
          toColor: "to-rose-100",
          pattern: "waves"
        },
        textColor: "text-slate-900",
        accentColor: "#e11d48",
        stickers: [
          { id: "s5", type: "badge", icon: "Heart", label: "SELF CARE", x: 12, y: 15, scale: 1.1, rotation: 5, color: "#f43f5e" }
        ],
        filter: "warm"
      },
      {
        title: "Consiglio #1: Sveglia Senza Telefono",
        subtitle: "ABITUDINE",
        body: "Evita di controllare le email o i social nei primi 45 minuti del mattino. Nutri i tuoi pensieri personali.",
        layout: "split",
        backgroundStyle: {
          type: "solid",
          fromColor: "from-rose-50",
          solidColor: "#fff1f2",
          pattern: "none"
        },
        textColor: "text-slate-900",
        accentColor: "#d97706",
        stickers: [
          { id: "s6", type: "emoji", icon: "🍵", x: 80, y: 35, scale: 1.3 }
        ],
        filter: "warm"
      },
      {
        title: "Fai Un Respiro Profondo E Riparti.",
        subtitle: "RESPIRA",
        body: "Spesso corriamo per abitudine, non per vera necessità. Rallentare aumenta l'efficacia.",
        layout: "centered",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-rose-100",
          toColor: "to-amber-50",
          pattern: "waves"
        },
        textColor: "text-slate-900",
        accentColor: "#be123c",
        stickers: [],
        filter: "warm"
      }
    ]
  },
  {
    id: "bento-marketing",
    name: "Marketing Bento",
    description: "Organizzazione modulare bento-grid per lanciare prodotti o mostrare dati e grafici.",
    fontTitle: "font-sans font-extrabold tracking-tight",
    fontBody: "font-sans text-stone-200",
    slides: [
      {
        title: "Come Lanciare Un Servizio E Fare Sold-Out",
        subtitle: "LANCIO PRODOTTO",
        body: "Scopri come strutturare la tua offerta irresistibile partendo dai bisogni reali dell'utente.",
        layout: "bento",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-blue-600",
          toColor: "to-indigo-900",
          pattern: "stripes"
        },
        textColor: "text-white",
        accentColor: "#fbbf24",
        stickers: [
          { id: "s7", type: "badge", icon: "Flame", label: "CASE STUDY", x: 15, y: 15, scale: 1.1, color: "#f59e0b" }
        ],
        filter: "none"
      },
      {
        title: "Il Nostro Metodo In 3 Step",
        subtitle: "STRATEGIA",
        body: "Pre-lancio strategico, posizionamento premium e feedback loop rapido con la community.",
        layout: "split",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-indigo-905",
          toColor: "to-slate-900",
          pattern: "grid"
        },
        textColor: "text-white",
        accentColor: "#38bdf8",
        stickers: [
          { id: "s8", type: "emoji", icon: "📈", x: 85, y: 25, scale: 1.3 }
        ],
        filter: "none"
      }
    ]
  },
  {
    id: "emerald-elegant",
    name: "Smeraldo Minimal",
    description: "Design verde foresta lussuoso con accenti oro. Perfetto per finanza, coaching o brand eleganti.",
    fontTitle: "font-serif tracking-wide font-medium italic",
    fontBody: "font-sans text-emerald-100/90",
    slides: [
      {
        title: "L'Arte Del Risparmio Intelligente",
        subtitle: "CRESCITA FINANZIARIA",
        body: "Investire non è per pochi ricchi, ma per chiunque capisca il valore della costanza e degli interessi composti.",
        layout: "centered",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-emerald-950",
          toColor: "to-zinc-950",
          pattern: "none"
        },
        textColor: "text-slate-100",
        accentColor: "#fbbf24",
        stickers: [
          { id: "s9", type: "emoji", icon: "✨", x: 50, y: 15, scale: 1.2 }
        ],
        filter: "duotone-gold"
      },
      {
        title: "«La prima regola del denaro è non perderlo. La seconda regola è non dimenticare la prima.»",
        subtitle: "WARREN BUFFETT",
        body: "Un consiglio immortale per navigare qualsiasi oscillazione dei mercati globali.",
        layout: "quote",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-zinc-900",
          toColor: "to-emerald-950",
          pattern: "dots"
        },
        textColor: "text-white",
        accentColor: "#f59e0b",
        stickers: [],
        filter: "duotone-gold"
      }
    ]
  },
  {
    id: "neon-pop-glitch",
    name: "Neon Pop Glitch ⚡",
    description: "Post ultra vibranti in tonalità ciano, rosa e viola fluorescente con filtri glitch e stile cyberpunk.",
    fontTitle: "font-sans font-black tracking-widest uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-fuchsia-400",
    fontBody: "font-mono text-zinc-100",
    slides: [
      {
        title: "CREA CONTENUTI CHE FANNO 'DECOLLARE' I SOCIAL",
        subtitle: "GLITCH DESIGN",
        body: "Come forzare l'occhio dello spettatore a fermarsi sul tuo carosello usando contrasti neon ad altissima frequenza.",
        layout: "headline",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-purple-950",
          toColor: "to-fuchsia-950",
          pattern: "grid"
        },
        textColor: "text-white",
        accentColor: "#06b6d4",
        stickers: [
          { id: "s-n1", type: "badge", icon: "Sparkles", label: "VIRAL ENGINE", x: 15, y: 15, scale: 1.1, rotation: -4, color: "#ec4899" },
          { id: "s-n2", type: "emoji", icon: "⚡", x: 80, y: 18, scale: 1.3 }
        ],
        filter: "cyber-neon"
      },
      {
        title: "IL SEGRETO? COLORI COMPLEMENTARI DISCORDANTI",
        subtitle: "REGOLA #1",
        body: "Utilizza accostamenti ciano (#06b6d4) e fucsia (#d946ef) che creano vibrazione ottica istantanea nel feed d'Instagram.",
        layout: "split",
        backgroundStyle: {
          type: "gradient",
          fromColor: "from-zinc-950",
          toColor: "to-indigo-950",
          pattern: "stripes"
        },
        textColor: "text-cyan-100",
        accentColor: "#ec4899",
        stickers: [
          { id: "s-n3", type: "emoji", icon: "🔮", x: 85, y: 75, scale: 1.25 }
        ],
        filter: "blur-glow"
      }
    ]
  },
  {
    id: "editorial-luxury",
    name: "Editorial Luxury (Onyx & Cream)",
    description: "Eleganza, silenzio visivo e grande respiro spaziale. Perfetto per brand premium, architettura e moda.",
    fontTitle: "font-serif font-light tracking-wide text-zinc-900 border-b border-zinc-200 pb-2 mb-2",
    fontBody: "font-serif text-zinc-800 leading-relaxed font-light",
    slides: [
      {
        title: "L'Essenza Del Silenzio Visivo",
        subtitle: "BRANDING PREMIUM",
        body: "I marchi di lusso non urlano mai. Usano margini generosi, spazi vuoti ed eccellente tipografia serif per imporsi nel subconscio.",
        layout: "quote",
        backgroundStyle: {
          type: "solid",
          fromColor: "from-stone-100",
          solidColor: "#fafaf9",
          pattern: "none"
        },
        textColor: "text-zinc-900",
        accentColor: "#18181b",
        stickers: [],
        filter: "warm"
      },
      {
        title: "Spazio Negativo = Valore Percepito",
        subtitle: "STYLING RULE",
        body: "Abbi il coraggio di lasciare il 60% della slide completamente vuoto. Lo spazio vuoto dice: 'Il mio messaggio è così importante che non serve riempire la pagina'.",
        layout: "centered",
        backgroundStyle: {
          type: "solid",
          fromColor: "from-zinc-50",
          solidColor: "#f4f4f5",
          pattern: "none"
        },
        textColor: "text-zinc-900",
        accentColor: "#d4af37",
        stickers: [
          { id: "s-l1", type: "badge", icon: "Compass", label: "LUXURY DIRECTIVE", x: 50, y: 82, scale: 1.0, color: "#18181b" }
        ],
        filter: "vintage"
      }
    ]
  },
  {
    id: "corporate-brutalist",
    name: "Corporate Brutalist ⊞",
    description: "Post ad altissimo impatto stile brutale svizzero. Grigio cemento, giallo segnale e nero profondo.",
    fontTitle: "font-sans font-black uppercase text-amber-300 tracking-tighter leading-none text-2xl border-l-4 border-amber-400 pl-3",
    fontBody: "font-mono text-zinc-300 antialiased",
    slides: [
      {
        title: "REGOLE RIGIDE PER AGENZIE CHE CRESCONO",
        subtitle: "FAST ACTION",
        body: "Senza fronzoli. Solo fatti strutturati in bento grid ad alto contrasto per comunicare autorità nel mercato B2B.",
        layout: "bento",
        backgroundStyle: {
          type: "solid",
          fromColor: "from-zinc-900",
          solidColor: "#1c1917",
          pattern: "grid"
        },
        textColor: "text-white",
        accentColor: "#f59e0b",
        stickers: [
          { id: "s-b1", type: "badge", icon: "Activity", label: "DATA FACT", x: 12, y: 12, scale: 1.1, color: "#f59e0b" }
        ],
        filter: "none"
      },
      {
        title: "1. ELIMINA LA PAROLACCIA 'PROVARE'",
        subtitle: "STEP ONE",
        body: "Nel business conta solo TESTARE, MISURARE, CORREGGERE o SCALARE. Tutto il resto è rumore accademico.",
        layout: "split",
        backgroundStyle: {
          type: "solid",
          fromColor: "from-zinc-900",
          solidColor: "#0c0a09",
          pattern: "dots"
        },
        textColor: "text-zinc-100",
        accentColor: "#eab308",
        stickers: [
          { id: "s-b2", type: "emoji", icon: "👁️", x: 80, y: 40, scale: 1.4 }
        ],
        filter: "grayscale"
      }
    ]
  }
];
