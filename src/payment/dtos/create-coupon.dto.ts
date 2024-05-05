import { IsNumber, IsString } from 'class-validator';

export class CreateCouponDto {
  @IsString({ message: 'Coupon code is required' })
  code: string;

  @IsNumber({}, { message: 'Coupon amount is required' })
  amount: number;
}
