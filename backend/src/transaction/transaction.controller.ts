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
import { TransactionService } from './transaction.service';
import { QueryTransactionDto } from './dto';

@Controller('transactions')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService
    ) {}

    @Get()
    async getAll(@Query() query: QueryTransactionDto): Promise<any> {
      return await this.transactionService.findAll(query);
    }
}
