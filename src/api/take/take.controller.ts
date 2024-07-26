import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as tokenBucketsService from '../../tokenBuckets/tokenBuckets.service';

export { post };

async function post(req: Request, res: Response): Promise<void> {
  const { endpoint } = req.body;
  //TODO: implement request body validation via JSON schema or using open api validation middleware
  if (!endpoint) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: '`endpoint` is a required body parameter.' });
    return;
  }
  if (!endpoint.includes('/')) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: '`endpoint` must contain a url path.`' });
    return;
  }

  const { tokensRemoved, tokensRemaining } = await tokenBucketsService.takeTokens(endpoint, 1);
  res.header('x-ratelimit-remaining', tokensRemaining + '');
  if (!tokensRemoved) {
    res.status(StatusCodes.TOO_MANY_REQUESTS).json({ tokensRemaining });
    return;
  }

  res.status(StatusCodes.OK).json({ tokensRemaining });
}
