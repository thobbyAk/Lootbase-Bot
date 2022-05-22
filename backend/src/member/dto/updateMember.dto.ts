import { IsNumber, IsOptional, IsDefined , IsMongoId} from 'class-validator';
  
export class UpdateMemberDto {

    @IsOptional()
    name: string;

    @IsOptional()
    profilImage: string;

    @IsOptional()
    address: string;

    @IsOptional()
    groupAddress: string;
}