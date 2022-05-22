import { Injectable, Logger } from "@nestjs/common";
import { Once, InjectDiscordClient, On, UseGuards, UseCollectors } from "@discord-nestjs/core";
import { Client, Message, MessageEmbed, TextChannel } from "discord.js";

import { MessageFromUserGuard } from "./guards/message-from-user.guard";
import { ActivateCommandGuard } from "./guards/bot-command.guard";
import { VoteCollector } from "./vote-collector";
import { GroupService } from "src/group/group.service";
import { BotService } from "./bot.service";

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly groupService: GroupService,
    private readonly botService: BotService
  ) {}

  @Once("ready")
  onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`);
  }

  @On("messageCreate")
  @UseGuards(MessageFromUserGuard, ActivateCommandGuard)
  async onMessage(message: Message): Promise<void> {
    const id = message.content.split("!setup")[1];
    const bot = await this.botService.findById(id);
    let embeds = {
      title: "Bot connected!",
      description: "Congradulation! Your bot has been connected to this channel.",
      type: "rich",
      color: 0x00ffff,
    };

    if (!bot) {
      embeds.title = `Bot not found`;
      embeds.description = `Make sure you have the righ command`;
    } else {
      await this.botService.update(id, {
        guildId: message.guildId,
        channelId: message.channelId,
        status: "activated",
      });
    }

    await message.reply({ embeds: [embeds] });
  }

}
