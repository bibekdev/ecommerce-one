import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './User';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    required: true,
    type: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pinCode: { type: Number, required: true },
    },
  })
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  tax: number;

  @Prop({ required: true })
  shippingCharges: number;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true })
  total: number;

  @Prop({
    type: String,
    enum: ['PROCESSING', 'SHIPPED', 'DELIVERED'],
    default: 'PROCESSING',
  })
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

  @Prop([
    {
      name: String,
      photo: String,
      price: Number,
      quantity: Number,
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    },
  ])
  orderItems: {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string;
  }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
