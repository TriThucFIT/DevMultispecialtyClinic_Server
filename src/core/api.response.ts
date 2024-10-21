import { Response } from 'express';
export default function sendResponse<T>(
  res: Response,
  statusCode: number,
  status: boolean,
  message: string,
  message_VN: string,
  data?: T,
) {
  return res.status(statusCode).json({
    status,
    message,
    message_VN,
    data,
  });
}
