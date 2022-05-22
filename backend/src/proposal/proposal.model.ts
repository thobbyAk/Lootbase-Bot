import * as moongose from "mongoose";

export const ProposalSchema = new moongose.Schema({
  messageId: String,
  groupAddress: String,
  title: String,
  transactionHash: String,
  description: String,
  url: String,
  image: String,
  createdAt: Date,
  status: String,
});

export interface Proposal extends moongose.Document {
  messageId: string;
  groupAddress: string;
  transactionHash: string;
  title: string;
  description: string;
  url: string;
  image: string;
  createdAt: Date;
  status: string;
}
