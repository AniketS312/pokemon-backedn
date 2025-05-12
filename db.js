const createClient = require('@supabase/supabase-js').createClient
require('dotenv').config()
const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_API_KEY)

module.exports = supabase;