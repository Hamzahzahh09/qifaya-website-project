import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private variantRepo: Repository<ProductVariant>,
    @InjectRepository(ProductImage)
    private imageRepo: Repository<ProductImage>,
  ) {}

  async onApplicationBootstrap() {
    const categoryCount = await this.categoryRepo.count();
    if (categoryCount > 0) return;

    console.log('Seeding Qifaya Catalog...');

    const categories = [
      {
        name: 'Abaya Exclusive',
        slug: 'abaya-exclusive',
        description: 'Premium Abayas for all occasions',
      },
      {
        name: 'Gamis Modern',
        slug: 'gamis-modern',
        description: 'Elegant and modern modest dresses',
      },
      {
        name: 'Koko / Kurta',
        slug: 'koko-kurta',
        description: 'Stylish and comfortable men wear',
      },
      {
        name: 'Khimar & Pashmina',
        slug: 'khimar-pashmina',
        description: 'High quality headwear',
      },
    ];

    const savedCategories = await this.categoryRepo.save(categories);

    const products = [
      {
        name: 'Sultana Silk Abaya',
        slug: 'sultana-silk-abaya',
        description: 'Luxurious silk abaya with intricate details.',
        basePrice: 459000,
        categoryId: savedCategories[0].id,
      },
      {
        name: 'Malik Linen Koko',
        slug: 'malik-linen-koko',
        description: 'Breathable linen koko for your daily prayers.',
        basePrice: 289000,
        categoryId: savedCategories[2].id,
      },
    ];

    const savedProducts = await this.productRepo.save(products);

    // Add variants
    await this.variantRepo.save([
      { productId: savedProducts[0].id, name: 'S / Black', stock: 10 },
      { productId: savedProducts[0].id, name: 'M / Black', stock: 15 },
      { productId: savedProducts[1].id, name: 'L / White', stock: 20 },
    ]);

    // Add images
    await this.imageRepo.save([
      {
        productId: savedProducts[0].id,
        url: 'https://images.unsplash.com/photo-1631230322206-58605a639686',
        isPrimary: true,
      },
      {
        productId: savedProducts[1].id,
        url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
        isPrimary: true,
      },
    ]);

    console.log('Seeding completed successfully.');
  }
}
