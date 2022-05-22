import { Injectable, HttpException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Member } from "src/member/member.model";
import { Group } from "./group.model";
import { UpdateGroupDto, CreateGroupDto } from "./dto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { QueryGroupDto } from "./dto/queryGroup.dto";

@Injectable()
export class GroupService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel("Group") private readonly groupModel: Model<Group>
  ) {}

  async create(group: CreateGroupDto): Promise<Group> {
    const createClub = new this.groupModel({
      ...group,
      refId: group.channelId,
      createdAt: new Date(),
    });
    return createClub.save();
  }

  async updateOrCreate(updateData: CreateGroupDto): Promise<Group> {
    return this.groupModel.findOneAndUpdate(
      { channelId: updateData.channelId },
      { ...updateData, refId: updateData.channelId },
      { upsert: true }
    );
  }

  async findOne(query): Promise<any> {
    const { data } = await this.grFindAll({ groupAddress: query.groupAddress });
    const groups = await this.mergeData(data);
    return groups[0];
  }

  async findAll(query): Promise<any> {
    const { data } = await this.grFindAll(query);
    return await this.mergeData(data);
  }

  async fetchFromDb(query): Promise<Group> {
    return this.groupModel.findOne({ address: query.groupAddress });
  }

  async grFindAll(queryData: QueryGroupDto): Promise<any> {
    let filterGraph = "";
    if (queryData.groupAddress) filterGraph = `address: "${queryData.groupAddress}"`;
    const query = `{
      groups(where: {${filterGraph}}) {
        address
        groupName
        totalDeposited
        depositEndDate
        depositLimit
        depositToken
        groupSymbol
        owner
        treasureAddress
        totalMinted
        createdAt
      }
    }`;
    const { data } = await firstValueFrom(this.httpService.post(process.env.GRAPH_URL, { query }));
    return data;
  }

  async mergeData(graphData) {
    return await Promise.all(
      graphData.groups.map(async (group): Promise<any> => {
        const groupFromDb = await this.fetchFromDb({ groupAddress: group.address });
        if (groupFromDb) {
          group.description = groupFromDb.description;
          group.logo = groupFromDb.logo;
          group.coverImage = groupFromDb.coverImage;
        }
        return group;
      })
    );
  }

  async update(groupAddress, updateData: UpdateGroupDto): Promise<Group> {
    return this.groupModel.findOneAndUpdate({ address: groupAddress }, updateData, {
      upsert: true,
    });
  }

  async addMember(clubId, member: Member): Promise<Group> {
    return this.groupModel.findByIdAndUpdate(
      clubId,
      { $addToSet: { members: member._id } },
      { new: true, useFindAndModify: false }
    );
  }
}
