import { Controller, Get, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  async getProducts() {
    return this.catalogService.findAllProducts();
  }

  @Get('products/:slug')
  async getProduct(@Param('slug') slug: string) {
    return this.catalogService.findProductBySlug(slug);
  }

  @Get('categories')
  async getCategories() {
    return this.catalogService.findAllCategories();
  }
}
