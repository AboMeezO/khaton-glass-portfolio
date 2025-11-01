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
    const { discordId, table, data, id } = await req.json();
    
    if (!discordId) {
      throw new Error('Unauthorized');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin status
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('discord_id', discordId)
      .single();

    if (adminError || !adminData) {
      throw new Error('Unauthorized: Not an admin');
    }

    let result;
    
    // Handle different operations
    if (table === 'site_settings') {
      const { data: updateData, error } = await supabase
        .from('site_settings')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      result = updateData;
    } else if (table === 'skills') {
      if (data.operation === 'delete') {
        const { error } = await supabase
          .from('skills')
          .delete()
          .eq('id', id);
        if (error) throw error;
        result = { success: true };
      } else if (id) {
        const { data: updateData, error } = await supabase
          .from('skills')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        result = updateData;
      } else {
        const { data: insertData, error } = await supabase
          .from('skills')
          .insert(data)
          .select()
          .single();
        if (error) throw error;
        result = insertData;
      }
    } else if (table === 'portfolio_projects') {
      if (data.operation === 'delete') {
        const { error } = await supabase
          .from('portfolio_projects')
          .delete()
          .eq('id', id);
        if (error) throw error;
        result = { success: true };
      } else if (id) {
        const { data: updateData, error } = await supabase
          .from('portfolio_projects')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        result = updateData;
      } else {
        const { data: insertData, error } = await supabase
          .from('portfolio_projects')
          .insert(data)
          .select()
          .single();
        if (error) throw error;
        result = insertData;
      }
    } else {
      throw new Error('Invalid table');
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Admin update error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: (error as Error).message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
