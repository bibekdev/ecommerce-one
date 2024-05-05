import Stripe from 'stripe';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from 'src/schemas/Coupon';
import { CreateCouponDto } from './dtos/create-coupon.dto';
import { UpdateCouponDto } from './dtos/update-coupon.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {
    this.stripe = new Stripe('', { apiVersion: '2024-04-10' });
  }

  async createPaymentIntent(amount: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async applyCoupon(couponCode: string) {
    const discount = await this.couponModel
      .findOne({ code: couponCode })
      .exec();
    if (!discount) {
      throw new NotFoundException('Coupon is invalid');
    }

    return {
      discount: discount.amount,
    };
  }

  async createCoupon(createCouponDto: CreateCouponDto) {
    const existingCoupon = await this.couponModel
      .findOne({
        code: createCouponDto.code,
      })
      .exec();
    if (existingCoupon) {
      throw new BadRequestException('Coupon already exists');
    }
    const coupon = await this.couponModel.create({ ...createCouponDto });
    return coupon;
  }

  async getAllCoupons() {
    const coupons = await this.couponModel.find({}).exec();
    return coupons;
  }

  async getSingleCoupon(couponId: string) {
    const coupon = await this.couponModel.findById(couponId).exec();
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  async editCoupon(couponId: string, updateCouponDto: UpdateCouponDto) {
    await this.getSingleCoupon(couponId);

    await this.couponModel
      .findOneAndUpdate(
        {
          _id: couponId,
        },
        {
          $set: {
            code: updateCouponDto.code && updateCouponDto.code,
            amount: updateCouponDto.amount && updateCouponDto.amount,
          },
        },
        { new: true },
      )
      .exec();

    return { message: 'Coupon updated successfully' };
  }

  async deleteCoupon(couponId: string) {
    await this.getSingleCoupon(couponId);
    await this.couponModel.findByIdAndDelete(couponId).exec();
    return { message: `Coupon with id ${couponId} is not found` };
  }
}
