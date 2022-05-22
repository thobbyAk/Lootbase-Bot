import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  controllers: [BalanceController],
  providers: [BalanceService]
})
export class BalanceModule {}
