// eslint-disable-next-line max-classes-per-file
import ErrorCodes from './errorCodes';

export {
  throwInvalidInputError,
  throwUnauthorizedError,
  throwNotFoundError,
  throwStaleUpdateError,
  throwRequestError,
  ErrorWithCode,
  RequestError,
  RequestErrorResponse,
  ValidationError,
};

function throwInvalidInputError(message = 'Invalid input error.'): never {
  throw new ErrorWithCode(message, ErrorCodes.INVALID_INPUT);
}

function throwUnauthorizedError(message = 'Unauthorized error.'): never {
  throw new ErrorWithCode(message, ErrorCodes.UNAUTHORIZED);
}

function throwNotFoundError(message = 'Entity not found.'): never {
  throw new ErrorWithCode(message, ErrorCodes.NOT_FOUND);
}

function throwStaleUpdateError(
  message = 'Entity modified during request and unable to be updated.',
): never {
  throw new ErrorWithCode(message, ErrorCodes.STALE_UPDATE);
}

function throwRequestError(
  responseErrorStatus: number,
  requestErrorResponse: RequestErrorResponse,
): never {
  throw new RequestError(responseErrorStatus, requestErrorResponse);
}

class ErrorWithCode extends Error {
  readonly code: string | number;
  constructor(message: string, code: string | number) {
    super(message); // 'Error' breaks prototype chain here
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

class RequestError extends ErrorWithCode {
  readonly responseErrorStatus: number;
  readonly requestErrorResponse: RequestErrorResponse;
  constructor(responseErrorStatus: number, requestErrorResponse: RequestErrorResponse) {
    super(requestErrorResponse.message, ErrorCodes.REQUEST_ERROR);
    this.responseErrorStatus = responseErrorStatus;
    this.requestErrorResponse = requestErrorResponse;
    // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

interface RequestErrorResponse {
  message: string;
  code: string | number;
  validationErrorStatus: number;
  validationErrors: ValidationError[];
}

interface ValidationError {
  path: string;
  message: string;
  error_code: string;
}
