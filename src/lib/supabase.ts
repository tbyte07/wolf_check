import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client. Reads SUPABASE_URL / SUPABASE_ANON_KEY (no
// NEXT_PUBLIC_ prefix on purpose — this client is only ever created inside
// server components, server actions and route handlers, so the key stays
// on the server).
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_ANON_KEY " +
        "(see .env.example)."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
