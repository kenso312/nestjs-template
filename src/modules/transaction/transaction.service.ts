import { CreateTransactionDto, UpdateTransactionDto } from './dto/_index';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '@/database/entities/transaction.entity';
import { TransactionRepository } from '@repo/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly i18n: I18nRequestScopeService,
    private readonly transactionRepo: TransactionRepository
  ) {}

  async create(data: CreateTransactionDto): Promise<TransactionEntity> {
    const record = this.transactionRepo.create(data);
    return this.transactionRepo.save(record);
  }

  async findAll(): Promise<TransactionEntity[]> {
    return this.transactionRepo.find();
  }

  async findOne(id: number): Promise<TransactionEntity> {
    return this.transactionRepo.findOneOrFail(id);
  }

  async update(id: number, data: UpdateTransactionDto): Promise<boolean> {
    return (await this.transactionRepo.update(id, data)).affected > 0;
  }

  async remove(id: number): Promise<boolean> {
    return (await this.transactionRepo.delete(id)).affected > 0;
  }
}
