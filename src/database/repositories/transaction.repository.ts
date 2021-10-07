import { EntityRepository, Repository } from 'typeorm';
import { TransactionEntity } from '@/database/entities/transaction.entity';

@EntityRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {}
