import { Injectable } from '@nestjs/common';
import {
  DiscordModuleOption,
  DiscordOptionsFactory,
} from '@discord-nestjs/core';
import { Intents } from 'discord.js';

@Injectable()
export class DiscordConfigService implements DiscordOptionsFactory {

  createDiscordOptions(): DiscordModuleOption {
    return {
      token: process.env.DISCORD_TOKEN,
      discordClientOptions: {
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS],
      }
    };
  }
}
