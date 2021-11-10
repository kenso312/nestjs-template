import { HttpService } from './http.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
