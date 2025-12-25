-- Add isAdmin column to User table
-- This migration only adds the new column without modifying existing column types

ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false;

