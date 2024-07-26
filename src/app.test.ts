import request from 'supertest';
import { start } from './index';
import { StatusCodes } from 'http-status-codes';

let server;

describe('app.test', () => {
  // TODO: add a method to the model to refill buckets so that buckets can be refilled between each test for better isolation
  beforeAll(async () => {
    const config = {
      rateLimitsPerEndpoint: [
        {
          endpoint: 'GET /user/:id',
          burst: 3,
          sustained: 120,
        },
      ],
    };
    server = await start({ existingTokenBucketConfig: config });
  });

  afterAll(() => {
    return new Promise((done) => {
      server.close(done);
    });
  });

  it('should allow burst requests within limit', async () => {
    await request(server).post('/take').send({ endpoint: 'GET /user/:id' });
    await request(server).post('/take').send({ endpoint: 'GET /user/:id' });
    const res = await request(server).post('/take').send({ endpoint: 'GET /user/:id' });

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('tokensRemaining', 0);
  });

  it('should reject requests exceeding burst limit', async () => {
    await request(server).post('/take').send({ endpoint: 'GET /user/:id' });
    await request(server).post('/take').send({ endpoint: 'GET /user/:id' });
    await request(server).post('/take').send({ endpoint: 'GET /user/:id' });

    const res = await request(server).post('/take').send({ endpoint: 'GET /user/:id' });

    expect(res.status).toBe(StatusCodes.TOO_MANY_REQUESTS);
    expect(res.body).toHaveProperty('tokensRemaining', 0);
  });

  it('should refill tokens over time', async () => {
    // Exhaust tokens
    await request(server).post('/take').send({ endpoint: 'GET /user/:id' });
    await request(server).post('/take').send({ endpoint: 'GET /user/:id' });
    await request(server).post('/take').send({ endpoint: 'GET /user/:id' });

    // Don't wait long enough for token to refill and make request
    await new Promise((resolve) => setTimeout(resolve, 200));

    let res = await request(server).post('/take').send({ endpoint: 'GET /user/:id' });

    expect(res.status).toBe(StatusCodes.TOO_MANY_REQUESTS);
    expect(res.body).toHaveProperty('tokensRemaining', 0);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    res = await request(server).post('/take').send({ endpoint: 'GET /user/:id' });

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('tokensRemaining', expect.any(Number));
    expect(res.body.tokensRemaining).toBeGreaterThan(0);
  });
});
