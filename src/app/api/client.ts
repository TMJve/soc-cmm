import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // <--- Add the ! here
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // <--- Add the ! here
);

export default supabase;