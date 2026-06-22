/** Real photos from redi-ngo.eu — used across the site */

const BASE = "https://redi-ngo.eu";

export function img(path: string): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export const heroImages = {
  home: img("/wp-content/uploads/2021/09/DSC_5739_1-scaled.jpg"),
  projects: img("/wp-content/uploads/2025/06/1-IMG_20250307_134950.jpg"),
  tenders: "/hero/tenders.png",
  jobs: img("/wp-content/uploads/2022/10/13.jpg"),
  media: img("/wp-content/uploads/2022/10/1665741264124.jpg"),
} as const;

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption?: string;
  category: "events" | "community" | "entrepreneurs" | "projects" | "team";
}

export const galleryPhotos: GalleryPhoto[] = [
  { src: img("/wp-content/uploads/2021/09/DSC_5739_1-scaled.jpg"), alt: "Roma entrepreneurs incubator", caption: "Entrepreneurs incubator programme", category: "entrepreneurs" },
  { src: img("/wp-content/uploads/2022/04/11-scaled.jpg"), alt: "REDI Business Club launch", caption: "REDI Business Club launch", category: "events" },
  { src: img("/wp-content/uploads/2022/10/1665741264124.jpg"), alt: "Intercultural dialogue event", caption: "Intercultural dialogue in communities", category: "community" },
  { src: img("/wp-content/uploads/2022/10/13.jpg"), alt: "Youth entrepreneurship training", caption: "118 youth trained in entrepreneurship", category: "projects" },
  { src: img("/wp-content/uploads/2022/10/7.jpg"), alt: "Project launch event", caption: "Socio-economic inclusion project launch", category: "projects" },
  { src: img("/wp-content/uploads/2022/10/14.jpg"), alt: "Traditional Roma crafts", caption: "Traditional Roma crafts exhibition", category: "community" },
  { src: img("/wp-content/uploads/2022/10/5.jpg"), alt: "Crafts communities Vâlcea", caption: "Roma crafts communities in Vâlcea", category: "community" },
  { src: img("/wp-content/uploads/2021/04/DSC_0238-scaled.jpg"), alt: "REDI team at event", caption: "REDI team at community event", category: "team" },
  { src: img("/wp-content/uploads/2021/04/DSC_0253-scaled.jpg"), alt: "Community workshop", caption: "Community workshop", category: "events" },
  { src: img("/wp-content/uploads/2021/04/pe-camp.jpg"), alt: "Field activity", caption: "Field activities with communities", category: "community" },
  { src: img("/wp-content/uploads/2021/04/IMG_4264-scaled.jpg"), alt: "Team activity", caption: "Team building and training", category: "team" },
  { src: img("/wp-content/uploads/2025/06/1-IMG_20250307_134950.jpg"), alt: "MOSAIC resource launch", caption: "MOSAIC project resource launch", category: "projects" },
  { src: img("/wp-content/uploads/2025/06/Picture1.jpg"), alt: "MOSAIC inclusive entrepreneurship", caption: "MOSAIC inclusive entrepreneurship event", category: "projects" },
  { src: img("/wp-content/uploads/2026/01/IMG_20260115_180351.jpg"), alt: "REDI Fund EIF loan", caption: "€2M EIF loan for Roma entrepreneurship", category: "events" },
  { src: img("/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-17-at-09.40.02.jpeg"), alt: "DIGIFAST digital skills seminar", caption: "DIGIFAST digital skills seminar", category: "projects" },
  { src: img("/wp-content/uploads/2022/03/WhatsApp-Image-2022-03-17-at-09.29.56.jpeg"), alt: "Humanitarian support", caption: "Humanitarian support for Ukraine refugees", category: "community" },
  { src: img("/wp-content/uploads/2023/04/General-post-Roma-Week-image.jpg"), alt: "Roma Week 2023", caption: "Roma Week at the European Parliament", category: "events" },
  { src: img("/wp-content/uploads/2021/04/5-11-1024x650-1.jpg"), alt: "Community gathering", caption: "Community gathering", category: "community" },
  { src: img("/wp-content/uploads/2022/10/17.jpg"), alt: "REDI outreach in communities", caption: "REDI team outreach in rural communities", category: "team" },
  { src: img("/wp-content/uploads/2026/04/Screenshot-2026-04-28-183455.png"), alt: "The broom maker from Clejani", caption: "Cristian Ștefan — broom maker from Clejani", category: "entrepreneurs" },
];

export const projectImages: Record<string, string> = {
  "eu-support-phase-ii": img("/wp-content/uploads/2021/09/DSC_5739_1-scaled.jpg"),
  "eu-support-phase-i": img("/wp-content/uploads/2021/07/Untitled-1.png"),
  gea: img("/wp-content/uploads/2023/05/antreprenoriat-verde_v11.png"),
  mosaic: img("/wp-content/uploads/2025/06/1-IMG_20250307_134950.jpg"),
  "institutional-capacity": img("/wp-content/uploads/2021/04/DSC_0238-scaled.jpg"),
  "socio-economic-inclusion": img("/wp-content/uploads/2022/10/1665741264124.jpg"),
  "visegrad-advocacy": img("/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-27-at-13.25.05.jpeg"),
};
