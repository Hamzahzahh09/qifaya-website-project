import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAllProducts(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true },
      relations: ['category', 'images', 'variants'],
    });
  }

  async findProductBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug, isActive: true },
      relations: ['category', 'images', 'variants'],
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
}
