import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { pingDatabase } from '../database.js';

type MockClient = ((strings: TemplateStringsArray | string) => Promise<unknown>) & {
  calls: number;
};

function createMockClient(shouldFail = false): MockClient {
  const fn = ((strings: TemplateStringsArray | string) => {
    fn.calls += 1;
    const query = typeof strings === 'string' ? strings : strings.join('');

    if (!query.toLowerCase().includes('select 1')) {
      return Promise.resolve([]);
    }

    if (shouldFail) {
      return Promise.reject(new Error('connection failed'));
    }

    return Promise.resolve([{ ok: true }]);
  }) as MockClient;

  fn.calls = 0;
  return fn;
}

describe('pingDatabase', () => {
  it('returns true when the query succeeds', async () => {
    const client = createMockClient(false);
    const result = await pingDatabase(client);

    assert.equal(result, true);
    assert.equal(client.calls > 0, true);
  });

  it('returns false when the query fails', async () => {
    const client = createMockClient(true);
    const result = await pingDatabase(client);

    assert.equal(result, false);
  });

  it('returns false when no client or connection string is provided', async () => {
    delete process.env.DATABASE_URL;
    const result = await pingDatabase();

    assert.equal(result, false);
  });
});
