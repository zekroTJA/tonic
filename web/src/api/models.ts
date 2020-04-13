/** @format */

export interface APIError {
  code: number;
  error: string;
}

export interface APIArray<T> {
  count: number;
  offset: number;
  data: T[];
}

export interface ImageData {
  name: string;
  location: string;
  date: Date;
  size: number;
  mime_type: string;
}
