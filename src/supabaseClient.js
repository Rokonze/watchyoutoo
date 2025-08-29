import { createClient } from '../node_modules/@supabase/supabase-js'

const SUPABASE_URL = 'https://awiqkeqfolufwqkqqeih.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_ZbAkGfZmBstlr8lAnyvUkw_qLAwV-xv'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)