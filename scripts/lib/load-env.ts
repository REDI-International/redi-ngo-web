import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/** Strip trailing literal `\n` that `vercel env pull` sometimes appends. */
export function cleanEnvValue(value: string): string {
  return value.replace(/\\n$/, "").replace(/[\r\n]+$/, "").trim();
}

export function loadLocalEnv() {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    value = cleanEnvValue(value);
    if (!process.env[key]) process.env[key] = value;
  }
}
