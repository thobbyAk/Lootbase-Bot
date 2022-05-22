import {
    Controller,
    Post,
    Body,
    HttpException,
    Query,
    Get,
    HttpStatus,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { QueryBalanceDto } from './dto';

@Controller('balances')
export class BalanceController {
    constructor(
        private readonly balanceService: BalanceService
    ) {}

    @Get()
    async getAll(@Query() query: QueryBalanceDto): Promise<any> {
      return await this.balanceService.findAll(query);
    }
}
