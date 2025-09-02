import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_PROJECT_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient("https://tseesrnqopmqyvzqidyg.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzZWVzcm5xb3BtcXl2enFpZHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3OTk2ODQsImV4cCI6MjA3MjM3NTY4NH0.mMDKOrK50JMSyh_zHhmbwPQrA-m5cZBVEDGvA8leCIE");
