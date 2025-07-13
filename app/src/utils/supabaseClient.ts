// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with your project URL and API key
export const supabase = createClient('https://tknjzinbwzkesqpwrfwu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbmp6aW5id3prZXNxcHdyZnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTU5OTMsImV4cCI6MjA2NjkzMTk5M30.VIuNg35TaNIhaXpS1Qug143s-zbjUatwJAXMMOCA_U4')
