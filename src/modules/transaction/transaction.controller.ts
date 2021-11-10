import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';

import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  createTransaction(@Body() data: any, @I18nLang() lang: string) {
    return this.transactionService.createTransaction(data, lang);
  }

  @Get(':token')
  async getDetails(@Param('token') token: string) {
    return this.transactionService.getDetails(token);
  }

  // @MessagePattern('testing')
  // async testingMQ(@Payload() data: number[], @Ctx() context: RmqContext) {
  //   // const channel = context.getChannelRef();
  //   // const originalMsg = context.getMessage();
  //   // console.log(channel, originalMsg);
  //   console.log(data, context);
  //   return true;
  // }
}
