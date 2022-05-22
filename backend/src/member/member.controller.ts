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
    Put,
  } from '@nestjs/common';
import { CreateMemberDto, QueryMemberDto, UpdateMemberDto } from './dto';
import { MemberService } from './member.service';
import { Member } from 'src/member/member.model';
  
  @Controller('members')
  export class MemberController {
    constructor(
      private readonly memberService: MemberService) {}
  

/*     @Post()
    async create(@Body() createMemberDto: CreateMemberDto): Promise<any> {
      let memberToAdd :Member;
      const clubExist = await this.groupService.findOne({ "_id": createMemberDto.groupAddress });
      if(!clubExist) throw new HttpException({ status: HttpStatus.NOT_FOUND, error: 'Club not found' }, HttpStatus.NOT_FOUND);
      memberToAdd = await this.memberService.findOne({ walletAddress : createMemberDto.walletAddress });
      if(!memberToAdd) memberToAdd = await this.memberService.create(createMemberDto);
      return await this.groupService.addMember(createMemberDto.groupAddress, memberToAdd);
    } */

    @Put(':memberAddress')
    async put(@Param('memberAddress') memberAddress: string, @Body() updateData: UpdateMemberDto): Promise<any> {
      return await this.memberService.update(memberAddress, updateData);
    }

    @Get(':memberAddress')
    async getOne(@Param('memberAddress') memberAddress): Promise<any> {
      const group = await this.memberService.findOne( { "address": memberAddress });
      if(!group) throw new HttpException({ status: HttpStatus.NOT_FOUND, error: 'Club not found' }, HttpStatus.NOT_FOUND)
      return group
    }
  }
  