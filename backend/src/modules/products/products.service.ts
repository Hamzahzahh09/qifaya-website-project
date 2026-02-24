import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(dto: CreateProductDto) {
    const supabase = this.supabaseService.getClient();

    const slug = dto.name.toLowerCase().replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          ...dto,
          slug,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      success: true,
      message: 'Product created successfully',
      data,
    };
  }

  async findAll(query: any) {
    const supabase = this.supabaseService.getClient();

    let request = supabase.from('products').select('*').eq('is_active', true);

    // 🔍 Filter Category
    if (query.category) {
      request = request.eq('category', query.category);
    }

    // 💰 Filter Harga Minimum
    if (query.minPrice) {
      request = request.gte('price', Number(query.minPrice));
    }

    // 💰 Filter Harga Maximum
    if (query.maxPrice) {
      request = request.lte('price', Number(query.maxPrice));
    }

    // 📦 Filter Stock
    if (query.stock) {
      request = request.gte('stock', Number(query.stock));
    }

    // 🔥 KEYWORD SEARCH (name + description)
    if (query.keyword) {
      request = request.or(
        `name.ilike.%${query.keyword}%,description.ilike.%${query.keyword}%`,
      );
    }

    // Sorting terbaru
    request = request.order('created_at', { ascending: false });

    const { data, error } = await request;

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      success: true,
      message: 'Products fetched successfully',
      total: data.length,
      filters: query,
      data,
    };
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new NotFoundException('Product not found');
    }

    return {
      success: true,
      message: 'Product detail fetched successfully',
      data,
    };
  }

  async deactivate(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Product not found');
    }

    return {
      success: true,
      message: 'Product deactivated (soft delete)',
    };
  }

  async permanentDelete(id: string) {
    const supabase = this.supabaseService.getClient();

    // 1️⃣ cek dulu product
    const { data: product, error: checkError } = await supabase
      .from('products')
      .select('id, is_active')
      .eq('id', id)
      .single();

    if (checkError || !product) {
      throw new NotFoundException('Product not found');
    }

    // 2️⃣ pastikan sudah nonaktif
    if (product.is_active) {
      throw new BadRequestException(
        'Product must be deactivated before permanent delete',
      );
    }

    // 3️⃣ baru hard delete
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      success: true,
      message: 'Product permanently deleted',
    };
  }

  async restore(id: string) {
    const supabase = this.supabaseService.getClient();

    // 1️⃣ cek dulu product
    const { data: product, error: checkError } = await supabase
      .from('products')
      .select('id, is_active')
      .eq('id', id)
      .single();

    if (checkError || !product) {
      throw new NotFoundException('Product not found');
    }

    // 2️⃣ pastikan memang sedang nonaktif
    if (product.is_active) {
      throw new BadRequestException('Product is already active');
    }

    // 3️⃣ restore (aktifkan lagi)
    const { error } = await supabase
      .from('products')
      .update({ is_active: true })
      .eq('id', id);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      success: true,
      message: 'Product restored successfully',
    };
  }
}
