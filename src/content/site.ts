export const siteConfig = {
  name: "REDI NGO",
  tagline: "Empowering Roma entrepreneurs across Europe",
  description:
    "REDI is an ecosystem builder and connector between Roma entrepreneurs operating in their communities and the mainstream business environment.",
  url: "https://redi-ngo.eu",
  email: "info@redi-ngo.eu",
  social: {
    facebook: "https://www.facebook.com/REDINGO",
    linkedin: "https://www.linkedin.com/company/redi-ngo",
    twitter: "https://twitter.com/REDINGO",
  },
} as const;

export const stats = [
  { value: "7", label: "Countries" },
  { value: "500+", label: "Entrepreneurs supported" },
  { value: "€2M+", label: "Funding facilitated" },
  { value: "29", label: "Network partners" },
] as const;

export const countries = [
  { code: "RO", name: "Romania", since: 2016 },
  { code: "MK", name: "North Macedonia", since: 2019 },
  { code: "RS", name: "Serbia", since: 2020 },
  { code: "BG", name: "Bulgaria", since: 2022 },
  { code: "BE", name: "Belgium", since: 2023 },
  { code: "TR", name: "Turkey", since: 2024 },
  { code: "SK", name: "Slovakia", since: 2024 },
] as const;

export const navItems = [
  { href: "/projects", labelKey: "nav.projects" },
  { href: "/work-with-us", labelKey: "nav.workWithUs" },
  { href: "/media", labelKey: "nav.media" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/news", labelKey: "nav.news" },
  { href: "/contact", labelKey: "nav.contact" },
] as const;
