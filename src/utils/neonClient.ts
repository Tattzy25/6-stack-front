/**
 * Neon Database Client
 * Handles all database connections and queries
 */

// Note: In production, you'll need to use a proper backend API
// This is a frontend-safe approach using edge functions or serverless functions

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || '';

interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

/**
 * Execute a query against the Neon database
 * NOTE: This is a placeholder. In production, you should:
 * 1. Use Neon's serverless driver for edge functions
 * 2. Or create a backend API that handles database queries
 * 3. NEVER expose your database connection string in the frontend
 */
export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<QueryResult<T>> {
  try {
    // For now, we'll use a backend API endpoint
    // You'll need to create this endpoint
    const response = await fetch('/api/db/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Database query failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Helper function to execute a single query and return first row
 */
export async function queryOne<T = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const result = await query<T>(sql, params);
  return result.rows[0] || null;
}

/**
 * Helper function to check database connection
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}
