import { Controller, Get, Query } from '@nestjs/common';
import { Proposal } from 'src/proposal/proposal.model';
import { ProposalService } from './proposal.service';

@Controller('proposal')
export class ProposalController {
    constructor(
        private readonly proposalService: ProposalService) {}
    @Get()
    async findAll(@Query() query): Promise<Proposal[]> {

      return await this.proposalService.findAll(query);
    }
}
