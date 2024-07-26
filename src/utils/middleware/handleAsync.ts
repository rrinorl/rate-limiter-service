import { NextFunction, Request, Response } from 'express';
import { MiddlewareFunc } from '../types/api.types';

export = handleAsync;

/**
 * Middleware wrapper that calls the express error handler on failure. Helpful for controllers or middleware with
 * await calls as the express version we use won't call the express error handler on a failure.
 * @param middlewareFunction
 */
function handleAsync(middlewareFunction: MiddlewareFunc) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await middlewareFunction(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
