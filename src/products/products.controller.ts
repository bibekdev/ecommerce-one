import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductsService } from './products.service';
import { EditProductDto } from './dtos/edit-product.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enum';
import { SearchQuery } from 'src/common/interface';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async createProducts(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.createProduct(createProductDto, file);
  }

  @Get()
  async fetchProducts(
    @Query('page') page: string,
    @Query('search') search?: string,
    @Query('price') price?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
  ) {
    const searchQuery: SearchQuery = {
      page: +page,
      search,
      price: +price,
      category,
      sort,
    };
    return this.productsService.fetchProducts(searchQuery);
  }

  @Roles(UserRole.ADMIN)
  @Get('admin/all')
  async fetchAdminProducts(@Query('page') page: string) {
    return this.productsService.fetchAdminProducts(Number(page));
  }

  @Get(':productId')
  async fetchSingleProduct(@Param('productId') productId: string) {
    return this.productsService.getSingleProduct(productId);
  }

  @Roles(UserRole.ADMIN)
  @Delete('delete/:productId')
  async deleteProduct(@Param('productId') productId: string) {
    return this.productsService.deleteProduct(productId);
  }

  @Roles(UserRole.ADMIN)
  @Put('edit/:productId')
  async editProduct(
    @Param('productId') productId: string,
    @Body() editProductDto: EditProductDto,
  ) {
    return this.productsService.editProduct(productId, editProductDto);
  }
}
