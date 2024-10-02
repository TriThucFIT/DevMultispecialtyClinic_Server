import { Expose, plainToInstance } from 'class-transformer';

export abstract class BaseDTO {
  id: number;
  @Expose()
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  static plainToInstance<T>(
    this: new (...args: any[]) => T,
    obj: T,
  ): T {
    return plainToInstance(this, obj, { excludeExtraneousValues: true });
  }
}
