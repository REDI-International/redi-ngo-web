/** Parse tender/job deadlines from REDI posting text */

const MONTHS: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
  may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7,
  sep: 8, sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10,
  dec: 11, december: 11,
};

export type OpportunityStatus = "open" | "closed" | "ongoing";

export interface ParsedDeadline {
  raw?: string;
  date?: Date;
  status: OpportunityStatus;
  label: string;
}

function parseDateParts(day: number, month: number, year: number): Date | undefined {
  if (month < 0 || month > 11 || day < 1 || day > 31) return undefined;
  const y = year < 100 ? 2000 + year : year;
  const d = new Date(Date.UTC(y, month, day));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function tryPatterns(text: string): { raw: string; date?: Date } | undefined {
  const patterns: Array<{ re: RegExp; parse: (m: RegExpMatchArray) => Date | undefined }> = [
    {
      re: /Deadline[:\s]+(\d{1,2})[./](\d{1,2})[./](\d{2,4})/i,
      parse: (m) => parseDateParts(+m[1], +m[2] - 1, +m[3]),
    },
    {
      re: /Deadline[:\s]+(\d{1,2})(?:st|nd|rd|th)?\s+of\s+([A-Za-z]+)[,\s]+(\d{4})/i,
      parse: (m) => parseDateParts(+m[1], MONTHS[m[2].toLowerCase()] ?? -1, +m[3]),
    },
    {
      re: /Deadline[:\s]+(\d{1,2})\s+([A-Za-z]+)[,\s]+(\d{4})/i,
      parse: (m) => parseDateParts(+m[1], MONTHS[m[2].toLowerCase()] ?? -1, +m[3]),
    },
    {
      re: /Deadline[:\s]+(\d{1,2})\s+([A-Z]{3})\s+(\d{4})/i,
      parse: (m) => parseDateParts(+m[1], MONTHS[m[2].toLowerCase()] ?? -1, +m[3]),
    },
    {
      re: /Deadline[:\s]+([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?[,\s]+(\d{4})/i,
      parse: (m) => parseDateParts(+m[2], MONTHS[m[1].toLowerCase()] ?? -1, +m[3]),
    },
    {
      re: /Deadline for Submission[:\s]+(\d{1,2})(?:st|nd|rd|th)?\s+of\s+([A-Za-z]+)[,\s]+(\d{4})/i,
      parse: (m) => parseDateParts(+m[1], MONTHS[m[2].toLowerCase()] ?? -1, +m[3]),
    },
    {
      re: /Deadline for Submission[:\s]+(\d{1,2})\s+of\s+([A-Za-z]+)[,\s]+(\d{4})/i,
      parse: (m) => parseDateParts(+m[1], MONTHS[m[2].toLowerCase()] ?? -1, +m[3]),
    },
    {
      re: /Application deadline[:\s]+(\d{1,2})\s+([A-Za-z]+)[,\s]+(\d{4})/i,
      parse: (m) => parseDateParts(+m[1], MONTHS[m[2].toLowerCase()] ?? -1, +m[3]),
    },
    {
      re: /Краен рок[^:]*:\s*(\d{1,2})[./](\d{1,2})[./](\d{2,4})/i,
      parse: (m) => parseDateParts(+m[1], +m[2] - 1, +m[3]),
    },
  ];

  for (const { re, parse } of patterns) {
    const m = text.match(re);
    if (m) return { raw: m[0].replace(/^Deadline[:\s]+/i, "").trim(), date: parse(m) };
  }
  return undefined;
}

export function parseDeadline(text: string, publishedAt?: string): ParsedDeadline {
  const combined = text;
  const lower = combined.toLowerCase();

  if (/deadline[:\s]+tbd/i.test(combined) || /apply as soon as possible/i.test(combined)) {
    return { status: "open", label: "Open — apply now", raw: "Ongoing" };
  }

  const found = tryPatterns(combined);
  if (found?.date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(found.date);
    deadline.setHours(23, 59, 59, 999);
    const isOpen = deadline >= today;
    return {
      raw: found.raw,
      date: found.date,
      status: isOpen ? "open" : "closed",
      label: isOpen ? `Closes ${formatDate(found.date)}` : `Closed ${formatDate(found.date)}`,
    };
  }

  // Fallback: old postings without parseable deadline
  if (publishedAt) {
    const pub = new Date(publishedAt);
    const ageMs = Date.now() - pub.getTime();
    const twoYears = 2 * 365 * 24 * 60 * 60 * 1000;
    if (ageMs > twoYears) {
      return { status: "closed", label: "Closed", raw: publishedAt };
    }
  }

  return { status: "open", label: "Open — check details", raw: undefined };
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function parseReference(text: string): string | undefined {
  const m = text.match(/Reference(?: Number)?:[:\s]+([^\n]+?)(?:Deadline|Start Date|Type|$)/i);
  return m?.[1]?.trim().slice(0, 80);
}
