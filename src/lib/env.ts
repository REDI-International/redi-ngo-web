/** Strip trailing literal `\n` that `vercel env pull` sometimes appends. */
export function cleanEnvValue(value: string): string {
  return value.replace(/\\n$/, "").replace(/[\r\n]+$/, "").trim();
}

export function getEnv(key: string): string | undefined {
  const value = process.env[key];
  return value ? cleanEnvValue(value) : undefined;
}

export function requireEnv(key: string): string {
  const value = getEnv(key);
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export function getOptionalEnv(key: string, fallback = ""): string {
  const value = getEnv(key);
  return value ?? fallback;
}
