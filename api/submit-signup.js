// api/submit-signup.js
// Serverless function - runs on Vercel. Supabase service role key stays secret here.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qybzjhmrkwsoamesfuga.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// In-memory rate limit store (resets on cold start, but works within a function instance)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // max 3 submissions per minute per IP

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  // Clean old entries
  if (rateLimitStore.has(ip)) {
    const timestamps = rateLimitStore.get(ip).filter((t) => t > windowStart);
    rateLimitStore.set(ip, timestamps);
  } else {
    rateLimitStore.set(ip, []);
  }

  const timestamps = rateLimitStore.get(ip);
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  timestamps.push(now);
  return false;
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    const { store_name, whatsapp, sells_on } = req.body;

    // Basic validation
    if (!store_name || !whatsapp || !sells_on) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create Supabase client with SERVICE ROLE KEY (server-side only)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for duplicate WhatsApp number before inserting
    const { data: existing, error: checkError } = await supabase
      .from('early_access_signups')
      .select('id')
      .eq('whatsapp', whatsapp)
      .maybeSingle();

    if (checkError) {
      console.error('Supabase check error:', checkError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existing) {
      return res.status(409).json({ error: 'This WhatsApp number has already signed up.' });
    }

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
