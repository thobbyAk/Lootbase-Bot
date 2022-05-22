import { Module } from "@nestjs/common";
import { MemberService } from "./member.service";
import { MemberController } from "./member.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { MemberSchema } from "./member.model";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{ name: "Member", schema: MemberSchema }])],
  exports: [MemberService],
  providers: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}
