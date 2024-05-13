import { IsString } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Product name is required' })
  name: string;

  @IsString({ message: 'Product price is required' })
  price: string;

  @IsString({ message: 'Product stock is required' })
  stock: string;

  @IsString({ message: 'Product category is required' })
  category: string;
}
