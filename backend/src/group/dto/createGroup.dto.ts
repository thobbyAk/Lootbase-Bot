import { IsOptional, IsDefined } from 'class-validator';
  
export class CreateGroupDto {
    
    @IsDefined()
    channelId:String
    
    @IsDefined()
    guildId:String

    @IsDefined()
    name:String

    @IsDefined()
    symbol:String

    @IsOptional()
    logo:String
}