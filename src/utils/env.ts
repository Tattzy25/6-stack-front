interface ClientEnv {
  readonly mode: string;
  readonly isDev: boolean;
  readonly isProd: boolean;
  readonly apiUrl: string;
  readonly apiBaseUrl: string;
  readonly databaseUrl: string;
  readonly stackProjectId: string;
  readonly stackPublishableClientKey: string;
  readonly googleClientId: string;
  readonly googleRedirectUri?: string;
  readonly masterCode?: string;
  readonly stabilityApiKey?: string;
  readonly stabilityApiBaseUrl?: string;
}

const rawEnv: Record<string, unknown> = typeof import.meta !== 'undefined' ? import.meta.env ?? {} : {};

const sanitize = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const env: ClientEnv = {
  mode: sanitize(rawEnv.MODE) || 'development',
  isDev: Boolean(rawEnv.DEV ?? sanitize(rawEnv.MODE) === 'development'),
  isProd: Boolean(rawEnv.PROD ?? sanitize(rawEnv.MODE) === 'production'),
  apiUrl: sanitize(rawEnv.VITE_API_URL) || '/api',
  apiBaseUrl:
    sanitize(rawEnv.VITE_API_BASE_URL) || sanitize(rawEnv.VITE_API_URL) || 'http://localhost:3001',
  databaseUrl: sanitize(rawEnv.VITE_DATABASE_URL),
  stackProjectId: sanitize(rawEnv.VITE_STACK_PROJECT_ID),
  stackPublishableClientKey: sanitize(rawEnv.VITE_STACK_PUBLISHABLE_CLIENT_KEY),
  googleClientId: sanitize(rawEnv.VITE_GOOGLE_CLIENT_ID),
  googleRedirectUri: sanitize(rawEnv.VITE_GOOGLE_REDIRECT_URI) || undefined,
  masterCode: sanitize(rawEnv.VITE_MASTER_CODE) || undefined,
  stabilityApiKey: sanitize(rawEnv.VITE_STABILITY_API_KEY) || undefined,
  stabilityApiBaseUrl: sanitize(rawEnv.VITE_STABILITY_API_BASE_URL) || 'https://api.stability.ai',
};

function validateEnv(config: ClientEnv): void {
  const missing: string[] = [];

  if (!config.stackProjectId || config.stackProjectId.startsWith('<')) {
    missing.push('VITE_STACK_PROJECT_ID');
  }

  if (!config.stackPublishableClientKey || config.stackPublishableClientKey.startsWith('<')) {
    missing.push('VITE_STACK_PUBLISHABLE_CLIENT_KEY');
  }

  if (!config.googleClientId && !config.isDev) {
    console.warn(
      '[env] Google OAuth client ID is not configured. Google sign-in will be unavailable.'
    );
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}.`;
    if (config.isProd) {
      console.error(`[env] ${message}`);
      throw new Error(message);
    }

    console.warn(`[env] ${message}`);
  }
}

validateEnv(env);

export { env };
