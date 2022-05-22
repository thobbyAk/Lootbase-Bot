import { IsNumber, IsOptional, IsDefined , IsMongoId} from 'class-validator';
  
export class QueryBalanceDto {
    @IsDefined()
    address: string;

    @IsOptional()
    nft: Boolean;
}