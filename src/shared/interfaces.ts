import { Either } from './types';

// Google JSON Guide
// https://stackoverflow.com/a/23708903/11440474
export interface HttpSuccessResponse<T> {
  readonly data: T;
}

export interface HttpFailResponse {
  readonly error: {
    readonly message: string;
    readonly code: number;
  };
}

// https://stackoverflow.com/a/66605669/11440474
export type HttpResponse<T> = Either<HttpSuccessResponse<T>, HttpFailResponse>;
