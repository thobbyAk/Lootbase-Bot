import { IsOptional, IsDefined } from 'class-validator';
  
export class UpdateBotDto {
    
    @IsOptional()
    channelId:String
    
    @IsOptional()
    guildId:String

    @IsOptional()
    status:String

}