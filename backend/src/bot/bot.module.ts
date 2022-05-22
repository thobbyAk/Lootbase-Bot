import { Module } from "@nestjs/common";
import { BotGateway } from "./bot.gateway";
import { DiscordModule } from "@discord-nestjs/core";
import { GroupModule } from "src/group/group.module";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { ProposalModule } from "src/proposal/proposal.module";
import { MongooseModule } from "@nestjs/mongoose";
import { BotSchema } from "./bot.model";
import { GnosisModule } from "src/gnosis/gnosis.module";
@Module({
  providers: [BotGateway, BotService],
  imports: [
    DiscordModule.forFeature(),
    GroupModule,
    ProposalModule,
    GnosisModule,
    MongooseModule.forFeature([{ name: "Bot", schema: BotSchema }]),
  ],
  controllers: [BotController],
})
export class BotModule {}
