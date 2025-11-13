import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Singleton Supabase client
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseClient) {
    try {
      const supabaseUrl = `https://${projectId}.supabase.co`;
      console.log('[Supabase Client] Initializing Supabase client...', {
        url: supabaseUrl,
        hasKey: !!publicAnonKey,
        timestamp: new Date().toISOString()
      });
      
      supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey);
      
      console.log('[Supabase Client] Client initialized successfully');
    } catch (error) {
      console.error('[Supabase Client] Failed to initialize client:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }
  return supabaseClient;
}