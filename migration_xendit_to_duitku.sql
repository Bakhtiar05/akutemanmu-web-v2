-- Migration: Xendit to Duitku
-- Run this in your Supabase SQL Editor

-- 1. Rename columns in payments table
ALTER TABLE payments RENAME COLUMN xendit_invoice_id TO provider_transaction_id;
ALTER TABLE payments RENAME COLUMN external_id TO provider_reference;
ALTER TABLE payments RENAME COLUMN invoice_url TO payment_url;

-- 2. Add payment_provider column
ALTER TABLE payments ADD COLUMN payment_provider TEXT DEFAULT 'duitku';

-- 3. Update existing records if needed (optional, assuming we keep historical records as 'xendit' temporarily if you want to distinguish, but the schema uses default 'duitku')
UPDATE payments SET payment_provider = 'xendit' WHERE provider_transaction_id IS NOT NULL AND provider_transaction_id LIKE 'inv_%';
