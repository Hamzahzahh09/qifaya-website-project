import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
