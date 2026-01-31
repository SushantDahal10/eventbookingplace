-- Migration: Gate App Schema
-- Created at: 2026-01-26

-- 1. Create ticket_qr_tokens table
CREATE TABLE IF NOT EXISTS public.ticket_qr_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  total_allowed INTEGER NOT NULL CHECK (total_allowed > 0),
  total_used INTEGER NOT NULL DEFAULT 0 CHECK (total_used <= total_allowed),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'exhausted', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_qr_tokens_token ON public.ticket_qr_tokens(token);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_event ON public.ticket_qr_tokens(event_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_booking ON public.ticket_qr_tokens(booking_id);

-- 2. Create entry_logs table
CREATE TABLE IF NOT EXISTS public.entry_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_token_id UUID NOT NULL REFERENCES public.ticket_qr_tokens(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES public.gate_staff(id), -- Updated to reference dedicated gate staff
  entries_used INTEGER NOT NULL CHECK (entries_used > 0),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_entry_logs_qr_token ON public.entry_logs(qr_token_id);
CREATE INDEX IF NOT EXISTS idx_entry_logs_event ON public.entry_logs(event_id);

-- 3. Create event_staff table
CREATE TABLE IF NOT EXISTS public.event_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('gate', 'supervisor')) DEFAULT 'gate',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_event_staff_user ON public.event_staff(user_id);
CREATE INDEX IF NOT EXISTS idx_event_staff_event ON public.event_staff(event_id);

-- 4. Create gate_staff table (Separate from regular users)
CREATE TABLE IF NOT EXISTS public.gate_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL CHECK (email = lower(email)),
  password_hash TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gate_staff_email ON public.gate_staff(email);
