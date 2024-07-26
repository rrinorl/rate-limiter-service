import * as tokenBucketsModel from './tokenBuckets.model';
import { TokenRemovalResponse } from './tokenBuckets.model';

export { takeTokens };

async function takeTokens(bucketName: string, numTokens: number): Promise<TokenRemovalResponse> {
  return tokenBucketsModel.takeTokens(bucketName, numTokens);
}
