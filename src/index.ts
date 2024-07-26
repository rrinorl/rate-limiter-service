import 'dotenv/config'; // initializes dot env
import { createApp } from './app';
import { TokenBucketModelOptions } from './tokenBuckets/tokenBuckets.model';

export { start };

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await start();
    } catch (err) {
      console.error('[index] Cannot start app.', { err });
      process.exit(1);
    }
  })();
}

async function start(tokenBucketModelOptions?: TokenBucketModelOptions) {
  const app = await createApp(tokenBucketModelOptions || { configPath: 'config.json' });
  const port = process.env.PORT;

  if (!port) {
    console.error('[index] Env variables not setup.');
    process.exit(1);
  }

  return app.listen(port, () => {
    console.log(`[index] Server running on port ${port}.`);
  });
}
