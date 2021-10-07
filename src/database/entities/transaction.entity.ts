import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethodEntity } from '@entity/paymentMethod.entity';
import { PaymentStatus } from '@util/enums/_index';

@Entity({ name: 'transaction' })
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'nvarchar', length: 20 })
  orderId: string;

  @Column({ type: 'int', default: PaymentStatus.PENDING })
  status: number;

  @ManyToOne(() => PaymentMethodEntity, (entity) => entity.transactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'paymentMethodId' })
  paymentMethod?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
