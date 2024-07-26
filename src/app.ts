import { Express } from 'express';
import { createExpressApp } from './config/express';
import * as apiHandler from './api';
import * as tokenBucketsModel from './tokenBuckets/tokenBuckets.model';
import { TokenBucketModelOptions } from './tokenBuckets/tokenBuckets.model';

export { createApp };

async function createApp(tokenBucketModelOptions: TokenBucketModelOptions): Promise<Express> {
  const app = createExpressApp();
  //TODO: make config json path configurable via ENV variable
  await tokenBucketsModel.load(tokenBucketModelOptions);
  apiHandler.init(app);
  return app;
}
