import { IsOptional, IsDefined } from 'class-validator';
  
export class CreateBotDto {
    
    @IsOptional()
    channelId:String
    
    @IsOptional()
    guildId:String

    @IsDefined()
    groupAddress:String
}