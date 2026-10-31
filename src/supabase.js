import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qybzjhmrkwsoamesfuga.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your actual Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
