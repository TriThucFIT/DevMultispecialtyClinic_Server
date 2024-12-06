import { Expose } from 'class-transformer';

export class ApiResponseDto<T> {
  statusCode: number;
  message: string;
  data: T;
}

export class ErrorDto {
  @Expose()
  errorCode?: string;

  @Expose()
  errorMessage: string;
}
