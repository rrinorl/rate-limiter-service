import * as fs from 'node:fs/promises';

export { loadConfig, TokenBucketConfig };

async function loadConfig(configPath: string): Promise<TokenBucketConfig> {
  let tokenBucketConfig: TokenBucketConfig;
  try {
    tokenBucketConfig = JSON.parse((await fs.readFile(configPath)).toString());
  } catch (err) {
    console.error(
      `[tokenBucketsConfigLoader] Unable to load token bucket config at '${configPath}'.`,
    );
    throw err;
  }
  try {
    validateTokenBucketConfig(tokenBucketConfig);
  } catch (err) {
    console.error(`[tokenBucketsConfigLoader] Token bucket config at '${configPath}' is invalid.`);
    throw err;
  }
  console.log('[tokenBucketsConfigLoader] Loaded token bucket configuration.');

  return tokenBucketConfig;
}

function validateTokenBucketConfig(tokenBucketConfig: TokenBucketConfig) {
  //TODO: validate token bucket descriptors using json-schema
  return;
}

interface TokenBucketConfig {
  rateLimitsPerEndpoint: RateLimits[];
}

interface RateLimits {
  /**
   * Route template being limited, acts as a static key provided
   * by the caller to check and consume its request tokens.
   */
  endpoint: string;
  /** The number of burst requests allowed. **/
  burst: number;
  /** The number of sustained requested per minute. **/
  sustained: number;
}
