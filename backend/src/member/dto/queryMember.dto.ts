import { IsNumber, IsOptional, IsDefined , IsMongoId} from 'class-validator';
  
export class QueryMemberDto {
    @IsOptional()
    groupAddress: String;

    @IsOptional()
    address: String;
}