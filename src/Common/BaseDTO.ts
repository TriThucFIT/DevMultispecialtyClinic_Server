import { Expose, plainToInstance } from 'class-transformer';

export abstract class BaseDTO {
  id: number;
  isActive: boolean;
  static plainToInstance<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToInstance(this, obj, { excludeExtraneousValues: true });
  }
}
