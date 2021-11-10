import { CreateTransactionDto } from './dto/_index';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Injectable, Logger } from '@nestjs/common';
import { NormalException } from '@/exception/normal-exception';
import { PaymentStatus } from '@/shared/enums/_index';
import { TransactionRepository } from '@repo/transaction.repository';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger('TransactionService');

  constructor(
    private readonly i18n: I18nRequestScopeService,
    private readonly transactionRepo: TransactionRepository
  ) {}

  async createTransaction(data: CreateTransactionDto, lang: string) {
    const record = this.transactionRepo.create(data);
    const result = await this.transactionRepo.save(record);

    // Create and update session here?

    return {
      invoiceNumber: result.id,
      paymentURL: `${process.env.FRONTEND_URL}${
        lang ? `/${lang}` : null
      }/submission/${result.id}`,
    };
  }

  async getDetails(token: string) {
    const transaction = await this.transactionRepo.findOne(token || '');

    if (transaction?.status === PaymentStatus.PENDING) {
      await this.transactionRepo.update(transaction.id, {
        status: PaymentStatus.ACCESSED,
      });
      return {
        amount: transaction.amount,
        invoiceId: transaction.id,
        type: 'Donation',
      };
    }
    throw new NormalException('Session Timeout', 1001, false);
  }
}
