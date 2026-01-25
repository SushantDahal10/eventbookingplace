-- Seed Data for Testing (Run this after schema reset)
-- Extends 'uuid-ossp' if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create a Test User
-- Password is 'password123' (hash generated using bcrypt default cost 10)
INSERT INTO public.users (id, full_name, email, password_hash, is_verified)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Demo User',
  'user@example.com',
  '$2b$10$X7v0.n.m.n.m.n.m.n.m.u.n.m.n.m.n.m.n.m.n.m.n.m.n.m.n.m', -- Replace with valid bcrypthash if needed, this is dummy
  true
) ON CONFLICT (email) DO NOTHING;

-- 2. Create a Partner linked to that User
INSERT INTO public.partners (id, user_id, organization_name, official_email, official_phone, status, terms_accepted)
VALUES (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Nepal Events Pvt Ltd',
  'partner@example.com',
  '9800000000',
  'approved',
  true
) ON CONFLICT (official_email) DO NOTHING;

-- 3. Create Events
INSERT INTO public.events (id, partner_id, title, description, event_date, location, ticket_price, total_seats, available_seats, status)
VALUES 
(
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
  'Grand Music Festival 2026',
  'Join us for the biggest music festival of the year featuring top artists from Nepal and abroad.',
  NOW() + INTERVAL '10 days',
  'Dasarath Rangasala, Kathmandu',
  1500.00,
  5000,
  5000,
  'active'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
  'Standup Comedy Night',
  'A hilarious evening with Nepal''s best standup comedians.',
  NOW() + INTERVAL '5 days',
  'Pragya Bhawan, Kamaladi',
  500.00,
  200,
  200,
  'active'
);

-- Note: Password hash for 'password123' is actually:
-- $2b$10$wT/.. // You should generate a real one if you want to login as this user. 
-- For now, this seed allows viewing events.
