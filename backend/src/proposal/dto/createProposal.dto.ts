import { IsNumber, IsOptional, IsDefined, IsMongoId } from "class-validator";

export class CreateProposalDto {
  @IsDefined()
  groupAddress: String;

  @IsDefined()
  title: String;

  @IsDefined()
  description: String;

  @IsDefined()
  transactionHash: String;

  @IsDefined()
  url: String;

  @IsDefined()
  image: String;

  @IsDefined()
  messageId: String;

  @IsOptional()
  status: String;
}
