type Environment = Record<string, string | undefined>;

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function invalidConfig(message: string): never {
  throw new Error(`Supabase configuration is invalid: ${message}`);
}

function validateUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return invalidConfig("check NEXT_PUBLIC_SUPABASE_URL format.");
  }

  const isLoopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if ((url.protocol !== "https:" && !(url.protocol === "http:" && isLoopback)) ||
      url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    return invalidConfig("NEXT_PUBLIC_SUPABASE_URL must be an HTTPS project URL (HTTP is allowed for localhost).");
  }
  return url.origin;
}

function validatePublicKey(value: string): string {
  if (value.startsWith("sb_secret_")) {
    return invalidConfig("NEXT_PUBLIC_SUPABASE_ANON_KEY must be a publishable/anon key, never a secret key.");
  }

  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(value)) return value;

  const parts = value.split(".");
  if (parts.length === 3) {
    let role: unknown;
    try {
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
      role = (JSON.parse(atob(padded)) as { role?: unknown }).role;
    } catch {
      // Fall through to the generic key-format error without printing the value.
    }
    if (role === "anon") return value;
    if (role === "service_role") {
      return invalidConfig("NEXT_PUBLIC_SUPABASE_ANON_KEY contains a service-role key; use a publishable/anon key.");
    }
  }

  return invalidConfig("NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid publishable/anon key.");
}

export function getSupabaseConfig(env: Environment = process.env): SupabasePublicConfig {
  const rawUrl = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const rawKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!rawUrl || !rawKey) {
    return invalidConfig("set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return { url: validateUrl(rawUrl), anonKey: validatePublicKey(rawKey) };
}

export function getAdminUserId(env: Environment = process.env): string {
  const userId = env.ADMIN_USER_ID?.trim();
  if (!userId || !UUID_PATTERN.test(userId)) {
    return invalidConfig("set ADMIN_USER_ID to the administrator's Supabase Auth UUID.");
  }
  return userId.toLowerCase();
}

export function hasSupabaseEnv(env: Environment = process.env): boolean {
  try {
    getSupabaseConfig(env);
    return true;
  } catch {
    return false;
  }
}

export function isAppConfigured(env: Environment = process.env): boolean {
  try {
    getSupabaseConfig(env);
    getAdminUserId(env);
    return true;
  } catch {
    return false;
  }
}

export function isAdminUser(userId: string | undefined, env: Environment = process.env): boolean {
  if (!userId) return false;
  try {
    return userId.toLowerCase() === getAdminUserId(env);
  } catch {
    return false;
  }
}
