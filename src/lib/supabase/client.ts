import { createClient } from '@supabase/supabase-js';

const fallbackUrl='https://ghjvqgkuugnomegmwuip.supabase.co';
const fallbackPublishableKey='sb_publishable__9oA4TFzUc0UX-iq87C0WQ_ymtW_7Nm';

export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || fallbackPublishableKey,
    { auth: { persistSession: false } }
  );
}
