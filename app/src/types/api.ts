export type ApiResponse<T> = {
  data: T;
  requestId?: string;
};

export type ApiError = {
  type: string;
  code: string;
  message: string;
  status?: number;
};
