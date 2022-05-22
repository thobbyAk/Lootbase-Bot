import { Injectable } from '@nestjs/common';
import { HttpService, } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { QueryBalanceDto } from './dto';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class BalanceService {
    constructor(
        private readonly configService:ConfigService,
        private readonly httpService : HttpService,
        ) {
        }

    async findAll(query:QueryBalanceDto): Promise<any> {
        const params = {
            key:this.configService.get<string>('covalent.key'),
            nft: true
        }
        const baseUrl = this.configService.get<string>('covalent.url')
        const url = `${baseUrl}address/${query.address}/balances_v2/`
        const { data } = await firstValueFrom(this.httpService.get(url, { params }));
        return data.data;
    }
}
