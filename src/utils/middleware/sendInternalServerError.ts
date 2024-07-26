import { Response } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export = sendInternalServerError;

function sendInternalServerError(res: Response): void {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    },
  });
}
