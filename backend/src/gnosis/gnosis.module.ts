import { Module } from "@nestjs/common";
import { GnosisService } from "./gnosis.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [GnosisService],
  exports: [GnosisService],
})
export class GnosisModule {}
