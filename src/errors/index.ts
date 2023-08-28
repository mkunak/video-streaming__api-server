export interface IResponseError {
  message: string
  field?: string
};

// Abstract Fabric pattern
export abstract class HttpError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  abstract serializeErrors(): IResponseError[];
}

export class NotFoundError extends HttpError {
  statusCode = 404;
  reason = 'Not found';

  constructor() {
    super('Route not found');

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): IResponseError[] {
    return [{ message: this.reason }];
  }
}

export class BadRequestError extends HttpError {
  statusCode = 400;
  reason: string;

  constructor(reason: string) {
    super(reason);

    this.reason = reason;

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): IResponseError[] {
    return [{ message: this.reason }];
  }
}

export class VideoProcessorError extends Error {
  constructor(private reason: string) {
    super(reason);

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, VideoProcessorError.prototype);
  }

  serializeErrors(): IResponseError[] {
    return [{ message: this.reason }];
  }
}
