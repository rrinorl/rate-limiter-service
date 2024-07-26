import { NextFunction, Request, Response } from 'express';

export { RequestWithCoercedQueryParams, MiddlewareFunc };

interface RequestWithCoercedQueryParams extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
}

type MiddlewareFunc = (
  req: Request | RequestWithCoercedQueryParams,
  res: Response,
  next: NextFunction,
) => Promise<void>;
