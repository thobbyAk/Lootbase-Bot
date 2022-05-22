import { Injectable } from "@nestjs/common";
import { Bot } from "./bot.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateBotDto, UpdateBotDto } from "./dto";
import { Message } from "discord.js";
import { ProposalService } from "src/proposal/proposal.service";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { Client, TextChannel, Collection, MessageReaction } from "discord.js";
import { GnosisService } from "src/gnosis/gnosis.service";
import { GroupService } from "src/group/group.service";
import {
  SafeTransaction,
  SafeSignature,
  SafeTransactionDataPartial,
} from "@gnosis.pm/safe-core-sdk-types";
import { Proposal } from "src/proposal/proposal.model";

@Injectable()
export class BotService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @InjectModel("Bot") private readonly botModel: Model<Bot>,
    private readonly proposalService: ProposalService,
    private readonly gnosisService: GnosisService,
    private readonly groupService: GroupService
  ) {}

  async create(botPayload: CreateBotDto): Promise<Bot> {
    return new this.botModel({ ...botPayload, status: "pending", createdAt: new Date() }).save();
  }

  async update(_id, botPayload: UpdateBotDto): Promise<Bot> {
    return this.botModel.findOneAndUpdate({ _id }, botPayload);
  }

  async findOne(query): Promise<Bot> {
    const filter: any = {};
    if (query.groupAddress) filter.groupAddress = query.groupAddress;
    if (query.channelId) filter.channelId = query.channelId;
    return this.botModel.findOne(filter);
  }

  async findAll(query): Promise<Bot[]> {
    const filter: any = {};
    if (query.groupAddress) filter.groupAddress = query.groupAddress;
    return this.botModel.find(filter);
  }

  async findById(id): Promise<Bot> {
    return this.botModel.findById(id);
  }

  async handleVote(bot: Bot, message: Message, { time }) {
    try {
      const collected = await this.voteCollector(message, { time });
      const voteCount = collected.size;
      const proposal = await this.proposalService.findOne({ messageId: message.id });
      if (!proposal || proposal.status =="cancel") return;
      if (await this.isProposalValid(message.channelId, voteCount, 50)) {
        await this.proposalService.update(proposal._id, { status: "validate" });
      //  const group = await this.groupService.findOne({ groupAddress: bot.groupAddress });
       // if (!group) return;
       await this.createTransaction(proposal, "0x61a839621d1Aaf2C35b67089563833Ea213014Be");
       //     await this.createTransaction(proposal, group.treasureAddress);
        message.reply("This transaction has been approved !! ");
      }else {
        message.reply("Proposal has been rejected.");
      }
    } catch (error) {
      message.reply("Error... ");
    }
  }

  async voteCollector(message: Message, { time }): Promise<Collection<string, MessageReaction>> {
    const filter = (reaction, user) => {
      return reaction.emoji.name === "👍";
    };
    try {
      await message.awaitReactions({ filter, max: 4, time, errors: ["time"] });
    } catch (collected) {
      return collected;
    }
  }

  async createTransaction(proposal: Proposal, treasureAddress: string) {
    await this.gnosisService.createTransaction(proposal.transactionHash, treasureAddress);
  }

  async isProposalValid(channelId: string, voteCount: number, requiredQorum: number) {
    const channel = await this.client.channels.fetch(channelId);
    const memberSize = (channel as TextChannel).members.size;
    const actualQorum = memberSize ? (100 * voteCount) / memberSize : 0;
    return actualQorum >= requiredQorum;
  }
}
