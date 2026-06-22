/** Shared opportunity classification — exported for pages */
const JOB_PATTERNS =
  /^(call-for-intern|internship|sales-manager|country-manager|business-facilitator|communication-expert|communication-officer|financial-officer|tor-|terms-of-reference|local-dissemination|expert-research|program-assistant|administrative|manager-de-proiect|asistent-de|truck-driver|facilitator|повик-за-практикант|повик-за-грантови|повик-за-соработка|call-for-applications-for-the-position|call-for-social-mediator|call-for-engagement-of-green|call-for-a-paid-internship|call-for-intern|vacancies)/i;

const TENDER_PATTERNS =
  /^(local-associate|open-call-for-tender|tender-for|tender-announcement|launch-of-a-tender|invitation-for-submission|invitation-to-tender|procurement|supply-of|montenegro-public|albania-tender|building-and-strengthening|open-call-for-tenders)/i;

const GRANT_PATTERNS = /grant|public-call-for-redi-grants/i;

export function classifyOpportunity(slug: string, title: string): "job" | "tender" | "grant" | null {
  const combined = `${slug} ${title}`;
  if (GRANT_PATTERNS.test(combined)) return "grant";
  if (JOB_PATTERNS.test(slug) || JOB_PATTERNS.test(title)) return "job";
  if (TENDER_PATTERNS.test(slug) || title.toLowerCase().includes("tender") || title.toLowerCase().includes("procurement")) return "tender";
  if (slug.includes("local-associate") || slug.includes("open-call")) return "tender";
  return null;
}
