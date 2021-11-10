// Share global interface
type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

type Either<T, U> = Only<T, U> | Only<U, T>;
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
