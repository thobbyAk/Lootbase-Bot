import { DiscordGuard } from '@discord-nestjs/core';
import { Message } from 'discord.js';
import { Types } from "mongoose";

export class ActivateCommandGuard implements DiscordGuard {
  canActive(event: 'messageCreate', [message]: [Message]): boolean {
    const ojectId = message.content.split("!setup")[1];
    return message.content.startsWith('!setup') && Types.ObjectId.isValid(ojectId);
  }
}