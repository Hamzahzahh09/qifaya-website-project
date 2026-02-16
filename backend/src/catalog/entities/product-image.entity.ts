import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    productId!: string;

    @ManyToOne(() => Product, (product) => product.images)
    @JoinColumn({ name: 'productId' })
    product!: Product;

    @Column()
    url!: string;

    @Column({ default: false })
    isPrimary!: boolean;

    @Column({ type: 'int', default: 0 })
    displayOrder!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
