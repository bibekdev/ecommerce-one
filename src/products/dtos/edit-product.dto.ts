import { IsOptional } from 'class-validator';

export class EditProductDto {
  @IsOptional()
  // @IsString({ message: 'Product name is required' })
  name: string;

  @IsOptional()
  // @IsString({ message: 'Product price is required' })
  price: string;

  @IsOptional()
  // @IsString({ message: 'Product stock is required' })
  stock: string;

  @IsOptional()
  // @IsString({ message: 'Product category is required' })
  category: string;
}
