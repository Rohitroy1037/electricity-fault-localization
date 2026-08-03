// backend/src/config/supabase.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️ Supabase credentials missing in backend environment variables. Using fallback mode.');
}

export const supabase = createClient(
  supabaseUrl || 'https://xyzcompany.supabase.co',
  supabaseServiceRoleKey || 'placeholder-key'
);
