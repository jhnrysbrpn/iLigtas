import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance;

// Robust helper to construct a chainable mock that resolves with standard empty/error results without crashing
const makeMockChain = (msg) => {
  const dummy = {
    then: (onFulfilled) => {
      return Promise.resolve({ data: null, error: new Error(msg) }).then(onFulfilled);
    }
  };
  
  return new Proxy(dummy, {
    get(target, prop) {
      if (prop === 'then') {
        return target.then;
      }
      // Return a function that is also chainable
      return () => makeMockChain(msg);
    }
  });
};

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn("Supabase credentials missing or invalid in environment variables. Running in web/offline fallback mode.");
  
  const errorMessage = "Supabase is not configured.";

  supabaseInstance = {
    auth: {
      signInWithPassword: async () => {
        throw new Error("Supabase is not configured. Please log in with standard local accounts (e.g. superadmin / bdrrmc35).");
      },
      signUp: async () => {
        throw new Error("Supabase is not configured. Account creation is disabled in serverless mode.");
      },
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => makeMockChain(errorMessage),
    storage: {
      from: () => ({
        upload: async () => { throw new Error(errorMessage); },
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      })
    }
  };
} else {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error("Failed to initialize Supabase client: ", err);
    supabaseInstance = {
      auth: {
        signInWithPassword: async () => { throw err; },
        signUp: async () => { throw err; },
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => makeMockChain(err.message),
    };
  }
}

export const supabase = supabaseInstance;