import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ErrorWithCode, RequestError } from '../error/errorUtils';
import { ErrorCodes } from '../error';
import sendInternalServerError from './sendInternalServerError';

const errorCodeToStatusMap = {
  [ErrorCodes.INVALID_INPUT]: StatusCodes.BAD_REQUEST,
  [ErrorCodes.UNAUTHORIZED]: StatusCodes.UNAUTHORIZED,
  [ErrorCodes.NOT_FOUND]: StatusCodes.NOT_FOUND,
  [ErrorCodes.STALE_UPDATE]: StatusCodes.CONFLICT,
};

export = errorHandler;

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  console.error('[errorHandler] Error caught', { err });

  if (err instanceof RequestError) {
    res.status(err.responseErrorStatus).json(err.requestErrorResponse);
    return;
  }

  if (!(err instanceof ErrorWithCode) || !errorCodeToStatusMap[err.code]) {
    sendInternalServerError(res);
    return;
  }

  const status = errorCodeToStatusMap[err.code];

  res.status(status).json({
    error: {
      message: err.message,
      code: err.code,
    },
  });
}
