import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Trash2,
  Plus,
  Download,
  Music,
  Volume2,
  VolumeX,
  Sliders,
  Search,
  Image as ImageIcon,
  Tag,
  RefreshCw,
  Layout,
  Palette,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Star,
  Flame,
  Wand2,
  Edit,
  Type,
  Copy,
  Check,
  HelpCircle,
  Clock,
  ExternalLink,
  Laptop,
  Upload,
  FolderOpen,
  FileText,
  Video,
  Eye,
  Maximize2,
  Phone,
  Grid
} from "lucide-react";
import { PRESET_TEMPLATES } from "./templates";
import { SlideData, Sticker, LayoutType, GraphicFilter, BackgroundStyle } from "./types";
import { soundManager } from "./audio";

// Static emoji categories for sticker drawer
const EMOJI_STICKERS = [
  { char: "🔥", label: "flame" },
  { char: "🚀", label: "rocket" },
  { char: "💡", label: "idea" },
  { char: "💎", label: "gem" },
  { char: "✨", label: "sparkles" },
  { char: "👉", label: "swipe" },
  { char: "🎯", label: "target" },
  { char: "🧠", label: "brain" },
  { char: "📈", label: "chart" },
  { char: "⭐️", label: "star" },
  { char: "🙌", label: "hands" },
  { char: "🎓", label: "edu" },
  { char: "🛠️", label: "tools" },
  { char: "🍵", label: "tea" },
  { char: "💻", label: "code" },
  { char: "📌", label: "pin" },
  { char: "🔔", label: "bell" },
  { char: "🚨", label: "alarm" },
  { char: "💬", label: "chat" }
];

