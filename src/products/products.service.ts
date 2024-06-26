import { CreateProductDto } from './dtos/create-product.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BaseQuery, SearchQuery } from 'src/common/interface';
import { Product } from 'src/schemas/Product';
import { EditProductDto } from './dtos/edit-product.dto';

const PAGE_SIZE = 10;

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Product image is required');
    }
    const result = await this.cloudinaryService.uploadFile(file);
    if (!result.public_id) {
      throw new BadRequestException('Error uploading product image');
    }
    const product = await this.productModel.create({
      name: createProductDto.name,
      price: +createProductDto.price,
      stock: +createProductDto.stock,
      category: createProductDto.category,
      photo: result.secure_url,
    });
    return product;
  }

  async fetchAdminProducts(page: number) {
    const skip = (page - 1) * 10;

    return this.productModel
      .find()
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .skip(skip)
      .exec();
  }

  async fetchProducts(searchQuery: SearchQuery) {
    const page = searchQuery.page ? searchQuery.page : 1;
    const skip = (page - 1) * 10;

    const baseQuery: BaseQuery = {};

    if (searchQuery.search) {
      baseQuery.name = {
        $regex: searchQuery.search,
        $options: 'i',
      };
    }

    if (searchQuery.price) {
      baseQuery.price = {
        $lte: searchQuery.price,
      };
    }

    if (searchQuery.category) {
      baseQuery.category = searchQuery.category;
    }

    const products = await this.productModel
      .find(baseQuery)
      .limit(PAGE_SIZE)
      .skip(skip)
      .sort(
        searchQuery.sort
          ? { price: searchQuery.sort === 'asc' ? 1 : -1, createdAt: -1 }
          : { createdAt: -1 },
      )
      .exec();

    const total = await this.productModel.countDocuments().exec();

    const nextPage = total > skip + PAGE_SIZE ? page + 1 : null;

    return {
      meta: {
        hasNextPage: nextPage ? true : false,
        nextPage,
      },
      data: {
        products,
      },
    };
  }

  async fetchCategories() {
    const categories = await this.productModel.distinct('category').exec();
    return categories;
  }

  async getSingleProduct(productId: string) {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }
    return product;
  }

  async deleteProduct(productId: string) {
    await this.getSingleProduct(productId);
    await this.productModel.deleteOne({ _id: productId });
    return { message: 'Product deleted successfully' };
  }

  async editProduct(productId: string, editProductDto: EditProductDto) {
    const product = await this.getSingleProduct(productId);
    await this.productModel
      .findByIdAndUpdate(productId, {
        $set: {
          name: editProductDto.name ? editProductDto.name : product.name,
          price: editProductDto.price ? editProductDto.price : product.price,
          stock: editProductDto.stock ? editProductDto.stock : product.stock,
          category: editProductDto.category
            ? editProductDto.category
            : product.category,
          photo: product.photo,
        },
      })
      .exec();
    return { message: 'Product edited successfully' };
  }
}
