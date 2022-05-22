import { Injectable } from '@nestjs/common';
import { HttpService, } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { QueryTransactionDto } from './dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class TransactionService {
    constructor(
        private readonly configService:ConfigService,
        private readonly httpService : HttpService,
        ) {
        }

    async findAll(query:QueryTransactionDto ): Promise<any> {
        const params = {
            "page-number":query.pageNumber || 0,
            "page-size":query.pageSize || 10,
            key:this.configService.get<string>('covalent.key')
        }
        const baseUrl = this.configService.get<string>('covalent.url')
        const url = `${baseUrl}address/${query.address}/transactions_v2/`
        const { data } = await firstValueFrom(this.httpService.get(url, { params }));
        return data.data;
    }
}