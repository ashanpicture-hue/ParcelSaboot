// api/submit-signup.js
// Serverless function - runs on Vercel. Supabase service role key stays secret here.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qybzjhmrkwsoamesfuga.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { store_name, whatsapp, sells_on } = req.body;

    // Basic validation
    if (!store_name || !whatsapp || !sells_on) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create Supabase client with SERVICE ROLE KEY (server-side only)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('early_access_signups')
      .insert([{ store_name, whatsapp, sells_on }]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
