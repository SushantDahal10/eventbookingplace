-- Fix for "value too long" error in verification_codes table
-- The 'code' column is likely VARCHAR(10) which is too short for UUIDs (36 chars)
-- The 'type' column might also be too short for 'BOOKING_GUEST_INFO'

ALTER TABLE public.verification_codes 
ALTER COLUMN code TYPE text;

ALTER TABLE public.verification_codes 
ALTER COLUMN type TYPE text;

-- Verify the change (Output column details)
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'verification_codes';
