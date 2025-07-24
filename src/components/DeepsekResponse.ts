export interface DeepsekResponse {
  dateTime: Date;
  model: string;
  response: string;
  question?: string;
}
