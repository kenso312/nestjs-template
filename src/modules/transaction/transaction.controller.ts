import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly transactionService: TransactionService
  ) {}

  @Post()
  async create(@Body() data: CreateTransactionDto) {
    return this.transactionService.create(data);
  }

  @Get()
  async findAll() {
    return this.transactionService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.transactionService.findOne(+id);
  // }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTransactionDto) {
    return this.transactionService.update(+id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }

  @Post('create')
  transaction(@Body() data: any) {
    this.cacheManager.set('amount', data.amount);
    return {
      invoiceNumber: 'CF20210906000008',
      paymentURL: `${process.env.FRONTEND_URL}/submission/382ue4r2390u4r23890u4r2308ru208u203r8u2038ru203ru`,
    };
  }

  @Get(':token')
  async getDetails(@Query('token') _token: string) {
    return {
      amount: await this.cacheManager.get('amount'),
      invoiceId: 'CF20210906000008',
      type: 'Donation',
    };
  }
}
