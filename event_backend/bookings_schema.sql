-- 3. BOOKINGS TABLE
create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  event_title text not null,
  event_date text,
  event_location text,
  ticket_type text,
  quantity integer,
  total_amount decimal,
  transaction_uuid text unique,
  status text default 'PENDING', -- 'PENDING', 'COMPLETED', 'FAILED'
  created_at timestamptz default now()
);

-- Enable RLS (Optional but recommended)
alter table public.bookings enable row level security;

-- Policies
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Service role can manage all bookings"
  on public.bookings for all
  using (true);

-- --- MIGRATION: RUN THIS IN SUPABASE SQL EDITOR ---
-- Update ticket_type to JSONB to support itemized tickets
-- Note: This will delete existing text data in that column. 
-- If you want to keep them, use: USING ticket_type::text::jsonb (might be tricky)
-- For a clean start:
ALTER TABLE public.bookings 
ALTER COLUMN ticket_type TYPE JSONB USING (
  CASE 
    WHEN ticket_type = 'Mixed' THEN '[]'::jsonb 
    ELSE jsonb_build_array(jsonb_build_object('name', ticket_type, 'quantity', quantity, 'price', total_amount))
  END
);
-- ---------------------------------------------------
