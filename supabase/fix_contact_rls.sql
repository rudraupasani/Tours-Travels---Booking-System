-- Run this in your Supabase SQL Editor to fix contact form submission
-- Go to: https://supabase.com/dashboard -> Your Project -> SQL Editor

-- Drop old policy that doesn't cover INSERT
DROP POLICY IF EXISTS "Allow all access on contact_messages" ON public.contact_messages;

-- Re-create it with WITH CHECK so INSERT works for anonymous users
CREATE POLICY "Allow all access on contact_messages" 
ON public.contact_messages 
FOR ALL 
USING (true) 
WITH CHECK (true);
