import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  readonly paymentMethodId: string;

  @IsOptional()
  @IsString()
  readonly userId?: string;

  @IsNotEmpty()
  @IsString()
  readonly platformId: string;
}
