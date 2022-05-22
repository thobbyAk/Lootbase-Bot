import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from "@nestjs/common";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { Client, TextChannel } from "discord.js";
import { GroupService } from "src/group/group.service";
import { ProposalService } from "src/proposal/proposal.service";
import { Bot } from "./bot.model";
import { BotService } from "./bot.service";
import { CreateBotDto } from "./dto";

@Controller("bot")
export class BotController {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly botService: BotService,
    private readonly proposalService: ProposalService
  ) {}

  @Post("/depostit")
  async depositLink(@Body() depositPayload): Promise<any> {
    const bot = await this.botService.findOne({ groupAddress: depositPayload.groupAddress });
    if (!bot) throw new HttpException("BOT NOT FOUND", HttpStatus.NOT_FOUND);
    if (bot.status !== "activated")
      throw new HttpException("BOT NOT ACTIVATED", HttpStatus.BAD_REQUEST);

    const messageComponent = {
      type: 1,
      components: [
        {
          style: 5,
          label: `Add deposit `,
          url: `https://dyspay.com`,
          disabled: false,
          emoji: {
            id: null,
            name: `💵`,
          },
          type: 2,
        },
      ],
    };

    const messageEmbed = {
      type: "rich",
      title: `DEPOSIT OPEN`,
      description: `A group wallet has been created you can now proccess to the deposit in USDC`,
      color: 0x0099ff,
    };

    const channel = await this.client.channels.fetch(bot.channelId.toString());
    (channel as TextChannel).send({ components: [messageComponent], embeds: [messageEmbed] });
    return bot;
  }

  @Post("/proposal")
  async createProposal(@Body() proposalPayload): Promise<any> {
    const bot = await this.botService.findOne({ groupAddress: proposalPayload.groupAddress });
    if (!bot) throw new HttpException("BOT NOT FOUND", HttpStatus.NOT_FOUND);
    if (bot.status !== "activated")
      throw new HttpException("BOT NOT ACTIVATED", HttpStatus.BAD_REQUEST);

    const messageEmbed = {
      type: "rich",
      title: `NEW DEAL PROPOSAL !!`,
      description: `#8520\nPrice :  60 WETH\n\nreact with  👍  to vote for`,
      color: 0x0099ff,
      image: {
        url: `https://cdn.vox-cdn.com/thumbor/tGNxLvljqJFaFg8GB8IBvTVPNgk=/155x65:995x648/920x613/filters:focal(489x354:677x542):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/70264946/bored_ape_nft_accidental_.0.jpg`,
        height: 0,
        width: 0,
      },
    };
    const channel = await this.client.channels.fetch(bot.channelId.toString());
    const message = await (channel as TextChannel).send({ embeds: [messageEmbed] });
    message.react("👍");

    this.botService.handleVote(bot, message, { time: proposalPayload.time });

    return await this.proposalService.create({
      groupAddress: bot.groupAddress,
      messageId: message.id,
      title: proposalPayload.title,
      description: proposalPayload.description,
      url: proposalPayload.url,
      image: proposalPayload.image,
      status: "pending",
      transactionHash: proposalPayload.transactionHash,
    });
  }

  @Post()
  async create(@Body() botPayload: CreateBotDto): Promise<Bot> {
    return this.botService.create(botPayload);
  }

  @Get()
  async findAll(@Query() query): Promise<Bot[]> {
    return this.botService.findAll(query);
  }
}
