import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    productId!: string;

    @ManyToOne(() => Product, (product) => product.variants)
    @JoinColumn({ name: 'productId' })
    product!: Product;

    @Column()
    name!: string; // e.g. "XL / Black"

    @Column({ nullable: true })
    sku?: string;

    @Column('int', { default: 0 })
    stock!: number;

    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    priceOverride?: number; // If different from base price

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
