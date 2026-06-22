import { projectImages } from "./media";

export type ProjectStatus = "active" | "completed";

export interface Project {
  slug: string;
  title: string;
  programme: string;
  funder: string;
  status: ProjectStatus;
  countries: string[];
  summary: string;
  description: string;
  image?: string;
  externalUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "eu-support-phase-ii",
    title: "EU Support to REDI Phase II",
    programme: "DG ENEST",
    funder: "European Union",
    status: "active",
    countries: ["Serbia", "North Macedonia", "Turkey", "Albania", "Montenegro"],
    summary:
      "Advancing Roma entrepreneurs in the Western Balkans and Türkiye through Regional Business Centers.",
    description:
      "This EU-funded initiative builds upon the success of Phase I, offering training, mentoring, financing access, and green digital transformation tools for Roma entrepreneurs and unemployed individuals.",
    image: projectImages["eu-support-phase-ii"],
    externalUrl: "https://redi-ngo.eu/advancing-roma-entrepreneurs-in-the-western-balkans/",
  },
  {
    slug: "eu-support-phase-i",
    title: "EU Support to REDI Phase I",
    programme: "EU Grant",
    funder: "European Union",
    status: "completed",
    countries: ["Serbia", "North Macedonia"],
    summary: "Advancing employment and economic situation of Roma in Serbia and North Macedonia.",
    description:
      "The overall objective was to advance employment and the economic situation of Roma through business facilitation, training, and access to finance.",
    image: projectImages["eu-support-phase-i"],
  },
  {
    slug: "gea",
    title: "Green Entrepreneurs in Action (GEA)",
    programme: "Erasmus+ KA2",
    funder: "European Commission",
    status: "active",
    countries: ["Romania", "Italy", "North Macedonia", "Serbia", "Spain"],
    summary: "Strategic partnership increasing young Roma entrepreneurship potential.",
    description:
      "A strategic partnership of 5 organizations sharing a vision towards increasing young Roma people's entrepreneurship potential, with focus on green and sustainable business models.",
    image: projectImages.gea,
    externalUrl: "https://redi-ngo.eu/gea-green-entrepreneurs-in-action/",
  },
  {
    slug: "mosaic",
    title: "MOSAIC",
    programme: "Erasmus+ KA2",
    funder: "European Commission",
    status: "active",
    countries: ["Romania", "Bulgaria", "Spain", "Italy"],
    summary: "Inclusive entrepreneurship support for underrepresented entrepreneurs in Europe.",
    description:
      "MOSAIC launched essential resources including a knowledge hub and guide to support underrepresented entrepreneurs across Europe with inclusive business development tools.",
    image: projectImages.mosaic,
    externalUrl: "https://redi-ngo.eu/mosaic-project/",
  },
  {
    slug: "institutional-capacity",
    title: "Institutional Capacity Building",
    programme: "OSF Grant",
    funder: "Open Society Foundations",
    status: "completed",
    countries: ["Romania"],
    summary: "Building REDI as an ecosystem connector for Roma entrepreneurs.",
    description:
      "Supported REDI to become an ecosystem builder and connector between Roma entrepreneurs operating in their communities and the mainstream business environment.",
    image: projectImages["institutional-capacity"],
  },
  {
    slug: "socio-economic-inclusion",
    title: "Socio-economic Inclusion in Rural Communities",
    programme: "EEA Grants",
    funder: "EEA & Norway Grants",
    status: "completed",
    countries: ["Romania"],
    summary: "Inclusion of Roma in inter-ethnic rural communities in Teleorman and Giurgiu.",
    description:
      "Increased socio-economic inclusion of vulnerable groups in 5 rural communities: Blejesti, Ciuperceni, Comana, Prundu, and Hotarele through entrepreneurship training and community engagement.",
    image: projectImages["socio-economic-inclusion"],
  },
  {
    slug: "visegrad-advocacy",
    title: "Roma Business Advocacy & Policy Lab",
    programme: "Visegrad Fund",
    funder: "International Visegrad Fund",
    status: "active",
    countries: ["Czech Republic", "Hungary", "Poland", "Slovakia"],
    summary: "Innovation, R&D, and entrepreneurship advocacy for Roma businesses.",
    description:
      "A policy lab focused on Roma business advocacy, connecting entrepreneurs with policymakers and strengthening the voice of Roma businesses in Central Europe.",
    image: projectImages["visegrad-advocacy"],
    externalUrl: "https://redi-ngo.eu/visegrad2025/",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
