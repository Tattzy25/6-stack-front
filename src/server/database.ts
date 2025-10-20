import { neon } from '@neondatabase/serverless';

export type DatabaseClient = ReturnType<typeof neon>;

export function createDatabaseClient(connectionString = process.env.DATABASE_URL || ''): DatabaseClient {
  if (!connectionString) {
    console.warn('⚠️  DATABASE_URL is not configured. Database operations will fail until it is set.');

    const errorClient: DatabaseClient = ((..._args: unknown[]) => {
      throw new Error('DATABASE_URL is not configured.');
    }) as unknown as DatabaseClient;

    return errorClient;
  }

  return neon(connectionString);
}

export async function pingDatabase(client?: DatabaseClient): Promise<boolean> {
  const sql = client ?? (process.env.DATABASE_URL ? createDatabaseClient(process.env.DATABASE_URL) : undefined);

  if (!sql) {
    return false;
  }

  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database ping failed:', error);
    return false;
  }
}
