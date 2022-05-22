import * as moongose from 'mongoose';

export const BotSchema = new moongose.Schema({
    channelId: String,
    guildId: String,
    groupAddress: String,
    createdAt: Date,
    status:String
});


export interface Bot extends moongose.Document {
    channelId: String;
    guildId: String;
    groupAddress: String;
    createdAt: Date;
    status:String;
}