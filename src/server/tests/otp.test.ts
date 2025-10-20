import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { afterEach, beforeEach, test } from 'node:test';
import type { DatabaseClient } from '../database.js';

process.env.NODE_ENV = 'test';
process.env.APP_URL = process.env.APP_URL || 'http://localhost:5173';

// ------------------------------------------------------------
// Test helper mocks
// ------------------------------------------------------------

type SqlCall = { query: string; values: unknown[] };
type SqlImplementation = (query: string, values: unknown[]) => Promise<unknown>;

type SqlMock = DatabaseClient & {
  calls: SqlCall[];
  impl: SqlImplementation;
  setImpl: (impl: SqlImplementation) => void;
  reset: () => void;
};

type AsyncMock<TArgs extends unknown[], TResult> = ((...args: TArgs) => Promise<TResult>) & {
  calls: TArgs[];
  impl: (...args: TArgs) => Promise<TResult>;
  setImpl: (impl: (...args: TArgs) => Promise<TResult>) => void;
  reset: () => void;
};

function createSqlMock(): SqlMock {
  const fn = ((strings: TemplateStringsArray | string, ...values: unknown[]) => {
    const query = typeof strings === 'string' ? strings : strings.join('');
    fn.calls.push({ query, values });
    return fn.impl(query, values);
  }) as unknown as SqlMock;

  fn.calls = [];
  fn.impl = async () => [];
  fn.setImpl = (impl: SqlImplementation) => {
    fn.impl = impl;
  };
  fn.reset = () => {
    fn.calls = [];
    fn.impl = async () => [];
  };

  return fn;
}

function createAsyncMock<TArgs extends unknown[], TResult>(defaultValue: TResult): AsyncMock<TArgs, TResult> {
  const fn = (async (...args: TArgs) => {
    fn.calls.push(args);
    return fn.impl(...args);
  }) as AsyncMock<TArgs, TResult>;

  fn.calls = [];
  fn.impl = async () => defaultValue;
  fn.setImpl = (impl: (...args: TArgs) => Promise<TResult>) => {
    fn.impl = impl;
  };
  fn.reset = () => {
    fn.calls = [];
    fn.impl = async () => defaultValue;
  };

  return fn;
}

const sqlMock = createSqlMock();
const sendOtpMock = createAsyncMock<[string, string], boolean>(true);
const sendWelcomeMock = createAsyncMock<[string, string | undefined], boolean>(true);
const testEmailMock = createAsyncMock<[], boolean>(true);
const pingDatabaseMock = createAsyncMock<[DatabaseClient | undefined], boolean>(true);

(globalThis as unknown as { __TATTY_SERVER_OVERRIDES__?: unknown }).__TATTY_SERVER_OVERRIDES__ = {
  sql: sqlMock,
  sendOTPEmail: sendOtpMock,
  sendWelcomeEmail: sendWelcomeMock,
  testEmailConnection: testEmailMock,
  pingDatabase: (client?: DatabaseClient) => pingDatabaseMock(client),
};

let appPromise: Promise<import('express').Express> | null = null;
async function getApp() {
  if (!appPromise) {
    appPromise = import('../api.js').then(module => module.default);
  }
  return appPromise;
}

function resetMocks() {
  sqlMock.reset();
  sendOtpMock.reset();
  sendWelcomeMock.reset();
  testEmailMock.reset();
  pingDatabaseMock.reset();
}

async function withServer<T>(app: import('express').Express, handler: (url: string) => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const server = app.listen(0, async () => {
      const address = server.address() as AddressInfo;
      const url = `http://127.0.0.1:${address.port}`;

      try {
        const result = await handler(url);
        server.close(() => resolve(result));
      } catch (error) {
        server.close(() => reject(error));
      }
    });

    server.on('error', error => {
      server.close(() => reject(error));
    });
  });
}

async function requestJson(app: import('express').Express, method: string, path: string, body?: unknown) {
  return withServer(app, async baseUrl => {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await response.json();
    return { response, json } as const;
  });
}

function getQueryText(call: SqlCall): string {
  return call.query.toLowerCase();
}

beforeEach(() => {
  resetMocks();
  process.env.DATABASE_URL = 'postgres://user:pass@localhost/db';
});

afterEach(() => {
  resetMocks();
});

test('OTP flow stores generated code and responds with success', async () => {
  sqlMock.setImpl(async () => []);

  const app = await getApp();
  const { response, json } = await requestJson(app, 'POST', '/api/auth/otp/send', {
    email: 'user@example.com',
  });

  assert.equal(response.status, 200);
  assert.equal(json.success, true);
  assert.equal(sendOtpMock.calls.length, 1);
  assert.equal(sendOtpMock.calls[0][0], 'user@example.com');

  const insertCall = sqlMock.calls.find(call => getQueryText(call).includes('insert into otp_codes'));
  assert.ok(insertCall, 'expected OTP insert query to run');
});

test('OTP verification creates a session cookie for new users', async () => {
  const otpRecord = {
    id: 'otp-1',
    email: 'user@example.com',
    code: '654321',
    expires_at: new Date(Date.now() + 5 * 60 * 1000),
    used: false,
  };

  const newUser = {
    id: 'user-1',
    email: 'user@example.com',
    name: 'TatTTY Tester',
    avatar_url: null,
    role: 'user',
    is_master_user: false,
  };

  sqlMock.setImpl(async (query) => {
    const text = query.toLowerCase();

    if (text.includes('select * from otp_codes')) {
      return [otpRecord];
    }

    if (text.includes('update otp_codes')) {
      otpRecord.used = true;
      return [{ id: otpRecord.id }];
    }

    if (text.includes('select * from users where email')) {
      return [];
    }

    if (text.includes('insert into users')) {
      return [newUser];
    }

    if (text.includes('insert into user_profiles')) {
      return [];
    }

    if (text.includes('update users')) {
      return [newUser];
    }

    if (text.includes('insert into sessions')) {
      return [];
    }

    return [];
  });

  const app = await getApp();
  const { response, json } = await requestJson(app, 'POST', '/api/auth/otp/verify', {
    email: 'user@example.com',
    code: '654321',
  });

  assert.equal(response.status, 200);
  assert.equal(json.success, true);
  assert.equal(json.user.email, 'user@example.com');
  assert.ok(response.headers.get('set-cookie'));
  assert.equal(sendWelcomeMock.calls.length, 1);
  assert.deepEqual(sendWelcomeMock.calls[0], ['user@example.com', newUser.name]);
});

test('Health check returns disconnected status when ping fails', async () => {
  pingDatabaseMock.setImpl(async () => false);

  const app = await getApp();
  const { response, json } = await requestJson(app, 'GET', '/health');

  assert.equal(response.status, 503);
  assert.equal(json.database, 'disconnected');
});
