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
} from "@nestjs/common";
import { GroupService } from "src/group/group.service";
import { CreateGroupDto, UpdateGroupDto } from "./dto";
import { QueryGroupDto } from "./dto/queryGroup.dto";
import { MemberService } from "src/member/member.service";
import { QueryMemberDto } from "src/member/dto";

@Controller("groups")
export class GroupController {
  constructor(
    private readonly memberService: MemberService,
    private readonly groupService: GroupService
  ) {}

  @Post()
  async create(@Body() createClubDto: CreateGroupDto): Promise<any> {
    return await this.groupService.create(createClubDto);
  }

  @Get()
  async getAll(@Query() query: QueryGroupDto): Promise<any> {
    return await this.groupService.findAll(query);
  }

  @Put(":groupAddress")
  async put(
    @Param("groupAddress") groupAddress: string,
    @Body() updateData: UpdateGroupDto
  ): Promise<any> {
    return await this.groupService.update(groupAddress, updateData);
  }

  @Get(":groupAddress")
  async getOne(@Param("groupAddress") groupAddress): Promise<any> {
    const group = await this.groupService.findOne({ groupAddress: groupAddress });
    if (!group)
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: "Club not found" },
        HttpStatus.NOT_FOUND
      );
    return group;
  }

  @Get("/:groupAddress/members")
  async getAllMembers(
    @Param("groupAddress") groupAddress,
    @Query() query: QueryMemberDto
  ): Promise<any> {
    return await this.memberService.getAll(groupAddress, query);
  }
}
