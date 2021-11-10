import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  readonly callbackURL: string;

  @IsNotEmpty()
  @IsString()
  readonly type: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly paymentMethodId: string;

  // @IsOptional()
  // @IsString()
  // readonly userId?: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly platformId: string;
}
