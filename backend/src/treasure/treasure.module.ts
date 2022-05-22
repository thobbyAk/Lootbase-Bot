import { Module } from '@nestjs/common';
import { TreasureService } from './treasure.service';
import { TreasureController } from './treasure.controller';

@Module({
  providers: [TreasureService],
  controllers: [TreasureController]
})
export class TreasureModule {}
