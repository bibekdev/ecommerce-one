import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    CloudinaryModule,
    PaymentModule,
    OrderModule,
    MongooseModule.forRoot('mongodb://localhost:27017/ecommerce'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
