import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing in .env file. Falling back to safe mock mode to prevent crash.");
  
  // Create a minimal mock client to prevent load-time or runtime crashes.
  // It triggers the app's fallback path to load default data when not configured.
  const mockFrom = {
    select: () => mockFrom,
    eq: () => mockFrom,
    order: () => mockFrom,
    maybeSingle: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured.") }),
    single: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured.") }),
    then: (resolve) => resolve({ data: null, error: new Error("Supabase is not configured.") })
  };

  supabaseInstance = {
    auth: {
      signInWithPassword: () => Promise.reject(new Error("Supabase is not configured.")),
      signUp: () => Promise.reject(new Error("Supabase is not configured.")),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => mockFrom,
    storage: {
      from: () => ({
        upload: () => Promise.reject(new Error("Supabase is not configured.")),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      })
    }
  };
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;
