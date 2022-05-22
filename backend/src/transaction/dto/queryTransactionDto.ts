import { IsNumber, IsOptional, IsDefined , IsMongoId} from 'class-validator';
  
export class QueryTransactionDto {
    @IsDefined()
    address: string;

    @IsOptional()
    pageNumber:Number

    @IsOptional()
    pageSize:Number
}