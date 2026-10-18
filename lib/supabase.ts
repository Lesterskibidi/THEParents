import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Read-only public client (anon key). Everything it can see is limited by Row Level Security,
// so unpublished articles and private profiles are never returned.
// Returns null when env vars are missing so the site still renders an honest "not connected" state.
let client: SupabaseClient | null | undefined;

export function getPublicClient(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    client = null;
    return client;
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Next 14 caches fetch() indefinitely by default; refresh public content every 60 seconds instead.
    global: { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }) },
  });
  return client;
}
