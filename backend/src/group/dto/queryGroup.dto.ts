import { IsNumber, IsOptional, IsDefined , IsMongoId} from 'class-validator';
  
export class QueryGroupDto { 

    @IsOptional()
    groupAddress:String
}