import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateMemberDto, QueryMemberDto, UpdateMemberDto } from "./dto";
import { Member } from "./member.model";
import { Model } from "mongoose";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
@Injectable()
export class MemberService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel("Member") private readonly memberModel: Model<Member>
  ) {}

  async create(member: CreateMemberDto): Promise<Member> {
    const createMember = new this.memberModel(member);
    return createMember.save();
  }

  async findOne(query): Promise<any> {
    const data = await this.grFindOneMember(query);
    if (!data.users || !data.users.length) return [];
    const memberDb = await this.dbFindOne({ address: data.users[0].address });
    if (memberDb) {
      data.users[0].profilImage = memberDb.profilImage;
      data.users[0].name = memberDb.name;
    }
    return data.users[0];
  }

  async getAll(groupAddress, query: QueryMemberDto): Promise<any> {
    const members = await this.grFindAllMemberFromGroup(groupAddress, query);
    return await this.mergeData(members);
  }

  async dbFindOne(query): Promise<Member> {
    return await this.memberModel.findOne({ address: query.address });
  }

  async grFindAllMemberFromGroup(groupAddress, queryMember: QueryMemberDto): Promise<any> {
    const query = `{
        groups(where: {address: "${groupAddress}"}) {
          address
          totalDeposited
          totalMinted
          members {
            totalDeposited
            totalMinted
            user {
              id
              address
            }
          }
        }
      }`;
    const { data } = await firstValueFrom(this.httpService.post(process.env.GRAPH_URL, { query }));
    const groups = data.data.groups;
    const members = groups.length ? groups[0].members : [];
    await this.calculShareGroup(members, groups[0].totalMinted);
    return members;
  }

  async grFindOneMember(queryMember: QueryMemberDto): Promise<any> {
    const query = `{
        users(where: {address: "${queryMember.address}"}) {
          id
          address
        }
      }`;
    const { data } = await firstValueFrom(this.httpService.post(process.env.GRAPH_URL, { query }));
    return data.data;
  }

  async mergeData(members) {
    return await Promise.all(
      members.map(async (member): Promise<any> => {
        const membersFromDb = await this.dbFindOne({ address: member.user.address });
        if (membersFromDb) {
          member.user.name = membersFromDb.name;
          member.user.profilImage = membersFromDb.profilImage;
        }
        return member;
      })
    );
  }

  async update(memberAddress, updateData: UpdateMemberDto): Promise<Member> {
    return this.memberModel.findOneAndUpdate({ address: memberAddress }, updateData, {
      upsert: true,
    });
  }

  async calculShareGroup(members, totalMinted) {
    return await Promise.all(
      members.map(async (member): Promise<any> => {
        member.share = (100 * member.totalMinted) / totalMinted;
        return member;
      })
    );
  }
}
