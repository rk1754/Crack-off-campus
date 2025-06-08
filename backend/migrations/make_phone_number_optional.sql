-- Migration to make phone_number field optional in users table
-- Run this SQL command on your database to update the schema

ALTER TABLE "user" ALTER COLUMN phone_number DROP NOT NULL;

-- Optional: Set default value for existing users without phone numbers
UPDATE "user" SET phone_number = NULL WHERE phone_number = '';
