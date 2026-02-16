import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    slug!: string;

    @Column('text')
    description!: string;

    @Column('decimal', { precision: 12, scale: 2 })
    basePrice!: number;

    @Column({ default: true })
    isActive!: boolean;

    @Column()
    categoryId!: string;

    @ManyToOne(() => Category, category => category.products)
    category!: Category;

    @OneToMany(() => ProductVariant, variant => variant.product)
    variants!: ProductVariant[];

    @OneToMany(() => ProductImage, image => image.product)
    images!: ProductImage[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
