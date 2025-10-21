import { neon } from '@neondatabase/serverless';
import { generateSessionToken, asRows } from './helpers.js';
import { appConfig } from '../config.js';

const sql = neon(appConfig.databaseUrl);

// Get user from session token
export async function getUserFromSession(token: string) {
  if (!token) return null;

  const result = await sql`
    SELECT 
      u.id,
      u.email,
      u.name,
      u.avatar_url,
      u.role,
      u.tokens
    FROM users u
    JOIN sessions s ON u.id = s.user_id
    WHERE s.session_token = ${token}
      AND s.expires_at > NOW()
  `;

  return result[0] || null;
}

// Set RLS context for database queries
export async function setUserContext(userId: string | null) {
  if (userId) {
    await sql`SELECT set_config('app.user_id', ${userId}, false)`;
  }
}
