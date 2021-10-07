import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}
