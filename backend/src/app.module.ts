import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [SupabaseModule, AuthModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
