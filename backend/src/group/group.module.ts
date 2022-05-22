import { Module } from "@nestjs/common";
import { GroupService } from "./group.service";
import { GroupController } from "./group.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { GroupSchema } from "./group.model";
import { HttpModule } from "@nestjs/axios";
import { MemberModule } from "src/member/member.module";

@Module({
  imports: [
    MemberModule,
    HttpModule,
    MongooseModule.forFeature([{ name: "Group", schema: GroupSchema }]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
