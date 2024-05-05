import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCouponDto {
  @IsOptional()
  @IsString({ message: 'Code must be string' })
  code: string;

  @IsNumber({}, { message: 'amount must be a number' })
  @IsOptional()
  amount: number;
}
