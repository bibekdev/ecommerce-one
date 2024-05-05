import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [AuthModule, ProductsModule, CloudinaryModule, PaymentModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
