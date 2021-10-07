import { EntityRepository, Repository } from 'typeorm';
import { PaymentMethodEntity } from '@/database/entities/paymentMethod.entity';

@EntityRepository(PaymentMethodEntity)
export class PaymentMethodRepository extends Repository<PaymentMethodEntity> {}
