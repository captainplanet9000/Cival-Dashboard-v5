import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Mock server client that uses the same client-side implementation
// This removes the dependency on next/headers for solo operator usage
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  
  // Handle build-time scenarios where credentials might be placeholders
  const isValidCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && 
                           supabaseAnonKey !== 'placeholder-anon-key' && 
                           !supabaseAnonKey.includes('your_supabase_anon_key_here')
  
  // If credentials are invalid, return a mock client for build-time compatibility
  if (!isValidCredentials) {
    // Return a minimal mock client for build-time
    return {
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ error: null }),
        eq: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: null })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: null }),
        signUp: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          download: () => Promise.resolve({ data: null, error: null }),
          createSignedUrl: () => Promise.resolve({ data: { signedUrl: '' }, error: null }),
          remove: () => Promise.resolve({ error: null }),
          listBuckets: () => Promise.resolve({ data: [], error: null }),
          createBucket: () => Promise.resolve({ error: null })
        })
      },
      channel: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {}
      }),
      removeChannel: () => {}
    } as any
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Disable session persistence for server-side usage
      autoRefreshToken: false, // Disable auto refresh for server-side usage
    },
  })
}