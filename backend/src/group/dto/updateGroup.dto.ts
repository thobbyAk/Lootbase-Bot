import { IsNumber, IsOptional, IsDefined , IsMongoId} from 'class-validator';
  
export class UpdateGroupDto { 

    @IsOptional()
    description:String

    @IsOptional()
    coverImage:String

    @IsOptional()
    logo:String
}