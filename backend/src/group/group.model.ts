import * as moongose from "mongoose";

export const GroupSchema = new moongose.Schema({
  createdAt: Date,
  description: String,
  coverImage: String,
  logo: String,
  address: String,
  members: [{ type: moongose.Schema.Types.ObjectId, ref: "Member" }],
});

export interface Group extends moongose.Document {
  createdAt: Date;
  description: String;
  coverImage: String;
  logo: String;
  address: String;
}