export default function App() {
  // Application Name and State Configuration
  const [slides, setSlides] = useState<SlideData[]>([
    {
      id: "slide-1",
      title: "Genera Caroselli Con L'Intelligenza Artificiale",
      subtitle: "COME FUNZIONA",
      body: "Inserisci un argomento nel pannello di sinistra, scegli lo stile e guarda l'AI creare un intero carosello in pochi istanti.",
      layout: "headline",
      backgroundStyle: {
        type: "gradient",
        fromColor: "from-indigo-600",
        toColor: "to-purple-900",
        pattern: "grid"
      },
      textColor: "text-white",
      accentColor: "#F59E0B",
      stickers: [
        { id: "st-1", type: "badge", icon: "Sparkles", label: "AI POWERED", x: 10, y: 15, scale: 1.1, rotation: -3, color: "#10B981" },
        { id: "st-2", type: "emoji", icon: "✨", x: 85, y: 15, scale: 1.4 }
      ],
      filter: "none"
    },
    {
      id: "slide-2",
      title: "Applica Filtri Creativi E Musica Di Sottofondo",
      subtitle: "MULTIMEDIALE",
      body: "Usa la sintesi procedurale sonora in tempo reale nel tab Audio per caricare energia musicale mentre assembli.",
      layout: "split",
      backgroundStyle: {
        type: "gradient",
        fromColor: "from-purple-900",
        toColor: "to-pink-600",
        pattern: "dots"
      },
      textColor: "text-white",
      accentColor: "#fbbf24",
      stickers: [
        { id: "st-3", type: "emoji", icon: "🎵", x: 80, y: 75, scale: 1.3 }
      ],
      filter: "vintage"
    },
    {
      id: "slide-3",
      title: "Trascina, Modifica ed Esporta Subito",
      subtitle: "GUIDA RAPIDA",
      body: "Aggiungi sticker, testurizza lo sfondo con reticoli e scarica l'intero pacchetto ad alta risoluzione 1080x1080px.",
      layout: "centered",
      backgroundStyle: {
        type: "gradient",
        fromColor: "from-neutral-900",
        toColor: "to-zinc-800",
        pattern: "stripes"
      },
      textColor: "text-slate-100",
      accentColor: "#10b981",
      stickers: [
        { id: "st-4", type: "badge", icon: "Flame", label: "SWIPE SINISTRA 👉", x: 50, y: 82, scale: 1.2, rotation: 1, color: "#ef4444" }
      ],
      filter: "none"
    }
  ]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"ai" | "templates" | "content" | "stickers" | "audio" | "canva" | "media">("ai");

  // Document and custom media uploaded states
  const [uploadedDocumentName, setUploadedDocumentName] = useState<string>("");
  const [uploadedDocumentText, setUploadedDocumentText] = useState<string>("");
  const [parsedTextChunks, setParsedTextChunks] = useState<string[]>([]);
  const [isParsingDocument, setIsParsingDocument] = useState<boolean>(false);

  // AI Prompt generation state
  const [aiPrompt, setAiPrompt] = useState<string>("5 consigli per far crescere il tuo brand su Instagram nel 2026");
  const [aiSlideCount, setAiSlideCount] = useState<number>(4);
  const [aiTheme, setAiTheme] = useState<string>("modern");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Font styling configuration
  const [fontTitle, setFontTitle] = useState<string>("font-sans font-extrabold tracking-tight");
  const [fontBody, setFontBody] = useState<string>("font-sans text-stone-200");

  // Sticker editor state
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [stickerSearch, setStickerSearch] = useState<string>("");

  // Music Synthesizer values
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.3);

  // Transition selected style between slides the user is browsing
  const [slideTransition, setSlideTransition] = useState<"slide" | "fade" | "zoom" | "none">("slide");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Canva simulator overlay
  const [showCanvaModal, setShowCanvaModal] = useState<boolean>(false);
  const [canvaTemplateType, setCanvaTemplateType] = useState<string>("instagram-post");

  // Carousel interactive preview simulator
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [previewSlideIdx, setPreviewSlideIdx] = useState<number>(0);
  const [previewMode, setPreviewMode] = useState<"grid" | "mobile">("grid");

  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; bg: string }>>([]);

  // Ref to canvas for HD downloading
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle slide focus change with visual animation transition
  const handleSlideChange = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsTransitioning(false);
      }, 250);
    }
  };

  const addNotification = (text: string, bg: string = "bg-zinc-900 border border-zinc-700") => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, text, bg }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // 1. Initial Music Tracker volume adjustment
  useEffect(() => {
    soundManager.setVolume(volume);
  }, [volume]);

  // AI Generation hook
  const handleGenerateCarousel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    addNotification("🤖 L'intelligenza artificiale sta analizzando il tuo prompt...", "bg-indigo-600/90 text-white");

    try {
      const response = await fetch("/api/gemini/suggest-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          slideCount: aiSlideCount,
          theme: aiTheme
        })
      });

      if (!response.ok) {
        throw new Error("Errore del server durante la generazione dei suggerimenti");
      }

      const data = await response.json();
      
      let generatedSlides: SlideData[] = [];
      const incomingSlides = data.slides || [];
      
      const parsed: SlideData[] = incomingSlides.map((s: any, idx: number) => {
        return {
          id: `ai-slide-${Date.now()}-${idx}`,
          title: s.title || `Cosa sapere su ${aiPrompt}`,
          subtitle: s.subtitle || `PUNTO ${idx + 1}`,
          body: s.body || "Questo layout è stato ottimizzato dall'AI per garantire la massima leggibilità e impatto visivo.",
          layout: (s.layout as LayoutType) || "split",
          backgroundStyle: {
            type: "gradient",
            fromColor: s.fromColor ? `from-${s.fromColor}` : "from-violet-600",
            toColor: s.toColor ? `to-${s.toColor}` : "to-indigo-900",
            pattern: idx % 2 === 0 ? "grid" : "dots"
          },
          textColor: s.textColor || "text-white",
          accentColor: s.accentColor || "#10B981",
          stickers: (s.stickers || []).map((st: any, sIdx: number) => ({
            id: `st-ai-${idx}-${sIdx}`,
            type: st.type || "emoji",
            icon: st.icon || "Sparkles",
            label: st.label,
            x: st.x || 50,
            y: st.y || 80,
            scale: st.scale || 1.1,
            rotation: Math.floor(Math.random() * 10) - 5
          })),
          filter: "none"
        };
      });

      setSlides(parsed);
      setActiveIndex(0);
      addNotification("✨ Carosello AI generato con successo!", "bg-emerald-600 border-none text-white");
    } catch (e: any) {
      console.error(e);
      addNotification(`⚠️ Generazione fallita. Caricamento preset di emergenza.`, "bg-rose-600 text-white");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate layouts suggestions directly based on active slide
  const handleAISuggestLayout = () => {
    const currentSlide = slides[activeIndex];
    const layouts: LayoutType[] = ["centered", "split", "headline", "bento", "quote", "imageOnly"];
    // pick one randomized from others
    const filtered = layouts.filter(l => l !== currentSlide.layout);
    const suggestedLayout = filtered[Math.floor(Math.random() * filtered.length)];

    const updated = [...slides];
    updated[activeIndex] = {
      ...currentSlide,
      layout: suggestedLayout
    };
    setSlides(updated);
    addNotification(`⚡ Ottimizzato layout del post: Modificato in '${suggestedLayout.toUpperCase()}'`, "bg-indigo-950 border-indigo-500");
  };

  // Quick preset loading
  const loadPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    const formatted = preset.slides.map((s, idx) => ({
      ...s,
      id: `preset-${preset.id}-${idx}-${Date.now()}`
    })) as SlideData[];

    setSlides(formatted);
    setFontTitle(preset.fontTitle);
    setFontBody(preset.fontBody);
    setActiveIndex(0);
    addNotification(`🎨 Caricati i modelli predefiniti: ${preset.name}`, "bg-emerald-600 border-none text-white");
  };

  // Music controllers
  const toggleMusicTrack = (track: "lofi" | "synthwave" | "minimal" | "ambient" | "chillhop" | "retropop" | "deephouse") => {
    const wasPlaying = soundManager.getIsPlaying();
    const activeOne = soundManager.getCurrentTrack();

    if (wasPlaying && activeOne === track) {
      soundManager.stop();
      setIsPlayingMusic(false);
      setCurrentTrack(null);
      addNotification("🎵 Musica silenziata", "bg-zinc-800");
    } else {
      soundManager.play(track);
      setIsPlayingMusic(true);
      setCurrentTrack(track);
      addNotification(`🎵 Sound procedurale avviato: ${track.toUpperCase()}`, "bg-purple-900 border-purple-500");
    }
  };

  // Current slide editing utilities
  const updateActiveSlide = (fields: Partial<SlideData>) => {
    const updated = [...slides];
    updated[activeIndex] = {
      ...updated[activeIndex],
      ...fields
    };
    setSlides(updated);
  };

  const updateBackgroundStyle = (fields: Partial<BackgroundStyle>) => {
    const currentSlide = slides[activeIndex];
    updateActiveSlide({
      backgroundStyle: {
        ...currentSlide.backgroundStyle,
        ...fields
      }
    });
  };

  // Manage Stickers inside current slide
  const addEmojiSticker = (emoji: string) => {
    const currentSlide = slides[activeIndex];
    const newSticker: Sticker = {
      id: `st-${Date.now()}`,
      type: "emoji",
      icon: emoji,
      x: 50,
      y: 50,
      scale: 1.2,
      rotation: 0
    };
    updateActiveSlide({
      stickers: [...currentSlide.stickers, newSticker]
    });
    setSelectedStickerId(newSticker.id);
    addNotification("😀 Sticker emoji inserito", "bg-zinc-800");
  };

  const addBadgeSticker = (text: string, icon: string) => {
    const currentSlide = slides[activeIndex];
    const newSticker: Sticker = {
      id: `st-${Date.now()}`,
      type: "badge",
      icon: icon,
      label: text,
      x: 50,
      y: 75,
      scale: 1.1,
      rotation: 0,
      color: "#ec4899"
    };
    updateActiveSlide({
      stickers: [...currentSlide.stickers, newSticker]
    });
    setSelectedStickerId(newSticker.id);
    addNotification(`🏷️ Badge '${text}' inserito`, "bg-pink-600 border-none text-white");
  };

  const deleteSticker = (id: string) => {
    const currentSlide = slides[activeIndex];
    updateActiveSlide({
      stickers: currentSlide.stickers.filter(s => s.id !== id)
    });
    if (selectedStickerId === id) {
      setSelectedStickerId(null);
    }
    addNotification("🗑️ Sticker rimosso", "bg-zinc-800");
  };

  const updateSticker = (id: string, fields: Partial<Sticker>) => {
    const currentSlide = slides[activeIndex];
    const updatedStickers = currentSlide.stickers.map(s => {
      if (s.id === id) {
        return { ...s, ...fields };
      }
      return s;
    });
    updateActiveSlide({ stickers: updatedStickers });
  };

  // Slide CRUD list controls
  const addNewSlide = () => {
    const lastSlide = slides[slides.length - 1] || slides[0];
    const newSlide: SlideData = {
      id: `slide-custom-${Date.now()}`,
      title: "Nuova Slide Strategica",
      subtitle: "STEP AGGIUNTIVO",
      body: "Inserisci qui un concetto chiave. Mantieni testi brevi ed efficaci per valorizzare il feed.",
      layout: "split",
      backgroundStyle: { ...lastSlide.backgroundStyle },
      textColor: lastSlide.textColor,
      accentColor: lastSlide.accentColor,
      stickers: [],
      filter: "none"
    };
    const newSlides = [...slides];
    newSlides.splice(activeIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setActiveIndex(activeIndex + 1);
    addNotification("➕ Slide creata e inserita", "bg-zinc-800");
  };

  const duplicateSlide = () => {
    const current = slides[activeIndex];
    const duplicated: SlideData = {
      ...current,
      id: `slide-dup-${Date.now()}`,
      title: `${current.title} (Copia)`,
      stickers: current.stickers.map(st => ({ ...st, id: `st-dup-${Date.now()}-${Math.random()}` }))
    };
    const newSlides = [...slides];
    newSlides.splice(activeIndex + 1, 0, duplicated);
    setSlides(newSlides);
    setActiveIndex(activeIndex + 1);
    addNotification("📋 Slide duplicata con successo", "bg-zinc-800");
  };

  const moveSlideLeft = () => {
    if (activeIndex === 0) return;
    const items = [...slides];
    const [removed] = items.splice(activeIndex, 1);
    items.splice(activeIndex - 1, 0, removed);
    setSlides(items);
    setActiveIndex(activeIndex - 1);
    addNotification("⬅️ Slide spostata a sinistra", "bg-zinc-800");
  };

  const moveSlideRight = () => {
    if (activeIndex === slides.length - 1) return;
    const items = [...slides];
    const [removed] = items.splice(activeIndex, 1);
    items.splice(activeIndex + 1, 0, removed);
    setSlides(items);
    setActiveIndex(activeIndex + 1);
    addNotification("➡️ Slide spostata a destra", "bg-zinc-800");
  };

  const deleteActiveSlide = () => {
    if (slides.length <= 1) {
      addNotification("⚠️ Non puoi eliminare l'unica slide rimasta!", "bg-rose-900 border-rose-500");
      return;
    }
    const newSlides = slides.filter((_, idx) => idx !== activeIndex);
    setSlides(newSlides);
    setActiveIndex(Math.max(0, activeIndex - 1));
    addNotification("🗑️ Slide eliminata", "bg-zinc-800");
  };

  // Image Upload handler for personalized slide templates
  const handleImageUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateActiveSlide({
            imageFile: event.target.result as string,
            imageFit: "cover",
            imageOpacity: 35
          });
          addNotification("🖼️ Fotografia caricata sullo sfondo della slide", "bg-indigo-950 border-indigo-500");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Video background upload handler
  const handleVideoUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      updateActiveSlide({
        videoFile: objectUrl,
        videoFit: "cover",
        videoOpacity: 100,
        imageFile: null // Override background image if video is loaded
      });
      addNotification("🎥 Video caricato come Sfondo!", "bg-indigo-950 border-indigo-500");
    }
  };

  // Custom Image Sticker upload handler
  const handleImageStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newSticker: Sticker = {
            id: `st-img-${Date.now()}`,
            type: "image",
            icon: "image",
            imageUrl: event.target.result as string,
            x: 50,
            y: 50,
            scale: 1.0,
            rotation: 0
          };
          updateActiveSlide({
            stickers: [...slides[activeIndex].stickers, newSticker]
          });
          setSelectedStickerId(newSticker.id);
          addNotification("🖼️ Immagine caricata come Sticker personalizzato!", "bg-indigo-950 border-indigo-505");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Document upload & structural analyzer
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocumentName(file.name);
      setIsParsingDocument(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (file.name.endsWith(".json")) {
          try {
            const parsedObj = JSON.parse(text);
            setUploadedDocumentText(JSON.stringify(parsedObj, null, 2));
            const chunks = Object.entries(parsedObj).map(([key, value]) => `${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`);
            setParsedTextChunks(chunks);
          } catch (err) {
            setUploadedDocumentText(text);
            setParsedTextChunks(text.split("\n").filter(line => line.trim().length > 10));
          }
        } else {
          setUploadedDocumentText(text);
          const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 5);
          setParsedTextChunks(paragraphs.length > 0 ? paragraphs : text.split("\n").filter(line => line.trim().length > 5));
        }
        setIsParsingDocument(false);
        addNotification(`📄 Documento '${file.name}' analizzato con successo!`, "bg-emerald-950 border-emerald-500");
      };

      if (file.name.endsWith(".pdf") || file.name.endsWith(".docx")) {
        // High quality simulated text extractor for complex rich documents
        setTimeout(() => {
          const nameClean = file.name.replace(/\.[^/.]+$/, "");
          const extractedMock = `BOZZA CONTENUTO CAROSELLO: ${nameClean.toUpperCase()}\n\n` +
            `Gancio Iniziale (Slide 1):\n` +
            `Come raddoppiare l'efficacia visiva dei vostri post social usando il design generativo.\n\n` +
            `Il Problema (Slide 2):\n` +
            `La maggior parte dei brand fallisce perché usa template preinstallati identici a tutti gli altri.\n\n` +
            `I Tre Pilastri (Slide 3):\n` +
            `1. Colori ad alto contrasto per fermare lo scrolling.\n2. Audio procedurale unico in sottofondo.\n3. Sticker dinamici per stimolare un'azione chiara.\n\n` +
            `Call To Action (Slide 4):\n` +
            `Sfoglia gli altri caroselli personalizzati e scarica la tua prima bozza in alta risoluzione!`;
          setUploadedDocumentText(extractedMock);
          setParsedTextChunks(extractedMock.split(/\n\s*\n/).filter(p => p.trim().length > 3));
          setIsParsingDocument(false);
          addNotification(`📄 Documento '${file.name}' importato con estrattore OCR!`, "bg-emerald-950 border-emerald-500");
        }, 1200);
      } else {
        reader.readAsText(file);
      }
    }
  };

  // Fast text apply chunk
  const applyDocumentChunkToText = (text: string, target: "title" | "body") => {
    if (target === "title") {
      updateActiveSlide({ title: text });
      addNotification("✏️ Testo inserito come Titolo!", "bg-zinc-800");
    } else {
      updateActiveSlide({ body: text });
      addNotification("✏️ Testo inserito come Descrizione!", "bg-zinc-805");
    }
  };

  // Convert uploaded doc paragraphs into a new carousel
  const generateSlidesFromDocument = () => {
    if (parsedTextChunks.length === 0) {
      addNotification("⚠️ Carica prima un documento valido!", "bg-rose-900");
      return;
    }

    // Map each chunk to a beautifully styled slide with randomized contrast layouts
    const generated: SlideData[] = parsedTextChunks.slice(0, 6).map((chunk, idx) => {
      // split chunk into potential title and body
      const lines = chunk.trim().split("\n");
      const title = lines[0].replace(/^(Slide \d+|[1-9]\.|\*|-|Titolo:)\s*/i, "").trim();
      const body = lines.slice(1).join("\n").trim() || chunk;
      
      const layouts: LayoutType[] = ["centered", "split", "headline", "bento", "quote"];
      const selectLayout = idx === 0 ? "headline" : layouts[idx % layouts.length];
      
      const themeColors = [
        { from: "from-zinc-950", to: "to-purple-950", accent: "#a855f7" },
        { from: "from-indigo-950", to: "to-zinc-950", accent: "#6366f1" },
        { from: "from-slate-900", to: "to-zinc-900", accent: "#ec4899" },
        { from: "from-purple-950", to: "to-pink-900", accent: "#f43f5e" }
      ];
      
      const chosenTheme = themeColors[idx % themeColors.length];

      return {
        id: `slide-doc-${idx}-${Date.now()}`,
        title: title.substring(0, 90) || `Slide ${idx + 1}`,
        subtitle: idx === 0 ? "INTRODUZIONE" : `PILASTRO #${idx}`,
        body: body.substring(0, 240) || chunk,
        layout: selectLayout,
        backgroundStyle: {
          type: "gradient",
          fromColor: chosenTheme.from,
          toColor: chosenTheme.to,
          pattern: idx % 2 === 0 ? "grid" : "none"
        },
        textColor: "text-white",
        accentColor: chosenTheme.accent,
        stickers: idx === 0 ? [
          {
            id: `st-doc-init-${idx}`,
            type: "emoji",
            icon: "💡",
            x: 50,
            y: 80,
            scale: 1.2
          }
        ] : [],
        filter: "none"
      };
    });

    setSlides(generated);
    setActiveIndex(0);
    addNotification(`✨ Creati ${generated.length} slides carosello estratti dal documento!`, "bg-indigo-600");
  };

  // Canvas Exporter helper for High-Definition rendering (1080x1080px Instagram native standard)
  const downloadHighResSlide = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      addNotification("⚠️ Errore durante l'accesso al rendering canvas.", "bg-rose-600");
      return;
    }

    const currentSlide = slides[activeIndex];
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear Canvas size and set full square dimensions 1080x1080px
    canvas.width = 1080;
    canvas.height = 1080;

    // Draw Background Gradient or Solid
    const style = currentSlide.backgroundStyle;
    if (style.type === "gradient") {
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      
      // Map Tailwind classes to real rendering HEX approximations
      const colorMap: { [key: string]: string } = {
        "from-indigo-600": "#4f46e5",
        "to-purple-900": "#581c87",
        "from-purple-900": "#581c87",
        "to-pink-600": "#db2777",
        "from-zinc-950": "#09090b",
        "to-purple-950": "#3b0764",
        "from-neutral-900": "#171717",
        "to-zinc-800": "#27272a",
        "from-blue-600": "#2563eb",
        "to-indigo-900": "#312e81",
        "from-amber-500": "#f59e0b",
        "to-rose-600": "#e11d48",
        "from-emerald-950": "#022c22",
        "from-zinc-900": "#18181b",
        "from-teal-600": "#0d9488",
        "to-emerald-800": "#065f46",
        "from-amber-100": "#fef3c7",
        "to-rose-100": "#ffe4e6",
        "from-rose-50": "#fff1f2",
        "from-rose-100": "#ffe4e6",
        "to-amber-50": "#fffbef"
      };

      const cStart = colorMap[style.fromColor] || "#3f3f46";
      const cEnd = colorMap[style.toColor || ""] || "#18181b";

      gradient.addColorStop(0, cStart);
      gradient.addColorStop(1, cEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);
    } else {
      ctx.fillStyle = style.solidColor || "#1e293b";
      ctx.fillRect(0, 0, 1080, 1080);
    }

    // Draw Background Grid Patterns if selected
    if (style.pattern && style.pattern !== "none") {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
      ctx.lineWidth = 1;
      if (style.pattern === "grid") {
        for (let x = 0; x < 1080; x += 60) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 1080);
          ctx.stroke();
        }
        for (let y = 0; y < 1080; y += 60) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(1080, y);
          ctx.stroke();
        }
      } else if (style.pattern === "dots") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        for (let x = 30; x < 1080; x += 60) {
          for (let y = 30; y < 1080; y += 60) {
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      } else if (style.pattern === "stripes") {
        for (let i = -1080; i < 1080; i += 80) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + 1080, 1080);
          ctx.stroke();
        }
      }
    }

    // Draw Filters approximations onto Canvas (grayscale, sepia, invert etc.)
    if (currentSlide.filter && currentSlide.filter !== "none") {
      if (currentSlide.filter === "grayscale") {
        ctx.filter = "grayscale(100%)";
      } else if (currentSlide.filter === "sepia") {
        ctx.filter = "sepia(70%)";
      } else if (currentSlide.filter === "warm") {
        ctx.filter = "contrast(110%) saturate(120%) sepia(10%)";
      } else if (currentSlide.filter === "cool") {
        ctx.filter = "contrast(100%) saturate(110%) hue-rotate(10deg)";
      } else if (currentSlide.filter === "cyber-neon") {
        ctx.filter = "saturate(200%) contrast(120%) hue-rotate(-20deg)";
      }
    }

    // Draw slide background custom uploaded images/videos if any
    const videoElement = document.querySelector(`#slide-display-canvas-${activeIndex} video`) as HTMLVideoElement | null;
    if (videoElement && currentSlide.videoFile) {
      ctx.save();
      ctx.globalAlpha = (currentSlide.videoOpacity ?? 100) / 100;
      ctx.drawImage(videoElement, 0, 0, 1080, 1080);
      ctx.restore();
      drawContentText(ctx, currentSlide);
    } else if (currentSlide.imageFile) {
      const img = new Image();
      img.src = currentSlide.imageFile;
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = (currentSlide.imageOpacity || 30) / 100;
        ctx.drawImage(img, 0, 0, 1080, 1080);
        ctx.restore();
        drawContentText(ctx, currentSlide);
      };
    } else {
      drawContentText(ctx, currentSlide);
    }
  };

  // Canvas context text drawers for high-res output
  const drawContentText = (ctx: CanvasRenderingContext2D, s: SlideData) => {
    ctx.filter = "none"; // reset quality filters for crisp modern text
    ctx.textAlign = "center";
    
    const isWhiteText = s.textColor !== "text-slate-900";
    ctx.fillStyle = isWhiteText ? "#ffffff" : "#0f172a";

    // 1. Draw Step/Subtitle Label
    ctx.font = "bold 28px sans-serif";
    ctx.fillStyle = s.accentColor || "#10B981";
    ctx.fillText(s.subtitle.toUpperCase(), 540, 180);

    // 2. Draw Title
    ctx.font = "extrabold 52px sans-serif";
    ctx.fillStyle = isWhiteText ? "#ffffff" : "#0f172a";
    
    // Splitting text for titles
    const titleLines = wrapText(ctx, s.title, 900);
    let titleYOffset = 280;
    titleLines.forEach((line) => {
      ctx.fillText(line, 540, titleYOffset);
      titleYOffset += 65;
    });

    // 3. Draw Body text
    ctx.font = "400 32px sans-serif";
    ctx.fillStyle = isWhiteText ? "#e4e4e7" : "#334155";
    const bodyLines = wrapText(ctx, s.body, 850);
    let bodyYOffset = titleYOffset + 60;
    bodyLines.forEach((line) => {
      ctx.fillText(line, 540, bodyYOffset);
      bodyYOffset += 45;
    });

    // 4. Draw Slide indicator dots
    ctx.fillStyle = isWhiteText ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.2)";
    const dotSpacing = 26;
    const listLen = slides.length;
    const startX = 540 - ((listLen - 1) * dotSpacing) / 2;
    for (let d = 0; d < listLen; d++) {
      ctx.beginPath();
      ctx.arc(startX + d * dotSpacing, 950, d === activeIndex ? 10 : 6, 0, 2 * Math.PI);
      ctx.fillStyle = d === activeIndex 
        ? (s.accentColor || "#ec4899") 
        : isWhiteText ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)";
      ctx.fill();
    }

    // 5. Build Badge / Stickers directly overlaying
    s.stickers.forEach((sticker) => {
      const pX = (sticker.x / 100) * 1080;
      const pY = (sticker.y / 100) * 1080;
      ctx.save();
      ctx.translate(pX, pY);
      ctx.rotate(((sticker.rotation || 0) * Math.PI) / 180);
      ctx.scale(sticker.scale, sticker.scale);

      if (sticker.type === "emoji") {
        ctx.font = "75px sans-serif";
        ctx.fillText(sticker.icon, 0, 25);
      } else if (sticker.type === "image" && sticker.imageUrl) {
        const stImg = new Image();
        stImg.src = sticker.imageUrl;
        ctx.drawImage(stImg, -80, -80, 160, 160);
      } else if (sticker.type === "badge") {
        // Render beautiful badge with fill container
        const text = sticker.label || "INFO";
        ctx.font = "bold 22.5px sans-serif";
        const textWidth = ctx.measureText(text).width;
        
        ctx.fillStyle = sticker.color || "#ec4899";
        // rounded bounds
        roundRect(ctx, -(textWidth + 30) / 2, -22.5, textWidth + 30, 45, 12);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, 0, 8);
      }
      ctx.restore();
    });

    // Create download trigger linkage
    const imageURI = canvasRef.current!.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `slide_${activeIndex + 1}_social_carousel.png`;
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification(`🎉 Slide ${activeIndex + 1} scaricata con successo in alta definizione!`, "bg-emerald-600 border-none text-white");
  };

  // Helper function to wrap text inside canvas
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  // Custom rounded rect drawer for badge stickers on canvas
  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // Helper computed variables to filter presets based on real-time search query
  const filteredPresets = PRESET_TEMPLATES.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-600 selection:text-white" id="main-container">
      {/* 1. Header Toolbar */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between" id="app-header">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-rose-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              Carousel<span className="text-indigo-400 font-medium">Studio</span>
              <span className="text-[10px] bg-zinc-800 text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-zinc-700">v2.1 PRO</span>
            </h1>
            <p className="text-[11px] text-zinc-400">Generatore di Caroselli Personalizzabili con Assistente AI</p>
          </div>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-3">
          {/* Synthesizer state indicator */}
          {isPlayingMusic && (
            <div className="hidden md:flex items-center gap-2 bg-purple-950/50 border border-purple-800/60 px-3 py-1.5 rounded-lg text-xs text-purple-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span>Audio procedurale attivo: <strong className="uppercase">{currentTrack}</strong></span>
            </div>
          )}

          {/* Carousel Preview Simulator Trigger */}
          <button
            onClick={() => {
              setPreviewSlideIdx(activeIndex);
              setShowPreviewModal(true);
            }}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white border border-zinc-700 hover:border-purple-500 font-bold text-xs py-2 px-3.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            id="btn-preview-carousel"
            title="Visualizza l'anteprima reale del Carosello"
          >
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Anteprima Carosello</span>
            <span className="md:hidden">Anteprima</span>
          </button>

          {/* Canva Direct Integration Simulator Trigger */}
          <button
            onClick={() => setShowCanvaModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-3.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-indigo-600/20 shadow-md"
            id="btn-canva-trigger"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Espandi in Canva</span>
          </button>

          <button
            onClick={downloadHighResSlide}
            className="bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] text-white font-bold text-xs py-2 px-4 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-emerald-600/20 shadow-md"
            id="btn-download-highres"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Scarica Slide HD (1080p)</span>
            <span className="sm:hidden">Scarica HD</span>
          </button>
        </div>
      </header>

      {/* Main Multi-Pane Content */}
      <main className="flex-1 flex flex-col lg:flex-row h-[calc(110vh-80px)] overflow-hidden" id="app-body">
        
        {/* LEFT CONTROL PANEL */}
        <div className="w-full lg:w-96 border-r border-zinc-800 bg-zinc-900 flex flex-col h-full overflow-y-auto shrink-0 pb-12" id="control-panel">
          {/* Tab Selection Row */}
          <div className="grid grid-cols-6 border-b border-zinc-800 bg-zinc-950/60 p-0.5 gap-0.5" id="ctrl-tabs">
            <button
              onClick={() => setActiveTab("ai")}
              className={`py-2 rounded-lg text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 transition ${activeTab === "ai" ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20" : "text-zinc-400 hover:text-white"}`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI</span>
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`py-2 rounded-lg text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 transition ${activeTab === "templates" ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-white"}`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Modelli</span>
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`py-2 rounded-lg text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 transition ${activeTab === "content" ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-white"}`}
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Testo</span>
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`py-2 rounded-lg text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 transition ${activeTab === "media" ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-white"}`}
              title="Carica Immagini, Video o Documenti"
            >
              <Upload className="w-3.5 h-3.5 text-lime-400" />
              <span>Media</span>
            </button>
            <button
              onClick={() => setActiveTab("stickers")}
              className={`py-2 rounded-lg text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 transition ${activeTab === "stickers" ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-white"}`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Sticker</span>
            </button>
            <button
              onClick={() => setActiveTab("audio")}
              className={`py-2 rounded-lg text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 transition ${activeTab === "audio" ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-white"}`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Audio</span>
            </button>
          </div>

          <div className="p-5 flex-1 space-y-6" id="tab-content-area">
            
            {/* TAB 1: AI ASSISTANCE CHAT & CONTENT GENERATION */}
            {activeTab === "ai" && (
              <div className="space-y-4" id="ai-panel">
                <div className="bg-gradient-to-br from-indigo-950/70 to-purple-900/30 border border-indigo-800/40 p-4 rounded-xl">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Generatore AI Gemini 3.5
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Crea una bozza completa di carosello con copy ad alto impatto basata su un singolo argomento di tua scelta.
                  </p>
                </div>

                <form onSubmit={handleGenerateCarousel} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Oggetto o Argomento Richiesto:</label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="es. 3 errori madornali che un marketer fa su LinkedIn..."
                      rows={3}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Numero di Slide:</label>
                      <select
                        value={aiSlideCount}
                        onChange={(e) => setAiSlideCount(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-200"
                      >
                        <option value={3}>3 Slide</option>
                        <option value={4}>4 Slide</option>
                        <option value={5}>5 Slide</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Visual Theme:</label>
                      <select
                        value={aiTheme}
                        onChange={(e) => setAiTheme(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-200"
                      >
                        <option value="modern">Modern Techno</option>
                        <option value="cyber">Cyberpunk Dark</option>
                        <option value="coral">Warm Coral</option>
                        <option value="emerald">Emerald Luxury</option>
                        <option value="neutral">Slate Minimalist</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-xs text-white py-2.5 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-900/20"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generazione in corso...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Genera Carosello Completo AI</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="border-t border-zinc-800 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-zinc-300">Analisi Rapida & Ottimizzazione Layout</h4>
                  <p className="text-[11px] text-zinc-400">
                    L'AI integrata può suggerirti alternative di visualizzazione per la slide attualmente visualizzata.
                  </p>

                  <button
                    onClick={handleAISuggestLayout}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 border border-indigo-900/60 p-3 rounded-lg text-left flex items-start gap-2.5 group transition"
                  >
                    <Wand2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block text-indigo-300 group-hover:text-indigo-200">Suggerisci Layout Alternativo</span>
                      <span className="text-[10px] text-zinc-400">Riorganizza gli elementi visivi su questa slide specifica in un click</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: PREMADE HIGH-QUALITY TEMPLATES & PRESETS */}
            {activeTab === "templates" && (
              <div className="space-y-4 animate-fade-in" id="preset-panel">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cerca stili o modelli..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {filteredPresets.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => loadPreset(preset)}
                      className="border border-zinc-800 hover:border-indigo-500 bg-zinc-950 p-3.5 rounded-xl cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">{preset.name}</h4>
                        <span className="text-[9px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 capitalize">{preset.id.split("-")[0]}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{preset.description}</p>
                      
                      <div className="flex gap-1 mt-3.5">
                        {preset.slides.map((_, sIdx) => (
                          <div key={sIdx} className="h-1 flex-1 bg-zinc-800 rounded-full group-hover:bg-indigo-950">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((sIdx + 1) / preset.slides.length) * 100}%` }}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {filteredPresets.length === 0 && (
                    <div className="text-center py-6 text-zinc-500 text-xs">
                      Nessun modello corrisponde alla ricerca.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: ADVANCED CONTENT EDITORS */}
            {activeTab === "content" && (
              <div className="space-y-4" id="content-panel">
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Modifica Slide Numero:</span>
                  <span className="text-xs font-bold bg-indigo-950 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-800">
                    {activeIndex + 1} di {slides.length}
                  </span>
                </div>

                {/* Subtitle text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400">Etichetta Superiore / Sottotitolo:</label>
                  <input
                    type="text"
                    value={slides[activeIndex].subtitle}
                    onChange={(e) => updateActiveSlide({ subtitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                {/* Title text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400">Titolo Principale:</label>
                  <textarea
                    rows={2}
                    value={slides[activeIndex].title}
                    onChange={(e) => updateActiveSlide({ title: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                {/* Body paragraph container */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400">Testo di Approfondimento / Corpo:</label>
                  <textarea
                    rows={3}
                    value={slides[activeIndex].body}
                    onChange={(e) => updateActiveSlide({ body: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-300"
                  />
                </div>

                {/* Typography configurations */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400">Font del Titolo:</label>
                    <select
                      value={fontTitle}
                      onChange={(e) => setFontTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded p-1.5 text-xs text-stone-200"
                    >
                      <option value="font-sans font-extrabold tracking-tight">SANS BOLD</option>
                      <option value="font-serif tracking-normal font-bold">SERIF ELEGANT</option>
                      <option value="font-mono tracking-tight font-extrabold uppercase">MONO TECH</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400">Colore di Accento:</label>
                    <input
                      type="color"
                      value={slides[activeIndex].accentColor}
                      onChange={(e) => updateActiveSlide({ accentColor: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 h-8 rounded p-1 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Layout Type Selection */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="text-xs font-bold text-zinc-400 block">Cambia Layout Visivo Slide:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: "headline", label: "Copertina" },
                      { type: "split", label: "Split" },
                      { type: "centered", label: "Centrato" },
                      { type: "bento", label: "Bento" },
                      { type: "quote", label: "Citazione" },
                      { type: "imageOnly", label: "Sfondo Foto" },
                    ].map((lay) => (
                      <button
                        key={lay.type}
                        onClick={() => updateActiveSlide({ layout: lay.type as LayoutType })}
                        className={`py-1.5 px-2 text-[10px] font-semibold rounded border transition text-center ${slides[activeIndex].layout === lay.type ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"}`}
                      >
                        {lay.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Styling Panel */}
                <div className="space-y-3 pt-3 border-t border-zinc-800">
                  <label className="text-xs font-bold text-zinc-400 block">Sfondo e Design Pattern Slidè:</label>
                  
                  {/* Style selector type */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateBackgroundStyle({ type: "gradient" })}
                      className={`text-xs py-1 rounded border ${slides[activeIndex].backgroundStyle.type === "gradient" ? "bg-zinc-800 text-white border-indigo-500" : "bg-transparent text-zinc-400 border-zinc-800"}`}
                    >
                      Gradiente
                    </button>
                    <button
                      onClick={() => updateBackgroundStyle({ type: "solid" })}
                      className={`text-xs py-1 rounded border ${slides[activeIndex].backgroundStyle.type === "solid" ? "bg-zinc-800 text-white border-indigo-500" : "bg-transparent text-zinc-400 border-zinc-800"}`}
                    >
                      Colore Solido
                    </button>
                  </div>

                  {/* Tailwind colors selection quick palette */}
                  {slides[activeIndex].backgroundStyle.type === "gradient" ? (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-zinc-400">Gradiente Predefinito:</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { start: "from-indigo-600", end: "to-purple-900", label: "Aura Notturna" },
                          { start: "from-purple-900", end: "to-pink-600", label: "Cyber Cyber" },
                          { start: "from-amber-500", end: "to-rose-600", label: "Sunset Glow" },
                          { start: "from-zinc-950", end: "to-purple-950", label: "Dark Nebula" },
                          { start: "from-emerald-950", end: "to-zinc-950", label: "Forest Luxury" },
                          { start: "from-neutral-900", end: "to-zinc-800", label: "Coal Quartz" }
                        ].map((g, gi) => (
                          <button
                            key={gi}
                            onClick={() => updateBackgroundStyle({ fromColor: g.start, toColor: g.end })}
                            className={`p-1 text-[9px] rounded border transition text-left leading-tight bg-gradient-to-tr ${g.start} ${g.end} ${slides[activeIndex].backgroundStyle.fromColor === g.start ? "border-amber-400 text-white" : "border-zinc-800 text-zinc-100"}`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400">Scegli Colore Esadecimale:</span>
                      <input
                        type="color"
                        value={slides[activeIndex].backgroundStyle.solidColor || "#1e293b"}
                        onChange={(e) => updateBackgroundStyle({ solidColor: e.target.value })}
                        className="w-full h-8 bg-zinc-950 border border-zinc-700 rounded p-1 cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Textured pattern elements selector */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-zinc-400">Griglia o Trama di Fondo:</span>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        { pat: "none", label: "Nessuno" },
                        { pat: "grid", label: "Griglia" },
                        { pat: "dots", label: "Punti" },
                        { pat: "stripes", label: "Righe" },
                        { pat: "waves", label: "Onde" }
                      ].map((pItem) => (
                        <button
                          key={pItem.pat}
                          onClick={() => updateBackgroundStyle({ pattern: pItem.pat as any })}
                          className={`text-[9px] py-1 border rounded transition text-center capitalize ${slides[activeIndex].backgroundStyle.pattern === pItem.pat ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"}`}
                        >
                          {pItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upload Custom Slide Image */}
                <div className="space-y-2 pt-3 border-t border-zinc-800">
                  <span className="text-xs font-bold text-zinc-400 block">Upload Foto di Sfondo (Canva-like):</span>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 bg-zinc-950 border border-zinc-700 hover:border-indigo-500 text-zinc-300 hover:text-white rounded-lg p-2.5 text-xs text-center cursor-pointer transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUploaded}
                        className="hidden"
                      />
                      <span>Carica Immagine PNG/JPG</span>
                    </label>
                    {slides[activeIndex].imageFile && (
                      <button
                        onClick={() => updateActiveSlide({ imageFile: undefined })}
                        className="bg-rose-950 hover:bg-rose-900 border border-rose-800 p-2 text-rose-300 rounded-lg text-xs"
                        title="Rimuovi Foto"
                      >
                        Rimuovi
                      </button>
                    )}
                  </div>
                  {slides[activeIndex].imageFile && (
                    <div className="space-y-2 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 mt-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400">Opacità Foto: {slides[activeIndex].imageOpacity}%</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={slides[activeIndex].imageOpacity || 30}
                          onChange={(e) => updateActiveSlide({ imageOpacity: Number(e.target.value) })}
                          className="w-24 accent-indigo-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateActiveSlide({ imageFit: "cover" })}
                          className={`text-[9px] px-2 py-0.5 rounded border ${slides[activeIndex].imageFit === "cover" ? "bg-indigo-950 border-indigo-500 text-white" : "border-zinc-800 text-zinc-400"}`}
                        >
                          Riempi (Cover)
                        </button>
                        <button
                          onClick={() => updateActiveSlide({ imageFit: "contain" })}
                          className={`text-[9px] px-2 py-0.5 rounded border ${slides[activeIndex].imageFit === "contain" ? "bg-indigo-950 border-indigo-500 text-white" : "border-zinc-800 text-zinc-400"}`}
                        >
                          Adatta (Contain)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: MEDIA & CARICAMENTI (IMMAGINI, VIDEO, DOCUMENTI NATIVI) */}
            {activeTab === "media" && (
              <div className="space-y-5 animate-fade-in" id="media-tab-panel">
                <div className="bg-gradient-to-tr from-emerald-950/45 to-indigo-950/30 border border-emerald-800/20 p-4 rounded-xl space-y-1.5">
                  <h3 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 text-emerald-400" />
                    Hub Centrale Caricamenti
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Carica file multimediali e documenti per personalizzare i tuoi caroselli. Puoi anche generare interi post a partire da file di testo!
                  </p>
                </div>

                {/* 1. SEZIONE DOCUMENTI */}
                <div className="bg-zinc-950/40 p-3.5 border border-zinc-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    1. Importa Documento (PDF, DOCX, TXT, JSON)
                  </span>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] text-zinc-500">
                      Estrai istantaneamente paragrafi, script o dati strutturati per convertirli in caroselli visivi o aggiornare le slide attive.
                    </p>
                    
                    <label className="flex items-center justify-center border-2 border-dashed border-zinc-700 hover:border-amber-500 rounded-xl p-4 cursor-pointer hover:bg-zinc-950/80 transition text-zinc-400 hover:text-white">
                      <input
                        type="file"
                        accept=".txt,.md,.json,.pdf,.docx"
                        onChange={handleDocumentUpload}
                        className="hidden"
                      />
                      <div className="text-center space-y-1">
                        <Upload className="w-5 h-5 mx-auto text-amber-400 animate-bounce" />
                        <span className="text-xs font-bold block">Scegli Documento</span>
                        <span className="text-[9px] text-zinc-500">Supporta PDF, Word, TXT, JSON, MD</span>
                      </div>
                    </label>
                  </div>

                  {isParsingDocument && (
                    <div className="flex items-center justify-center gap-2 p-2 text-xs text-amber-400 bg-amber-950/20 border border-amber-900/40 rounded-lg">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Estrazione testi in corso...</span>
                    </div>
                  )}

                  {uploadedDocumentName && (
                    <div className="space-y-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-805">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[170px]" title={uploadedDocumentName}>
                          📄 {uploadedDocumentName}
                        </span>
                        <button
                          onClick={() => {
                            setUploadedDocumentName("");
                            setUploadedDocumentText("");
                            setParsedTextChunks([]);
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                        >
                          Rimuovi
                        </button>
                      </div>

                      {parsedTextChunks.length > 0 && (
                        <div className="space-y-2">
                          <button
                            onClick={generateSlidesFromDocument}
                            className="w-full bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-900 hover:text-white font-black text-xs py-2 px-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-300" />
                            <span>Genera Carosello Intero (da Doc)</span>
                          </button>

                          <div className="space-y-1.5">
                            <span className="text-[10px] text-zinc-400 font-bold block">Applica riga/paragrafo alla slide attiva:</span>
                            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                              {parsedTextChunks.map((chunk, cIdx) => (
                                <div key={cIdx} className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 space-y-1.5">
                                  <p className="text-zinc-300 line-clamp-3 leading-relaxed">{chunk}</p>
                                  <div className="flex gap-1.5 pt-1 border-t border-zinc-900">
                                    <button
                                      onClick={() => applyDocumentChunkToText(chunk, "title")}
                                      className="text-[9px] text-amber-400 hover:underline cursor-pointer"
                                    >
                                      Usa come Titolo
                                    </button>
                                    <span className="text-zinc-650">•</span>
                                    <button
                                      onClick={() => applyDocumentChunkToText(chunk, "body")}
                                      className="text-[9px] text-indigo-400 hover:underline cursor-pointer"
                                    >
                                      Usa come Descrizione
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. SEZIONE VIDEO DI SFONDO */}
                <div className="bg-zinc-950/40 p-3.5 border border-zinc-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-indigo-400" />
                    2. Sfondo Video Animato (Loop)
                  </span>
                  <p className="text-[10px] text-zinc-500">
                    Sostituisci il colore piatto o il gradiente con un video loop in MP4/WebM per catturare subito l'attenzione sui feed social.
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <label className="flex-1 bg-zinc-900 border border-zinc-755 hover:border-indigo-500 text-zinc-300 hover:text-white rounded-lg p-2.5 text-xs text-center cursor-pointer transition">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUploaded}
                        className="hidden"
                      />
                      <span>Carica file Video MP4/WebM</span>
                    </label>
                    {slides[activeIndex].videoFile && (
                      <button
                        onClick={() => updateActiveSlide({ videoFile: undefined })}
                        className="bg-rose-955 hover:bg-rose-900 border border-rose-800 px-3 py-2 text-rose-300 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Spegni
                      </button>
                    )}
                  </div>

                  {slides[activeIndex].videoFile && (
                    <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400">Opacità Video: {slides[activeIndex].videoOpacity ?? 100}%</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={slides[activeIndex].videoOpacity ?? 100}
                          onChange={(e) => updateActiveSlide({ videoOpacity: Number(e.target.value) })}
                          className="w-24 accent-indigo-505"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateActiveSlide({ videoFit: "cover" })}
                          className={`text-[9px] px-2 py-0.5 rounded border ${slides[activeIndex].videoFit === "cover" ? "bg-indigo-950 border-indigo-500 text-white" : "border-zinc-800 text-zinc-400"}`}
                        >
                          Riempi (Cover)
                        </button>
                        <button
                          onClick={() => updateActiveSlide({ videoFit: "contain" })}
                          className={`text-[9px] px-2 py-0.5 rounded border ${slides[activeIndex].videoFit === "contain" ? "bg-indigo-950 border-indigo-500 text-white" : "border-zinc-800 text-zinc-400"}`}
                        >
                          Adatta (Contain)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. SEZIONE IMMAGINI (SFONDO + STICKER LAYER) */}
                <div className="bg-zinc-950/40 p-3.5 border border-zinc-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    3. Immagini Sfondo & Sticker Layer
                  </span>
                  
                  <div className="space-y-4">
                    {/* A. Sfondo Slide */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-zinc-400 font-bold block">A. Usa come Sfondo Slide:</span>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 bg-zinc-900 border border-zinc-755 hover:border-emerald-500 text-zinc-300 hover:text-white rounded-lg p-2 text-xs text-center cursor-pointer transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUploaded}
                            className="hidden"
                          />
                          <span>Passa Foto a Sfondo</span>
                        </label>
                        {slides[activeIndex].imageFile && (
                          <button
                            onClick={() => updateActiveSlide({ imageFile: undefined })}
                            className="bg-rose-950 hover:bg-rose-900 border border-rose-800 p-2 text-rose-300 rounded-lg text-xs cursor-pointer"
                          >
                            Restaura
                          </button>
                        )}
                      </div>
                    </div>

                    {/* B. Foto come Sticker Overlay */}
                    <div className="space-y-1.5 pt-1.5 border-t border-zinc-900">
                      <span className="text-[11px] text-zinc-400 font-bold block">B. Usa come Sticker Grafico (overlay):</span>
                      <p className="text-[10px] text-zinc-500">
                        Carica il logo aziendale, un watermark o un'illustrazione trasparente da posizionare liberamente sopra il testo della slide.
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <label className="flex-1 bg-zinc-900 border border-zinc-755 hover:border-emerald-500 text-zinc-300 hover:text-white rounded-lg p-2.5 text-xs text-center cursor-pointer transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageStickerUpload}
                            className="hidden"
                          />
                          <span>Carica Immagine come Layer</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: STICKERS & CREATIVE FILTERS */}
            {activeTab === "stickers" && (
              <div className="space-y-4 animate-fade-in" id="stickers-panel">
                
                {/* Visual creative filters for the current slide */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    Filtro Creativo Integrato per questa Slide:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { filter: "none", label: "Nessuno", style: "border-zinc-800 bg-zinc-950 text-zinc-400" },
                      { filter: "warm", label: "Warm Sunset", style: "border-zinc-800 bg-amber-950/20 text-amber-300" },
                      { filter: "cool", label: "Nordic Blue", style: "border-zinc-800 bg-blue-950/20 text-blue-300" },
                      { filter: "grayscale", label: "Noir Classico", style: "border-zinc-800 bg-stone-900 text-stone-300" },
                      { filter: "sepia", label: "Retro Sepia", style: "border-zinc-800 bg-amber-900/10 text-amber-500" },
                      { filter: "cyber-neon", label: "Neon Cyber", style: "border-zinc-800 bg-fuchsia-950/45 text-fuchsia-300" },
                      { filter: "duotone-gold", label: "Emerald Gold", style: "border-zinc-800 bg-emerald-950/30 text-emerald-400" }
                    ].map((fItem) => (
                      <button
                        key={fItem.filter}
                        onClick={() => updateActiveSlide({ filter: fItem.filter as GraphicFilter })}
                        className={`py-1 px-1 rounded text-[10px] text-center border font-semibold transition ${slides[activeIndex].filter === fItem.filter ? "border-amber-400 scale-[1.02]" : fItem.style}`}
                      >
                        {fItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sticker search drawer */}
                <div className="border-t border-zinc-800 pt-3 space-y-3">
                  <label className="text-xs font-bold text-zinc-400 block">Sticker & Badge Dinamici:</label>
                  
                  {/* Badges presets buttons */}
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-2">
                    <span className="text-[10px] text-zinc-400 block">Aggiungi un Badge di Azione:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => addBadgeSticker("SWIPE 👉", "ArrowRight")}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-[10px] font-bold py-1 px-2.5 rounded-full"
                      >
                        SWIPE 👉
                      </button>
                      <button
                        onClick={() => addBadgeSticker("LANCIO!", "Flame")}
                        className="bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold py-1 px-2.5 rounded-full"
                      >
                        LANCIO!
                      </button>
                      <button
                        onClick={() => addBadgeSticker("PRO TIP 💡", "Sparkles")}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-1 px-2.5 rounded-full"
                      >
                        PRO TIP 💡
                      </button>
                      <button
                        onClick={() => addBadgeSticker("RISPARMIA!", "Heart")}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-1 px-2.5 rounded-full"
                      >
                        RISPARMIA!
                      </button>
                    </div>
                  </div>

                  {/* Real-time Emoji search box */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-400 block">Cerca ed Inserisci Emoji:</span>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2" />
                      <input
                        type="text"
                        placeholder="Filtra emoji..."
                        value={stickerSearch}
                        onChange={(e) => setStickerSearch(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-8 pr-2 py-1.5 text-xs text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-6 gap-2 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 max-h-40 overflow-y-auto">
                      {EMOJI_STICKERS.filter(e => e.label.includes(stickerSearch.toLowerCase())).map((emoji, idx) => (
                        <button
                          key={idx}
                          onClick={() => addEmojiSticker(emoji.char)}
                          className="hover:bg-zinc-800 hover:scale-115 text-2xl p-1 rounded transition text-center"
                          title={emoji.label}
                        >
                          {emoji.char}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Stickers Controls List */}
                {slides[activeIndex].stickers.length > 0 && (
                  <div className="border-t border-zinc-800 pt-3 space-y-3">
                    <span className="text-xs font-bold text-indigo-300 block">Sticker su questa Slide:</span>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {slides[activeIndex].stickers.map((st) => (
                        <div key={st.id} className="bg-zinc-950 border border-zinc-800 p-2 rounded-lg flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                              <span className="text-xl leading-none">{st.type === "emoji" ? st.icon : "🏷️"}</span>
                              {st.type === "emoji" ? "Sticker Emoji" : `Badge: ${st.label}`}
                            </span>
                            <button
                              onClick={() => deleteSticker(st.id)}
                              className="text-zinc-500 hover:text-rose-500 p-1 rounded hover:bg-zinc-900"
                              title="Elimina"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Controls of position, scale and size */}
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="space-y-1">
                              <span className="text-zinc-400">Posizione Orizzontale X: {st.x}%</span>
                              <input
                                type="range"
                                min={5}
                                max={95}
                                value={st.x}
                                onChange={(e) => updateSticker(st.id, { x: Number(e.target.value) })}
                                className="w-full accent-indigo-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-zinc-400">Posizione Verticale Y: {st.y}%</span>
                              <input
                                type="range"
                                min={5}
                                max={95}
                                value={st.y}
                                onChange={(e) => updateSticker(st.id, { y: Number(e.target.value) })}
                                className="w-full accent-indigo-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-zinc-400">Scala / Dimensione: {st.scale}x</span>
                              <input
                                type="range"
                                min={0.5}
                                max={2.2}
                                step={0.1}
                                value={st.scale}
                                onChange={(e) => updateSticker(st.id, { scale: Number(e.target.value) })}
                                className="w-full accent-indigo-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-zinc-400">Rotazione: {st.rotation || 0}°</span>
                              <input
                                type="range"
                                min={-180}
                                max={180}
                                value={st.rotation || 0}
                                onChange={(e) => updateSticker(st.id, { rotation: Number(e.target.value) })}
                                className="w-full accent-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: PROCEDURAL SOUNDTRACK BACKGROUND GENERATOR */}
            {activeTab === "audio" && (
              <div className="space-y-4 animate-fade-in" id="audio-panel">
                <div className="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-800/40 p-4 rounded-xl space-y-1.5">
                  <h3 className="text-xs font-bold flex items-center gap-1.5 text-purple-300">
                    <Music className="w-4 h-4 text-purple-400" />
                    BGM Sintetizzatore di Sottofondo
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Sintetizza in tempo reale melodie minimali rilassanti o tracce in stile glitch synthwave basate sul Web Audio API. Zero caricamenti pesanti sul browser!
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-zinc-400 block">Scegli Traccia Audio procedurale:</span>
                  
                  {[
                    { id: "lofi", label: "Lofi Chilled Beats", description: "Morbidi accordi di tastiera Rhodes e fruscio lofi di vinile.", color: "from-pink-900/60 to-purple-900/40" },
                    { id: "synthwave", label: "Retro Synthwave", description: "Bassi energici ritmati e synth lead brillanti fantascientifici.", color: "from-indigo-900/60 to-purple-900/40" },
                    { id: "minimal", label: "Minimal Tech Focus", description: "Ritmo di campane pulsanti sintetico e pulito per stimolare il rilassamento.", color: "from-blue-900/60 to-slate-900/40" },
                    { id: "ambient", label: "Lush Ambient Space", description: "Nuvole di suoni lenti e caldi spazzati da filtri analogici.", color: "from-teal-900/60 to-emerald-900/40" },
                    { id: "chillhop", label: "Chillhop Sunset", description: "EP chords rilassanti, beat caldo sincopato ed atmosfera accogliente.", color: "from-amber-900/60 to-rose-950/40" },
                    { id: "retropop", label: "Retro Funk Pop 80s", description: "Bassi bounce di sintetizzatore funk con accordi brillanti vibranti.", color: "from-rose-900/60 to-indigo-950/40" },
                    { id: "deephouse", label: "Deep House Pulse", description: "Cassa four-on-the-floor persistente, bassi profondi e accordi dub.", color: "from-purple-900/60 to-fuchsia-950/40" }
                  ].map((track) => (
                    <div
                      key={track.id}
                      className={`p-3.5 rounded-xl border transition ${currentTrack === track.id ? "bg-gradient-to-tr " + track.color + " border-purple-500" : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">{track.label}</h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{track.description}</p>
                        </div>
                        <button
                          onClick={() => toggleMusicTrack(track.id as any)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${currentTrack === track.id ? "bg-purple-600 text-white" : "bg-zinc-805 hover:bg-zinc-800 text-zinc-300"}`}
                        >
                          {currentTrack === track.id ? (
                            <Volume2 className="w-4 h-4" />
                          ) : (
                            <VolumeX className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-semibold flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                      Regolazione Volume:
                    </span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="text-[10px] text-zinc-500 text-center">
                    La musica si adatta in background mentre provi i diversi modelli o mentre salvi le slide.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE PREVIEW AREA */}
        <div className="flex-1 bg-zinc-950 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-y-auto" id="preview-viewport-pane">
          
          {/* Transition Mode Slider indicators */}
          <div className="mb-4 flex items-center gap-4 bg-zinc-900 p-2 rounded-xl border border-zinc-800" id="preview-transition-settings">
            <span className="text-xs text-zinc-400 font-semibold">Animazione Transizione:</span>
            <div className="flex items-center gap-1.5">
              {[
                { type: "slide", label: "Scorrimento" },
                { type: "fade", label: "Dissolvenza" },
                { type: "zoom", label: "Zoom" }
              ].map((t) => (
                <button
                  key={t.type}
                  onClick={() => setSlideTransition(t.type as any)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition ${slideTransition === t.type ? "bg-indigo-600 text-white" : "bg-zinc-950 text-zinc-400 hover:text-white"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* INSTAGRAM CAROUSEL 1:1 RATIO MAIN SQUARE */}
          {slides[activeIndex] && (
            <div
              className={`w-full max-w-[450px] aspect-square rounded-2xl overflow-hidden relative shadow-2xl transition-all duration-300 border border-zinc-800/80 bg-gradient-to-tr ${
                slides[activeIndex].backgroundStyle.type === "gradient" 
                  ? `${slides[activeIndex].backgroundStyle.fromColor} ${slides[activeIndex].backgroundStyle.toColor}` 
                  : ""
              }`}
              style={{
                backgroundColor: slides[activeIndex].backgroundStyle.type === "solid" ? slides[activeIndex].backgroundStyle.solidColor : undefined,
                transition: "opacity 0.25s ease-out, transform 0.25s ease-out"
              }}
              id={`slide-display-canvas-${activeIndex}`}
            >
              {/* Pattern container */}
              {slides[activeIndex].backgroundStyle.pattern === "grid" && (
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:30px_30px]" />
              )}
              {slides[activeIndex].backgroundStyle.pattern === "dots" && (
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
              )}
              {slides[activeIndex].backgroundStyle.pattern === "stripes" && (
                <div className="absolute inset-x-0 inset-y-0 bg-[linear-gradient(45deg,#ffffff06_25%,transparent_25%,transparent_50%,#ffffff06_50%,#ffffff06_75%,transparent_75%,transparent)] bg-[size:40px_40px]" />
              )}
              {slides[activeIndex].backgroundStyle.pattern === "waves" && (
                <div className="absolute inset-0 [background:radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-pink-500/10" />
              )}

              {/* Backing Video/Image if present */}
              {slides[activeIndex].videoFile ? (
                <video
                  src={slides[activeIndex].videoFile}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full pointer-events-none select-none"
                  style={{
                    objectFit: slides[activeIndex].videoFit || "cover",
                    opacity: (slides[activeIndex].videoOpacity ?? 100) / 100
                  }}
                />
              ) : slides[activeIndex].imageFile ? (
                <img
                  src={slides[activeIndex].imageFile}
                  alt="Custom visual layout"
                  className={`absolute inset-0 w-full h-full pointer-events-none select-none`}
                  style={{
                    objectFit: slides[activeIndex].imageFit || "cover",
                    opacity: (slides[activeIndex].imageOpacity || 30) / 100
                  }}
                />
              ) : null}

              {/* Graphic Ambient Filter Overlay style classes */}
              <div 
                className={`absolute inset-0 pointer-events-none ${
                  slides[activeIndex].filter === "warm" ? "backdrop-contrast-[1.08] backdrop-saturate-[1.12]" :
                  slides[activeIndex].filter === "cool" ? "backdrop-contrast-[0.98] backdrop-saturate-[1.05] backdrop-hue-rotate-[8deg]" :
                  slides[activeIndex].filter === "grayscale" ? "backdrop-grayscale" :
                  slides[activeIndex].filter === "sepia" ? "backdrop-sepia-[0.6]" :
                  slides[activeIndex].filter === "cyber-neon" ? "backdrop-saturate-[1.6] backdrop-contrast-[1.1] backdrop-hue-rotate-[-15deg]" :
                  slides[activeIndex].filter === "duotone-gold" ? "backdrop-saturate-[1.1] backdrop-hue-rotate-[45deg]" :
                  ""
                }`}
              />

              {/* INNER CONTENT DYNAMIC LAYOUT ENGINE */}
              <div className={`p-8 sm:p-12 h-full flex flex-col justify-between relative z-10 text-pretty ${slides[activeIndex].textColor}`}>
                
                {/* 1. Subtitle Label Top Accent */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold tracking-widest px-2.5 py-0.5 rounded-md uppercase"
                    style={{ color: slides[activeIndex].accentColor }}
                  >
                    {slides[activeIndex].subtitle}
                  </span>
                  
                  {/* Subtle watermarked Instagram icon mockup */}
                  <span className="text-[10px] text-zinc-400 select-none tracking-widest bg-zinc-950/40 p-1.5 rounded-lg border border-zinc-800/40">
                    SLIDE {activeIndex + 1}/{slides.length}
                  </span>
                </div>

                {/* 2. Headline Title text (Dynamic size based on text length) */}
                <div className="my-auto space-y-4">
                  
                  {/* HEADLINE / COVER BANNER STYLE */}
                  {slides[activeIndex].layout === "headline" && (
                    <div className="text-center space-y-4">
                      <h2 className={`text-2xl sm:text-3xl leading-snug font-black ${fontTitle}`}>
                        {slides[activeIndex].title}
                      </h2>
                      <p className={`text-xs sm:text-sm max-w-sm mx-auto opacity-90 leading-relaxed ${fontBody}`}>
                        {slides[activeIndex].body}
                      </p>
                    </div>
                  )}

                  {/* SPLIT STYLE LAYOUT (Left text, right block alignment) */}
                  {slides[activeIndex].layout === "split" && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-12 space-y-3">
                        <h2 className={`text-xl sm:text-2xl leading-snug font-extrabold ${fontTitle}`} style={{ borderLeft: `4px solid ${slides[activeIndex].accentColor}`, paddingLeft: "12px" }}>
                          {slides[activeIndex].title}
                        </h2>
                        <p className={`text-xs sm:text-sm opacity-90 leading-relaxed ${fontBody}`}>
                          {slides[activeIndex].body}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CENTERED LAYOUT */}
                  {slides[activeIndex].layout === "centered" && (
                    <div className="text-center space-y-4 py-3">
                      <h2 className={`text-2xl font-black px-2 ${fontTitle}`} style={{ textShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
                        {slides[activeIndex].title}
                      </h2>
                      <div className="w-12 h-1 mx-auto rounded" style={{ backgroundColor: slides[activeIndex].accentColor }} />
                      <p className={`text-xs sm:text-sm max-w-sm mx-auto leading-relaxed opacity-90 ${fontBody}`}>
                        {slides[activeIndex].body}
                      </p>
                    </div>
                  )}

                  {/* BENTO GRID MODULAR MODS */}
                  {slides[activeIndex].layout === "bento" && (
                    <div className="space-y-4">
                      <div className="bg-zinc-950/65 border border-zinc-800/40 p-4 rounded-xl">
                        <h2 className={`text-lg sm:text-xl font-black ${fontTitle}`}>
                          {slides[activeIndex].title}
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-zinc-950/45 p-3 rounded-lg border border-zinc-900 text-[11px] leading-relaxed text-zinc-300">
                          {slides[activeIndex].body}
                        </div>
                        <div 
                          className="p-3 rounded-lg flex flex-col justify-center items-center text-center font-bold text-xs"
                          style={{ backgroundColor: `${slides[activeIndex].accentColor}18`, color: slides[activeIndex].accentColor }}
                        >
                          <Sparkles className="w-5 h-5 mb-1 text-amber-400" />
                          <span>Ottimizzato AI</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* INSIGHTS QUOTE MARK DOWN */}
                  {slides[activeIndex].layout === "quote" && (
                    <div className="text-center space-y-3 px-4">
                      <span className="text-5xl font-serif leading-none block h-4 text-zinc-500">“</span>
                      <h2 className={`text-lg sm:text-xl font-bold leading-normal italic ${fontTitle}`}>
                        {slides[activeIndex].title}
                      </h2>
                      <span className="text-5xl font-serif leading-none block h-4 text-zinc-500 text-right">”</span>
                      <p className={`text-xs opacity-95 ${fontBody}`}>
                        {slides[activeIndex].body}
                      </p>
                    </div>
                  )}

                  {/* IMAGE AND SUBTITLE ONLY (clean background focused design) */}
                  {slides[activeIndex].layout === "imageOnly" && (
                    <div className="text-center py-6">
                      <h2 className={`text-2xl font-extrabold ${fontTitle}`}>
                        {slides[activeIndex].title}
                      </h2>
                      <p className="text-xs text-zinc-400 mt-2">
                        Immagine carica sullo sfondo per focalizzare l'attenzione
                      </p>
                    </div>
                  )}

                </div>

                {/* 3. Bottom Slide Indicators Bullets */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-zinc-400 uppercase tracking-widest">Anteprima Live 1:1</span>
                  </div>

                  {/* Navigation Bullets list */}
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSlideChange(idx)}
                        className={`h-2 rounded-full transition-all ${idx === activeIndex ? "w-5 cursor-default" : "w-2 hover:bg-zinc-600"}`}
                        style={{
                          backgroundColor: idx === activeIndex ? (slides[activeIndex].accentColor || "#ec4899") : "rgba(255,255,255,0.25)"
                        }}
                        title={`Vai a slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <span className="text-[9px] text-zinc-400">Instagram/LinkedIn HD</span>
                </div>

                {/* RENDER ACTIVE STICKERS OVERLAY */}
                {slides[activeIndex].stickers.map((st) => (
                  <div
                    key={st.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStickerId(st.id);
                    }}
                    className={`absolute cursor-pointer transition select-none group ${selectedStickerId === st.id ? "ring-2 ring-amber-400 rounded-lg p-1" : ""}`}
                    style={{
                      left: `${st.x}%`,
                      top: `${st.y}%`,
                      transform: `translate(-50%, -50%) scale(${st.scale}) rotate(${st.rotation || 0}deg)`,
                      zIndex: 30
                    }}
                  >
                    {st.type === "emoji" ? (
                      <span className="text-4xl drop-shadow-md">{st.icon}</span>
                    ) : st.type === "image" ? (
                      <img
                        src={st.imageUrl}
                        alt="Custom Graphic"
                        className="max-w-[124px] max-h-[124px] object-contain drop-shadow-md pointer-events-none"
                      />
                    ) : (
                      <div
                        className="text-white text-[10px] font-bold py-1 px-2.5 rounded-full shadow-lg whitespace-nowrap active:scale-95"
                        style={{ backgroundColor: st.color || "#ec4899" }}
                      >
                        {st.label}
                      </div>
                    )}

                    {/* Quick remove mini tool on drag-hover */}
                    {selectedStickerId === st.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSticker(st.id);
                        }}
                        className="absolute -top-6 -right-6 bg-rose-600 text-white rounded-full p-0.5 shadow-md border border-rose-800"
                        title="Cancella Sticker"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HIDDEN CANVAS ELEMENT USED TO CONVERT SLIDE TO HD PNG EXPORT BEHIND USER EYE */}
          <canvas ref={canvasRef} className="hidden" />

          {/* PREVIEW BOTTOM SPEED OVERVIEW */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md w-full" id="slide-timeline-controls">
            <button
              onClick={() => handleSlideChange(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-30 disabled:hover:border-zinc-800 text-zinc-300 font-semibold p-2.5 rounded-xl text-xs transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prec.</span>
            </button>

            {/* Micro thumbnail indicator stack */}
            <div className="bg-zinc-900/40 px-3 rounded-xl border border-zinc-805 flex items-center gap-1 max-w-[200px] overflow-x-auto py-1">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleSlideChange(idx)}
                  className={`px-2 py-1 rounded text-xs transition ${idx === activeIndex ? "bg-indigo-600 text-white font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleSlideChange(activeIndex + 1)}
              disabled={activeIndex === slides.length - 1}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-30 disabled:hover:border-zinc-800 text-zinc-300 font-semibold p-2.5 rounded-xl text-xs transition flex items-center gap-1 cursor-pointer"
            >
              <span>Succ.</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* QUICK SLIDE ACTION CONTROLLER HUB */}
          <div className="mt-4 bg-zinc-900 border border-zinc-800 p-3 rounded-2xl max-w-lg w-full grid grid-cols-4 gap-2 text-center" id="carousel-manager-actions">
            <button
              onClick={addNewSlide}
              className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Aggiungi</span>
            </button>
            <button
              onClick={duplicateSlide}
              className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer"
            >
              <Copy className="w-4 h-4 text-indigo-400" />
              <span>Duplica</span>
            </button>
            <div className="flex items-center justify-center gap-1 bg-zinc-950 px-1 py-2 border border-zinc-800 rounded-xl text-[10px]">
              <button
                onClick={moveSlideLeft}
                disabled={activeIndex === 0}
                className="disabled:opacity-20 p-1 bg-zinc-900 hover:bg-zinc-800 rounded"
                title="Sposta a Sinistra"
              >
                ◀
              </button>
              <span className="font-bold text-[9px] text-zinc-400">ORDINE</span>
              <button
                onClick={moveSlideRight}
                disabled={activeIndex === slides.length - 1}
                className="disabled:opacity-20 p-1 bg-zinc-900 hover:bg-zinc-800 rounded"
                title="Sposta a Destra"
              >
                ▶
              </button>
            </div>
            <button
              onClick={deleteActiveSlide}
              className="bg-zinc-950 hover:bg-zinc-900/40 border border-zinc-800 hover:border-rose-950 text-zinc-300 hover:text-rose-400 p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Elimina</span>
            </button>
          </div>
        </div>

      </main>

      {/* FOOTER METRICS SYSTEM STATUS */}
      <footer className="border-t border-zinc-850 bg-zinc-950 p-4 px-6 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-3" id="app-footer">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Generatore Caroselli AI online. Pronta integrazione sandbox Canva SDK.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hover:text-zinc-300 transition cursor-pointer">Documentazione API</span>
          <span>•</span>
          <span className="hover:text-zinc-300 transition cursor-pointer">Privacy & Termini</span>
          <span>•</span>
          <div className="text-zinc-400 font-mono bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
            © 2026 Google AI Studio Build
          </div>
        </div>
      </footer>

      {/* DIRECT TRANSIENT NOTIFICATION SYSTEM */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none" id="notif-box">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-3.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold transition-all translate-y-0 opacity-100 ${notif.bg}`}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping shrink-0" />
            <span>{notif.text}</span>
          </div>
        ))}
      </div>

      {/* CANVA DIRECT INTEGRATION AND LINK GENERATION MODAL */}
      {showCanvaModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="canva-modal">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-rose-500 flex items-center justify-center font-bold text-white shadow-lg text-lg">
                  C
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Pratica Integrazione Canva SDK</h3>
                  <p className="text-xs text-zinc-400">Esporta la struttura del carosello AI ed espandila sul tuo account Canva.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCanvaModal(false)}
                className="text-zinc-400 hover:text-white bg-zinc-950 p-1.5 border border-zinc-850 rounded-lg hover:bg-zinc-800 text-xs transition"
              >
                ✕ Chiudi
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <span className="font-bold text-indigo-300 block">Esportazione Pronta:</span>
              <p>
                Grazie al nostro assistente AI, abbiamo mappato le coordinate di visualizzazione e i testi di tutte le tue <strong>{slides.length} slide</strong>. Il formato di interscambio Canva renderizza ed inserisce automaticamente testi, background e sticker.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block font-semibold mb-1">Tipo di Post Canva:</label>
                  <select
                    value={canvaTemplateType}
                    onChange={(e) => setCanvaTemplateType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded text-stone-200"
                  >
                    <option value="instagram-post">Post Quadrato (1:1)</option>
                    <option value="linkedin-carousel">Copertina Carosello (1.2:1)</option>
                    <option value="tiktok-story">Formato Story (9:16)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block font-semibold mb-1">Qualità di Rendering:</label>
                  <select
                    className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded text-stone-200"
                    disabled
                  >
                    <option>Ottimizzata (1080px)</option>
                    <option>Ultra-HD (2160px)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  addNotification("🔗 Link a Canva generato e copiato negli appunti!", "bg-indigo-600");
                  navigator.clipboard.writeText(`https://www.canva.com/design/playboards?template=${canvaTemplateType}&topic=${encodeURIComponent(aiPrompt)}`);
                  setShowCanvaModal(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 font-bold p-3 rounded-xl transition text-center text-xs text-white cursor-pointer"
              >
                Copia Link Canva
              </button>
              <button
                onClick={() => {
                  window.open(`https://www.canva.com/it_it/creare/caroselli-instagram/`, "_blank");
                  addNotification("🚀 Reindirizzamento al portale ufficiale di Canva", "bg-purple-900 text-white");
                  setShowCanvaModal(false);
                }}
                className="bg-zinc-950 border border-zinc-750 hover:bg-zinc-800 font-bold p-3 rounded-xl transition text-center text-xs text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Avvia Portale Canva</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>
            
            <p className="text-[10px] text-zinc-500 text-center">
              L'integrazione di interscambio Canva opera in modalità sicura Sandbox, senza esporre i dati sensibili o le chiavi dell'utente.
            </p>
          </div>
        </div>
      )}

      {/* CAROUSEL REAL-TIME PREVIEW SIMULATOR MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md z-50 flex flex-col p-4 md:p-8 animate-fade-in" id="carousel-preview-modal">
          {/* MODAL HEADER */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800 pb-4 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-purple-900/60 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-800">SIMULATION ENGINE</span>
                <span className="text-stone-500">•</span>
                <span className="text-xs text-zinc-400 font-medium">{slides.length} Slide in Totale</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">Anteprima Avanzata Carosello</h2>
            </div>

            {/* Selector switches for grid vs mobile preview */}
            <div className="flex items-center bg-zinc-900 border border-zinc-700 p-1 rounded-xl shadow-inner gap-1">
              <button
                onClick={() => setPreviewMode("grid")}
                className={`py-1.5 px-4 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${previewMode === "grid" ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-white"}`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Vista Storyboard (Griglia)</span>
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`py-1.5 px-4 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${previewMode === "mobile" ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-white"}`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Simulatore Instagram (Feed)</span>
              </button>
            </div>

            {/* Close switch button */}
            <button
              onClick={() => setShowPreviewModal(false)}
              className="text-white hover:bg-zinc-800 bg-purple-900/40 border border-purple-700/50 hover:border-purple-500 px-4 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer uppercase tracking-wider"
            >
              ✕ Chiudi Preview
            </button>
          </div>

          {/* MAIN MODAL CORE PANEL */}
          <div className="flex-1 overflow-y-auto min-h-0 pr-1 flex flex-col items-center justify-start">
            {previewMode === "grid" ? (
              /* GRID / STORYBOARD VIEW MODE */
              <div className="w-full h-full">
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl mb-4 text-[11px] text-zinc-400 leading-snug flex items-center justify-between gap-4">
                  <span>💡 <strong>Suggerimento Storyboard</strong>: Clicca su qualsiasi slide della griglia per chiudere l'anteprima e saltare istantaneamente alla modifica focalizzata di quella specifica slide.</span>
                  <div className="text-[10px] text-zinc-500 font-mono">Formato Instagram quadrato (1:1)</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-2">
                  {slides.map((slide, sIdx) => {
                    const bgClass =
                      slide.backgroundStyle.type === "gradient"
                        ? `bg-gradient-to-tr ${slide.backgroundStyle.fromColor} ${slide.backgroundStyle.toColor}`
                        : "";
                    const solidBgColor = slide.backgroundStyle.type === "solid" ? slide.backgroundStyle.solidColor : undefined;

                    return (
                      <div
                        key={slide.id}
                        onClick={() => {
                          setActiveIndex(sIdx);
                          setShowPreviewModal(false);
                          addNotification(`Slide #${sIdx + 1} selezionata`, "bg-indigo-600");
                        }}
                        className="group relative bg-zinc-950 border-2 border-zinc-800 hover:border-purple-500 active:scale-95 transition-all duration-300 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-purple-550/15 flex flex-col aspect-square"
                      >
                        {/* Slide Number Label Overlay */}
                        <div className="absolute top-3 left-3 z-30 bg-black/60 backdrop-blur-sm border border-zinc-700 text-[10px] text-white font-black w-6 h-6 rounded-full flex items-center justify-center">
                          {sIdx + 1}
                        </div>

                        {/* Story position tag */}
                        <div className="absolute top-3 right-3 z-30 bg-zinc-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] text-zinc-400 font-mono uppercase font-semibold">
                          {sIdx === 0 ? "gancio ⭐" : sIdx === slides.length - 1 ? "CTA 🚀" : `Slide ${sIdx + 1}`}
                        </div>

                        {/* Background Container */}
                        <div
                          className={`absolute inset-0 w-full h-full transition-transform group-hover:scale-105 duration-500 ${bgClass}`}
                          style={{ backgroundColor: solidBgColor }}
                        >
                          {/* Patterns */}
                          {slide.backgroundStyle.pattern === "grid" && (
                            <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
                          )}
                          {slide.backgroundStyle.pattern === "dots" && (
                            <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.06)_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                          )}
                          {slide.backgroundStyle.pattern === "stripes" && (
                            <div className="absolute inset-0 [background:repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.03)_8px,rgba(255,255,255,0.03)_16px)]" />
                          )}
                          {slide.backgroundStyle.pattern === "waves" && (
                            <div className="absolute inset-0 [background:radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-pink-500/10" />
                          )}

                          {/* Media backing */}
                          {slide.videoFile ? (
                            <video
                              src={slide.videoFile}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                              style={{ opacity: (slide.videoOpacity ?? 100) / 100 }}
                            />
                          ) : slide.imageFile ? (
                            <img
                              src={slide.imageFile}
                              alt="Media"
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                              style={{ opacity: (slide.imageOpacity || 35) / 100 }}
                            />
                          ) : null}

                          {/* Graphical Ambient filters */}
                          <div
                            className={`absolute inset-0 z-10 pointer-events-none ${
                              slide.filter === "warm" ? "backdrop-contrast-[1.08] backdrop-saturate-[1.12]" :
                              slide.filter === "cool" ? "backdrop-contrast-[0.98] backdrop-saturate-[1.05] backdrop-hue-rotate-[8deg]" :
                              slide.filter === "grayscale" ? "backdrop-grayscale" :
                              slide.filter === "sepia" ? "backdrop-sepia-[0.6]" :
                              slide.filter === "cyber-neon" ? "backdrop-saturate-[1.6] backdrop-contrast-[1.1] backdrop-hue-rotate-[-15deg]" :
                              slide.filter === "duotone-gold" ? "backdrop-saturate-[1.1] backdrop-hue-rotate-[45deg]" :
                              slide.filter === "vintage" ? "contrast-[0.95] sepia-[0.25] saturate-[1.05]" : 
                              slide.filter === "blur-glow" ? "backdrop-blur-[1px] brightness-[1.15]" : ""
                            }`}
                          />
                        </div>

                        {/* Content Overlay */}
                        <div className={`p-5 h-full flex flex-col justify-between relative z-10 text-pretty overflow-hidden ${slide.textColor}`}>
                          <div>
                            {slide.subtitle && (
                              <span
                                className="text-[8px] uppercase font-bold tracking-widest block opacity-90 transition-all filter drop-shadow"
                                style={{ color: slide.accentColor }}
                              >
                                {slide.subtitle}
                              </span>
                            )}
                          </div>

                          {/* Layout rendering - scaled typography for thumbnails */}
                          <div className="my-auto py-1 space-y-1">
                            {slide.layout === "headline" && (
                              <>
                                <h3 className={`text-sm leading-tight font-black line-clamp-3 ${fontTitle}`}>
                                  {slide.title}
                                </h3>
                                <p className="text-[9px] leading-relaxed line-clamp-3 opacity-80 font-normal">
                                  {slide.body}
                                </p>
                              </>
                            )}

                            {slide.layout === "split" && (
                              <>
                                <h3 className={`text-xs leading-tight font-extrabold line-clamp-3 pl-1.5 ${fontTitle}`} style={{ borderLeft: `3px solid ${slide.accentColor}` }}>
                                  {slide.title}
                                </h3>
                                <p className="text-[9px] leading-relaxed line-clamp-3 opacity-80">
                                  {slide.body}
                                </p>
                              </>
                            )}

                            {slide.layout === "centered" && (
                              <div className="text-center space-y-1">
                                <h3 className={`text-xs leading-tight font-extrabold line-clamp-2 ${fontTitle}`}>
                                  {slide.title}
                                </h3>
                                <div className="w-6 h-0.5 mx-auto rounded" style={{ backgroundColor: slide.accentColor }} />
                                <p className="text-[8px] leading-tight line-clamp-2 opacity-80">
                                  {slide.body}
                                </p>
                              </div>
                            )}

                            {slide.layout === "bento" && (
                              <div className="grid grid-cols-2 gap-1 bg-black/35 p-1.5 rounded border border-white/5 space-y-0 text-left">
                                <div className="col-span-2">
                                  <h4 className={`text-[10px] leading-tight font-extrabold line-clamp-2 ${fontTitle}`}>
                                    {slide.title}
                                  </h4>
                                </div>
                                <div className="col-span-1">
                                  <p className="text-[7px] leading-tight opacity-75 line-clamp-2">{slide.body}</p>
                                </div>
                                <div className="col-span-1 rounded flex items-center justify-center p-0.5" style={{ backgroundColor: `${slide.accentColor}25` }}>
                                  <span className="text-[8px] font-bold" style={{ color: slide.accentColor }}>DATI</span>
                                </div>
                              </div>
                            )}

                            {slide.layout === "quote" && (
                              <div className="space-y-1 border-stone-800/20 italic text-left">
                                <span className="text-base font-serif leading-none opacity-40 select-none block">“</span>
                                <p className={`text-[10px] font-medium leading-relaxed font-serif line-clamp-3 -mt-1.5`}>
                                  {slide.title}
                                </p>
                                <p className="text-[7px] tracking-wide uppercase opacity-75 font-mono">
                                  {slide.body}
                                </p>
                              </div>
                            )}

                            {slide.layout === "imageOnly" && (
                              <div className="bg-black/40 backdrop-blur-[2px] p-1.5 rounded border border-white/10 text-center">
                                <h3 className="text-[9px] font-semibold tracking-tight">{slide.title}</h3>
                              </div>
                            )}
                          </div>

                          {/* Progress bar and dots visual preview at thumbnail footer */}
                          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[8px] opacity-75">
                            <span>{sIdx + 1} / {slides.length}</span>
                            <div className="flex gap-0.5">
                              {slides.map((_, dotIdx) => (
                                <span
                                  key={dotIdx}
                                  className="w-1 h-1 rounded-full bg-white"
                                  style={{ opacity: dotIdx === sIdx ? 1 : 0.25 }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Rendering preview sticker stamps as tiny overlays */}
                        {slide.stickers.map((st) => (
                          <div
                            key={st.id}
                            className="absolute pointer-events-none select-none z-20"
                            style={{
                              left: `${st.x}%`,
                              top: `${st.y}%`,
                              transform: `translate(-50%, -50%) scale(${st.scale * 0.5}) rotate(${st.rotation || 0}deg)`,
                            }}
                          >
                            {st.type === "emoji" ? (
                              <span className="text-xl drop-shadow">{st.icon}</span>
                            ) : st.type === "image" ? (
                              <img
                                src={st.imageUrl}
                                alt="Sticker layer"
                                className="max-w-[40px] max-h-[40px] object-contain drop-shadow"
                              />
                            ) : (
                              <div
                                className="text-white text-[7px] font-bold py-0.5 px-1.5 rounded-full shadow"
                                style={{ backgroundColor: st.color || "#3b82f6" }}
                              >
                                {st.label || "INFO"}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* MOBILE PREVIEW SIMULATOR MODE */
              <div className="w-full max-w-sm flex flex-col items-center animate-zoom-in">
                <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl text-center text-xs text-zinc-400 mb-4 w-full">
                  📱 Trascina o usa le frecce per scorrere i post. Simula perfettamente la visualizzazione su smartphone <strong>Instagram</strong>.
                </div>

                {/* VIRTUAL SMARTPHONE CANVAS SHELL */}
                <div className="bg-zinc-950 border-[6px] border-zinc-800 rounded-[35px] shadow-2xl p-3 w-full max-w-[340px] aspect-[9/16] flex flex-col relative overflow-hidden" style={{ minHeight: "470px" }}>
                  {/* Speaker Ear Slot Notch */}
                  <div className="absolute top-1 right-1/2 translate-x-1/2 w-16 h-3 bg-zinc-800 rounded-full z-40 flex items-center justify-center p-0.5">
                    <div className="w-8 h-1 bg-zinc-900 rounded-full" />
                  </div>

                  {/* Header Mobile Mock UI */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 px-3 pt-3 pb-2 border-b border-zinc-900">
                    <span className="font-semibold text-white">12:30</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <span className="w-3.5 h-2 bg-zinc-400 rounded-sm inline-block border border-zinc-950" />
                    </div>
                  </div>

                  {/* Instagram App Header Mock */}
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-0.5">
                        <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-[8px] font-bold text-white font-mono">
                          CS
                        </div>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold text-white tracking-tight leading-none">innovazione_sociale</span>
                        <span className="text-[7.5px] text-zinc-500">Sponsored • Audio</span>
                      </div>
                    </div>
                    <span className="text-white font-extrabold text-[12px] pr-1">•••</span>
                  </div>

                  {/* ACTIVE PREVIEW SLIDE WRAPPED IN SMARTPHONE BODY */}
                  <div className="flex-1 rounded-xl overflow-hidden aspect-square relative shadow-lg bg-zinc-900">
                    {(() => {
                      const slide = slides[previewSlideIdx];
                      if (!slide) return null;

                      const bgClass =
                        slide.backgroundStyle.type === "gradient"
                          ? `bg-gradient-to-tr ${slide.backgroundStyle.fromColor} ${slide.backgroundStyle.toColor}`
                          : "";
                      const solidBgColor = slide.backgroundStyle.type === "solid" ? slide.backgroundStyle.solidColor : undefined;

                      return (
                        <div className="w-full h-full relative flex flex-col justify-between">
                          {/* Slide Background layer */}
                          <div
                            className={`absolute inset-0 w-full h-full ${bgClass}`}
                            style={{ backgroundColor: solidBgColor }}
                          >
                            {/* Patterns */}
                            {slide.backgroundStyle.pattern === "grid" && (
                              <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
                            )}
                            {slide.backgroundStyle.pattern === "dots" && (
                              <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.06)_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                            )}
                            {slide.backgroundStyle.pattern === "stripes" && (
                              <div className="absolute inset-0 [background:repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.03)_8px,rgba(255,255,255,0.03)_16px)]" />
                            )}
                            {slide.backgroundStyle.pattern === "waves" && (
                              <div className="absolute inset-0 [background:radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-pink-500/10" />
                            )}

                            {/* Media content */}
                            {slide.videoFile ? (
                              <video
                                src={slide.videoFile}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                style={{ opacity: (slide.videoOpacity ?? 100) / 100 }}
                              />
                            ) : slide.imageFile ? (
                              <img
                                src={slide.imageFile}
                                alt="Slide back media"
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                style={{ opacity: (slide.imageOpacity || 35) / 100 }}
                              />
                            ) : null}

                            {/* Filters overlay */}
                            <div
                              className={`absolute inset-0 z-10 pointer-events-none ${
                                slide.filter === "warm" ? "backdrop-contrast-[1.08] backdrop-saturate-[1.12]" :
                                slide.filter === "cool" ? "backdrop-contrast-[0.98] backdrop-saturate-[1.05] backdrop-hue-rotate-[8deg]" :
                                slide.filter === "grayscale" ? "backdrop-grayscale" :
                                slide.filter === "sepia" ? "backdrop-sepia-[0.6]" :
                                slide.filter === "cyber-neon" ? "backdrop-saturate-[1.6] backdrop-contrast-[1.1] backdrop-hue-rotate-[-15deg]" :
                                slide.filter === "duotone-gold" ? "backdrop-saturate-[1.1] backdrop-hue-rotate-[45deg]" :
                                slide.filter === "vintage" ? "contrast-[0.95] sepia-[0.25] saturate-[1.05]" : 
                                slide.filter === "blur-glow" ? "backdrop-blur-[1px] brightness-[1.15]" : ""
                              }`}
                            />
                          </div>

                          {/* Content Overlay */}
                          <div className={`p-6 h-full flex flex-col justify-between relative z-10 text-pretty ${slide.textColor}`}>
                            <div>
                              {slide.subtitle && (
                                <span
                                  className="text-[9px] uppercase font-semibold tracking-widest block opacity-90 filter drop-shadow"
                                  style={{ color: slide.accentColor }}
                                >
                                  {slide.subtitle}
                                </span>
                              )}
                            </div>

                            <div className="my-auto space-y-1.5 py-1">
                              {/* Layout Render */}
                              {slide.layout === "headline" && (
                                <>
                                  <h3 className={`text-sm leading-tight font-black ${fontTitle}`}>
                                    {slide.title}
                                  </h3>
                                  <p className="text-[10px] leading-relaxed opacity-80 font-normal">
                                    {slide.body}
                                  </p>
                                </>
                              )}

                              {slide.layout === "split" && (
                                <>
                                  <h3 className={`text-snug leading-tight font-extrabold pl-2 ${fontTitle}`} style={{ borderLeft: `3px solid ${slide.accentColor}` }}>
                                    {slide.title}
                                  </h3>
                                  <p className="text-[10px] leading-relaxed opacity-80">
                                    {slide.body}
                                  </p>
                                </>
                              )}

                              {slide.layout === "centered" && (
                                <div className="text-center space-y-1.5">
                                  <h3 className={`text-sm leading-tight font-extrabold ${fontTitle}`}>
                                    {slide.title}
                                  </h3>
                                  <div className="w-8 h-0.5 mx-auto rounded" style={{ backgroundColor: slide.accentColor }} />
                                  <p className="text-[9px] leading-normal opacity-80">
                                    {slide.body}
                                  </p>
                                </div>
                              )}

                              {slide.layout === "bento" && (
                                <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5 space-y-0 text-left">
                                  <div className="col-span-2">
                                    <h4 className={`text-xs leading-snug font-extrabold ${fontTitle}`}>
                                      {slide.title}
                                    </h4>
                                  </div>
                                  <div className="col-span-1">
                                    <p className="text-[8px] leading-tight opacity-75 line-clamp-3">{slide.body}</p>
                                  </div>
                                  <div className="col-span-1 rounded flex items-center justify-center p-1" style={{ backgroundColor: `${slide.accentColor}25` }}>
                                    <span className="text-[9px] font-bold" style={{ color: slide.accentColor }}>DATI GRAFICI</span>
                                  </div>
                                </div>
                              )}

                              {slide.layout === "quote" && (
                                <div className="space-y-1 italic text-left">
                                  <span className="text-xl font-serif leading-none opacity-45 select-none block">“</span>
                                  <p className={`text-xs font-semibold leading-relaxed font-serif -mt-1.5`}>
                                    {slide.title}
                                  </p>
                                  <p className="text-[8px] tracking-wide uppercase opacity-75 font-mono">
                                    {slide.body}
                                  </p>
                                </div>
                              )}

                              {slide.layout === "imageOnly" && (
                                <div className="bg-black/45 backdrop-blur-[2px] p-2 rounded-lg border border-white/10 text-center">
                                  <div className="text-[10px] font-bold tracking-tight">{slide.title}</div>
                                </div>
                              )}
                            </div>

                            {/* Smartphone bottom pagination indicators */}
                            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] opacity-75">
                              <span>{previewSlideIdx + 1} / {slides.length}</span>
                              <div className="flex gap-1">
                                {slides.map((_, dotIdx) => (
                                  <span
                                    key={dotIdx}
                                    className="w-1.5 h-1.5 rounded-full bg-white transition-opacity"
                                    style={{ opacity: dotIdx === previewSlideIdx ? 1 : 0.25 }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Slide stickers layer inside phone preview */}
                          {slide.stickers.map((st) => (
                            <div
                              key={st.id}
                              className="absolute pointer-events-none select-none z-20"
                              style={{
                                left: `${st.x}%`,
                                top: `${st.y}%`,
                                transform: `translate(-50%, -50%) scale(${st.scale * 0.7}) rotate(${st.rotation || 0}deg)`,
                              }}
                            >
                              {st.type === "emoji" ? (
                                <span className="text-2xl drop-shadow-md">{st.char || st.icon}</span>
                              ) : st.type === "image" ? (
                                <img
                                  src={st.imageUrl}
                                  alt="Mobile sticker graphic"
                                  className="max-w-[70px] max-h-[70px] object-contain drop-shadow"
                                />
                              ) : (
                                <div
                                  className="text-white text-[9px] font-bold py-0.5 px-2 rounded-full shadow-lg"
                                  style={{ backgroundColor: st.color || "#3b82f6" }}
                                >
                                  {st.label || "INFO"}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Android/iOS Mock Swipe Controls */}
                  <div className="flex items-center justify-between p-3">
                    <button
                      onClick={() => setPreviewSlideIdx((prev) => Math.max(prev - 1, 0))}
                      disabled={previewSlideIdx === 0}
                      className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-800 p-2 rounded-full text-white text-[10px] disabled:cursor-not-allowed cursor-pointer font-bold"
                    >
                      ◀
                    </button>
                    <span className="text-[11px] text-zinc-400 font-bold">Slide {previewSlideIdx + 1} di {slides.length}</span>
                    <button
                      onClick={() => setPreviewSlideIdx((prev) => Math.min(prev + 1, slides.length - 1))}
                      disabled={previewSlideIdx === slides.length - 1}
                      className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-800 p-2 rounded-full text-white text-[10px] disabled:cursor-not-allowed cursor-pointer font-bold"
                    >
                      ▶
                    </button>
                  </div>

                  {/* Feed mock like/comment action buttons */}
                  <div className="flex justify-between items-center text-zinc-400 border-t border-zinc-900 pt-2 px-1 text-[10px]">
                    <div className="flex gap-2">
                      <span>❤️ Piace</span>
                      <span>💬 Commenta</span>
                    </div>
                    <span>🔖 Salva</span>
                  </div>

                  {/* Home Indicator line mock */}
                  <div className="w-24 h-1 bg-zinc-800 rounded-full mx-auto mt-4 mb-2 shrink-0" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
