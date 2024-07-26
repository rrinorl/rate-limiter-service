import { throwNotFoundError } from '../utils/error/errorUtils';
import { loadConfig, TokenBucketConfig } from './tokenBucketsConfigLoader';

export { load, takeTokens, TokenRemovalResponse, TokenBucketModelOptions };

// TODO: could potentially refactor this into a class
let tokenBucketModel: TokenBucketModel;

async function load({
  existingTokenBucketConfig,
  configPath,
}: TokenBucketModelOptions): Promise<void> {
  const tokenBucketConfig: TokenBucketConfig =
    existingTokenBucketConfig || (await loadConfig(configPath + ''));

  tokenBucketModel = {};
  for (const { endpoint, burst, sustained } of tokenBucketConfig.rateLimitsPerEndpoint) {
    tokenBucketModel[endpoint] = {
      burst,
      sustained,
      tokens: burst,
      lastRefilledDate: Date.now(),
    };
  }
  console.log('Loaded token bucket model: \n' + JSON.stringify(tokenBucketModel, null, 2));
}

async function takeTokens(bucketName: string, numTokens: number): Promise<TokenRemovalResponse> {
  const tokenBucketStatus = tokenBucketModel[bucketName];
  // TODO: make behavior on whether to fail requests where bucket is not found configurable via env variable
  if (!tokenBucketStatus) throwNotFoundError(`'${bucketName}' not found.`);

  refillBucket(tokenBucketStatus);
  if (tokenBucketStatus.tokens >= numTokens) {
    tokenBucketStatus.tokens -= numTokens;
    // TODO: log statement should be changed to debug before putting in production as too chatty
    console.log(
      `[tokenBuckets.model.takeTokens] Removing ${numTokens} token(s) from token bucket '${bucketName}' with ${tokenBucketStatus.tokens} token(s) remaining.`,
    );
    return {
      // responding with whole number tokens remaining without losing precision internally
      wholeTokensRemaining: Math.floor(tokenBucketStatus.tokens),
      tokensRemoved: numTokens,
    };
  }
  // TODO: log statement should be changed to debug before putting in production as too chatty
  console.log(
    `[tokenBuckets.model.takeTokens] Not enough tokens left for '${bucketName}' to remove ${numTokens} token(s) as ${tokenBucketStatus.tokens} token(s) remaining.`,
  );
  return {
    // responding with whole number tokens remaining without losing precision internally
    wholeTokensRemaining: Math.floor(tokenBucketStatus.tokens),
    tokensRemoved: 0,
  };
}

function refillBucket(tokenBucketStatus: TokenBucketStatus) {
  const { tokens, burst, lastRefilledDate, sustained } = tokenBucketStatus;
  const now = Date.now();
  //TODO: handle inaccuracies of javascript floating point addition/multiplication
  const timePassedSec = (now - lastRefilledDate) / 1000;
  const tokensAddedPerSec = sustained / 60;
  const tokensToAdd = timePassedSec * tokensAddedPerSec;

  if (tokensToAdd > 0) {
    tokenBucketStatus.tokens = Math.min(tokens + tokensToAdd, burst);
    tokenBucketStatus.lastRefilledDate = now;
  }
}

interface TokenRemovalResponse {
  /** Tokens removed from bucket **/
  tokensRemoved: number;
  /** Tokens remaining in bucket rounded down as a whole number **/
  wholeTokensRemaining: number;
}

type TokenBucketModel = Record<string, TokenBucketStatus>;

interface TokenBucketStatus {
  /** The number of burst requests allowed. **/
  burst: number;
  /** The number of sustained requested per minute. **/
  sustained: number;
  /** Tokens left in bucket, including partial tokens **/
  tokens: number;
  /** Bucket last refilled date (milliseconds since epoch) **/
  lastRefilledDate: number;
}

interface TokenBucketModelOptions {
  existingTokenBucketConfig?: TokenBucketConfig;
  configPath?: string;
}
