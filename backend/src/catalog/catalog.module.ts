import { Module } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductVariant, ProductImage]),
  ],
  providers: [CatalogService, SeedService],
  controllers: [CatalogController],
  exports: [CatalogService],
})
export class CatalogModule {}
