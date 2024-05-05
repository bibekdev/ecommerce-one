import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Product name is required' })
  name: string;

  @IsNumber({}, { message: 'Product price is required' })
  price: number;

  @IsNumber({}, { message: 'Product stock is required' })
  stock: number;

  @IsString({ message: 'Product category is required' })
  category: string;
}
