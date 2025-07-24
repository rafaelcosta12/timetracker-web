export interface DeepsekRequestPromise {
  response: Promise<Response> | null;
  question?: string;
}
