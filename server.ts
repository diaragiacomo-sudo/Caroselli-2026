import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. API Route for Gemini Carousel Generation
app.post("/api/gemini/suggest-carousel", async (req, res) => {
  try {
    const { prompt, slideCount = 5, theme = "modern" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Un prompt è obbligatorio." });
    }

    if (!ai) {
      // Fallback response with beautiful ready-to-use carousel slides if API key is not yet available
      console.warn("GEMINI_API_KEY non trovata. Uso i dati di fallback.");
      return res.json(getFallbackCarousel(prompt, slideCount, theme));
    }

    const aiPrompt = `Sei un esperto copywriter e social media designer. Crea una sequenza coerente di ${slideCount} slide per un carosello Instagram/LinkedIn sul tema: "${prompt}".
Il design totale deve avere lo stile: "${theme}". 
I testi devono essere scritti in Italiano, coinvolgenti (con hooks, call to action finale e body chiaro).
Genera una struttura JSON rigorosa che definisce tutte le slide dal primo all'ultimo passaggio.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: aiPrompt,
      config: {
        systemInstruction: `Sei un assistente AI specializzato nella progettazione di layout di caroselli ad alto impatto per Instagram, LinkedIn e TikTok.
Ritorna SEMPRE un JSON valido secondo lo schema fornito. Non aggiungere prefissi, markdown o spiegazioni extra, ritorna solo il JSON.
Il carosello deve contenere esattamente il numero richiesto di slide.
Tutte le risposte testuali devono essere in Italiano corretto e accattivante.
I colori di sfondo Tailwind disponibili sono:
- Palette blu/indigo: "from-blue-600 to-indigo-800", "from-indigo-900 to-slate-900"
- Palette calde: "from-amber-500 to-rose-600", "from-rose-500 to-pink-600"
- Palette oscure-cyberpunk: "from-slate-900 to-purple-950", "from-zinc-900 to-emerald-950"
- Palette vivaci: "from-teal-600 to-emerald-800", "from-violet-600 to-fuchsia-800"
- Palette delicate: "from-neutral-500 to-slate-700"
Assicurati di alternare in modo saggio o mantenere coerente lo sfondo.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["carouselTitle", "slides"],
          properties: {
            carouselTitle: {
              type: Type.STRING,
              description: "Titolo complessivo del carosello",
            },
            slides: {
              type: Type.ARRAY,
              description: "Sequenza di slide del carosello",
              items: {
                type: Type.OBJECT,
                required: ["title", "subtitle", "body", "layout", "fromColor", "toColor", "textColor", "accentColor", "stickers"],
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Titolo principale della slide. Massimo 40 caratteri.",
                  },
                  subtitle: {
                    type: Type.STRING,
                    description: "Sottotitolo o Etichetta della slide (es. 'STEP 1', 'IL PROBLEMA').",
                  },
                  body: {
                    type: Type.STRING,
                    description: "Testo di approfondimento della slide. Massimo 120 caratteri.",
                  },
                  layout: {
                    type: Type.STRING,
                    enum: ["centered", "split", "headline", "bento", "quote", "imageOnly"],
                    description: "Layout visivo ottimale per questa slide",
                  },
                  fromColor: {
                    type: Type.STRING,
                    description: "Colore iniziale gradiente Tailwind (es: violet-600, blue-900, zinc-900)",
                  },
                  toColor: {
                    type: Type.STRING,
                    description: "Colore finale gradiente Tailwind (es: purple-900, indigo-950, pink-600)",
                  },
                  textColor: {
                    type: Type.STRING,
                    enum: ["text-white", "text-slate-900", "text-slate-100"],
                    description: "Colore del testo principale",
                  },
                  accentColor: {
                    type: Type.STRING,
                    description: "Un colore di accento per dettagli (es. '#10B981', '#EC4899', '#F59E0B')",
                  },
                  stickers: {
                    type: Type.ARRAY,
                    description: "Sticker suggeriti da posizionare su questa slide",
                    items: {
                      type: Type.OBJECT,
                      required: ["type", "icon", "label", "x", "y", "scale"],
                      properties: {
                        type: {
                          type: Type.STRING,
                          enum: ["emoji", "shape", "badge"],
                        },
                        icon: {
                          type: Type.STRING,
                          description: "Nome dell'icona lucide (es. 'Sparkles', 'ArrowRight', 'Star', 'Flame') o emoji",
                        },
                        label: {
                          type: Type.STRING,
                          description: "Eventuale etichetta testuale dello sticker o badge (es: 'NUOVO', 'SWIPE WORD 👉')",
                        },
                        x: {
                          type: Type.INTEGER,
                          description: "Percentuale coordinata X (da 10 a 90)",
                        },
                        y: {
                          type: Type.INTEGER,
                          description: "Percentuale coordinata Y (da 10 a 90)",
                        },
                        scale: {
                          type: Type.NUMBER,
                          description: "Fattore di scala dello sticker (es: 1.0, 1.2)",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Risposta vuota dall'AI.");
    }

    const data = JSON.parse(text.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Errore chiamata Gemini:", error);
    // Return graceful rich fallback instead of crashing
    return res.status(500).json({
      error: error.message || "Errore sconosciuto nella generazione AI",
      fallback: getFallbackCarousel(req.body.prompt || "Idee per carosello", req.body.slideCount || 4, req.body.theme || "modern"),
    });
  }
});

// Fallback carousel generation function in case Gemini API is offline or key missing
function getFallbackCarousel(prompt: string, count: number, theme: string) {
  const isDark = theme === "cyber" || theme === "dark";
  const titles = [
    `Come dominare: ${prompt}`,
    "Il segreto svelato",
    "La guida passo passo",
    "Cosa dicono gli esperti",
    "Mettilo in pratica subito!",
  ];
  const subtitles = [
    "INTRODUZIONE",
    "IL PROBLEMA",
    "LA SOLUZIONE",
    "PRO TIP",
    "CALL TO ACTION",
  ];
  const bodies = [
    `Scopri le migliori strategie riguardanti ${prompt} per far crescere la tua attività e migliorare la tua presenza online.`,
    "Molti fanno ancora l'errore di trascurare i dettagli base. Ecco i primi aspetti cruciali da ottimizzare subito.",
    "Applica questo metodo per ridurre le ore di lavoro improduttivo e focalizzarsi solo sulla qualità.",
    "Ispirati ai migliori del settore: sperimenta combinazioni cromatiche vivaci e testi corti ma impattanti.",
    "Salva questo carosello, lascia un commento con la tua opinione e tagga un collega a cui serve!",
  ];

  const slides = Array.from({ length: Math.min(count, 5) }, (_, i) => {
    let fromColor = "from-indigo-600";
    let toColor = "to-purple-800";
    if (theme === "coral") {
      fromColor = "from-rose-500";
      toColor = "to-pink-600";
    } else if (theme === "emerald") {
      fromColor = "from-teal-600";
      toColor = "to-emerald-800";
    } else if (theme === "amber") {
      fromColor = "from-amber-500";
      toColor = "to-orange-600";
    } else if (theme === "neutral") {
      fromColor = "from-neutral-700";
      toColor = "to-slate-900";
    }

    return {
      title: titles[i % titles.length],
      subtitle: subtitles[i % subtitles.length],
      body: bodies[i % bodies.length],
      layout: i === 0 ? "headline" : i === count - 1 ? "centered" : ["split", "bento", "quote"][i % 3],
      fromColor,
      toColor,
      textColor: "text-white",
      accentColor: i % 2 === 0 ? "#10B981" : "#F59E0B",
      stickers: [
        {
          type: "badge",
          icon: i === 0 ? "Sparkles" : i === count - 1 ? "Flame" : "ArrowRight",
          label: i === count - 1 ? "SALVA ORA!" : "LEGGI 👉",
          x: 50,
          y: i === 0 ? 80 : 85,
          scale: 1.1,
        },
      ],
    };
  });

  return {
    carouselTitle: `Carosello: ${prompt}`,
    slides,
  };
}

// 2. Setup Vite / Static Files Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
