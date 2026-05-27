export type LayoutType = "centered" | "split" | "headline" | "bento" | "quote" | "imageOnly";

export interface Sticker {
  id: string;
  type: "emoji" | "shape" | "badge" | "image";
  icon: string; // Lucide icon name or Emoji literal
  imageUrl?: string; // Base64 or object URL of client uploaded sticker image
  label?: string; // For badges (e.g., "SWIPE 👉" or "TIPS")
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  scale: number; // 0.5 to 2.5
  rotation?: number; // 0 to 360 degrees
  color?: string; // Custom sticker color
}

export interface BackgroundStyle {
  type: "solid" | "gradient" | "pattern";
  fromColor: string; // Tailwind color e.g. "from-blue-600"
  toColor?: string; // Tailwind color e.g. "to-indigo-800"
  solidColor?: string; // Custom hex or simple CSS color
  pattern?: "none" | "dots" | "waves" | "stripes" | "grid";
}

export type GraphicFilter = 
  | "none" 
  | "warm" 
  | "cool" 
  | "grayscale" 
  | "sepia" 
  | "cyber-neon" 
  | "vintage" 
  | "duotone-gold" 
  | "blur-glow";

export interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  layout: LayoutType;
  backgroundStyle: BackgroundStyle;
  textColor: string; // "text-white" | "text-slate-900" | "text-slate-100"
  accentColor: string; // hex or tailwind text accent color
  stickers: Sticker[];
  imageFile?: string | null; // Data URL of custom uploaded slide image
  imageFit?: "cover" | "contain";
  imageOpacity?: number; // 0 to 100
  videoFile?: string | null; // Data URL or object URL of custom uploaded video background
  videoFit?: "cover" | "contain";
  videoOpacity?: number; // 0 to 100
  filter: GraphicFilter;
}

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  fontTitle: string;
  fontBody: string;
  slides: Omit<SlideData, "id">[];
}

export interface Soundtrack {
  id: string;
  name: string;
  genre: string;
  isPlaying: boolean;
}
