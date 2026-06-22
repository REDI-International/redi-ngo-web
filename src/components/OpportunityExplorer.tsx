"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { OpportunityCard, type Opportunity } from "@/components/OpportunityCard";

type StatusFilter = "open" | "closed" | "all";

interface OpportunityExplorerProps {
  items: Opportunity[];
  labels: {
    search: string;
    country: string;
    allCountries: string;
    open: string;
    closed: string;
    all: string;
    noResults: string;
    showing: string;
  };
}

function parseStatus(value: string | null): StatusFilter {
  if (value === "closed" || value === "all") return value;
  return "open";
}

export function OpportunityExplorer({ items, labels }: OpportunityExplorerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [status, setStatus] = useState<StatusFilter>(() => parseStatus(searchParams.get("status")));
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [country, setCountry] = useState(() => searchParams.get("country") ?? "all");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== "open") params.set("status", status);
    if (query.trim()) params.set("q", query.trim());
    if (country !== "all") params.set("country", country);
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [status, query, country, pathname, router]);

  const countries = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.country && set.add(i.country));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (status !== "all") list = list.filter((i) => i.status === status);
    if (country !== "all") list = list.filter((i) => i.country?.includes(country));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.excerpt.toLowerCase().includes(q) ||
          i.reference?.toLowerCase().includes(q) ||
          i.country?.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => {
      if (a.status === "open" && b.status === "closed") return -1;
      if (a.status === "closed" && b.status === "open") return 1;
      if (a.deadlineDate && b.deadlineDate) return a.deadlineDate.localeCompare(b.deadlineDate);
      return 0;
    });
  }, [items, status, country, query]);

  const counts = useMemo(
    () => ({
      open: items.filter((i) => i.status === "open").length,
      closed: items.filter((i) => i.status === "closed").length,
      all: items.length,
    }),
    [items],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["open", "closed", "all"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatus(key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              status === key
                ? key === "open"
                  ? "bg-primary text-white"
                  : key === "closed"
                    ? "bg-text-muted text-white"
                    : "bg-accent text-text"
                : "bg-white text-text-muted ring-1 ring-black/10 hover:bg-surface"
            }`}
          >
            {labels[key]} ({counts[key]})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.search}
          className="flex-1 rounded-xl border border-surface-dark bg-white px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-xl border border-surface-dark bg-white px-4 py-3 text-sm outline-none focus:border-primary sm:w-56"
        >
          <option value="all">{labels.allCountries}</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-muted">
          <span className="font-bold text-primary">{filtered.length}</span> {labels.showing}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-text-muted ring-1 ring-black/5">
          {labels.noResults}
        </p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <OpportunityCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
