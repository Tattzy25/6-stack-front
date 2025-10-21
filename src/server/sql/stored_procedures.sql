-- Stored procedures required by the TaTTTy API server
-- Run this script against your Neon/PostgreSQL database after provisioning the core schema.
--
-- The functions below are idempotent (`CREATE OR REPLACE`) so it is safe to re-run the script.

-- ============================================================
-- Fetch random example tattoo records
-- ============================================================
CREATE OR REPLACE FUNCTION get_random_examples(
  p_category VARCHAR DEFAULT NULL,
  p_limit INTEGER DEFAULT 6
)
RETURNS SETOF example_images
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM example_images
  WHERE is_active = TRUE
    AND (p_category IS NULL OR category = p_category)
  ORDER BY random()
  LIMIT LEAST(COALESCE(p_limit, 6), 24);
$$;

-- ============================================================
-- Fetch featured examples ordered by display priority
-- ============================================================
CREATE OR REPLACE FUNCTION get_featured_examples()
RETURNS SETOF example_images
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM example_images
  WHERE is_active = TRUE
    AND is_featured = TRUE
  ORDER BY display_order NULLS LAST, created_at DESC;
$$;

-- ============================================================
-- Remove expired OTP codes (runs hourly via server cron)
-- ============================================================
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM otp_codes
  WHERE expires_at <= NOW() OR used = TRUE;
END;
$$;

-- ============================================================
-- Remove expired sessions (runs hourly via server cron)
-- ============================================================
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM sessions
  WHERE expires_at <= NOW();
END;
$$;
