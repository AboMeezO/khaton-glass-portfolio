import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { discordId } = await req.json();
    
    if (!discordId) {
      throw new Error('Discord ID is required');
    }

    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('VITE_SUPABASE_PUBLISHABLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is in admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('discord_id', discordId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Database error:', error);
      throw new Error('Failed to check admin status');
    }

    return new Response(
      JSON.stringify({
        isAdmin: !!data,
        user: data || null,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Admin check error:', error);
    return new Response(
      JSON.stringify({ 
        isAdmin: false,
        error: (error as Error).message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
