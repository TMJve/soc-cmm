import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";

// Because we added them to env.js, TypeScript knows these exist!
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default supabase;