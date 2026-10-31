// No Supabase client on the frontend.
// All database writes go through our Vercel serverless function at /api/submit-signup
// This keeps the Supabase service role key secret and prevents data theft.

export const API_BASE = '';
