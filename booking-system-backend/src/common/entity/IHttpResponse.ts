export interface IHttpResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
  devError?: any;
  devData?: any;
  error?: any;
  apiUid?: string;
}
