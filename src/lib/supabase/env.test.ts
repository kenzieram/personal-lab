import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAdminUserId,
  getSupabaseConfig,
  hasSupabaseEnv,
  isAdminUser,
  isAppConfigured,
} from "./env.ts";

const ADMIN_ID = "11111111-1111-4111-8111-111111111111";
const anonJwt = `header.${Buffer.from(JSON.stringify({ role: "anon" })).toString("base64url")}.signature`;

test("accepts a valid Supabase URL and browser-safe anon key", () => {
  assert.deepEqual(
    getSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: "https://lab.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: anonJwt }),
    { url: "https://lab.supabase.co", anonKey: anonJwt },
  );
  assert.equal(
    getSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321", NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_example123" }).url,
    "http://127.0.0.1:54321",
  );
});

test("rejects missing, malformed, non-HTTPS, and secret-key Supabase configuration", () => {
  assert.throws(() => getSupabaseConfig({}), /NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.throws(() => getSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: "not a URL", NEXT_PUBLIC_SUPABASE_ANON_KEY: anonJwt }), /URL format/);
  assert.throws(() => getSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: "http://lab.example.com", NEXT_PUBLIC_SUPABASE_ANON_KEY: anonJwt }), /HTTPS project URL/);

  const secretKey = "sb_secret_example";
  assert.throws(
    () => getSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: "https://lab.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: secretKey }),
    error => error instanceof Error && /never a secret key/.test(error.message) && !error.message.includes(secretKey),
  );
  assert.throws(
    () => getSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: "https://lab.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: `header.${Buffer.from(JSON.stringify({ role: "service_role" })).toString("base64url")}.signature` }),
    /service-role key/,
  );
});

test("validates the single administrator UUID and app readiness", () => {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: "https://lab.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonJwt,
    ADMIN_USER_ID: ADMIN_ID,
  };
  assert.equal(getAdminUserId(env), ADMIN_ID);
  assert.equal(isAdminUser(ADMIN_ID, env), true);
  assert.equal(isAdminUser(ADMIN_ID.toUpperCase(), env), true);
  assert.equal(isAdminUser("22222222-2222-4222-8222-222222222222", env), false);
  assert.equal(isAdminUser(undefined, env), false);
  assert.equal(hasSupabaseEnv(env), true);
  assert.equal(isAppConfigured(env), true);
  assert.equal(isAppConfigured({ ...env, ADMIN_USER_ID: "not-a-uuid" }), false);
  assert.throws(() => getAdminUserId({ ...env, ADMIN_USER_ID: "not-a-uuid" }), /administrator's Supabase Auth UUID/);
});
