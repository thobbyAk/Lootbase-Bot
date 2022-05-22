import { Injectable } from "@nestjs/common";
import { CreateProposalDto } from "src/proposal/dto";
import { Proposal } from "./proposal.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ProposalService {
  constructor(@InjectModel("Proposal") private readonly proposalModel: Model<Proposal>) {}
  async create(proposal: CreateProposalDto): Promise<Proposal> {
    const newProposal = new this.proposalModel({ ...proposal, createdAt: new Date()});
    return newProposal.save();
  }

  async findOne(filter): Promise<Proposal> {
    const query: any = {};
    if(filter.messageId) query.messageId = filter.messageId
    return this.proposalModel.findOne(query);
  }

  async findAll(filter): Promise<Proposal[]> {
    const query: any = {};
    if(filter.groupAddress) query.groupAddress = filter.groupAddress
    return this.proposalModel.find(query);
  }

  async update(_id, updataPayload): Promise<Proposal> {
    return this.proposalModel.findOneAndUpdate({ _id }, updataPayload);
  }
}
