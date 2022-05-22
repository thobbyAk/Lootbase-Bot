import * as moongose from 'mongoose';

export const MemberSchema = new moongose.Schema({
    name: String,
    address: String,
    profilImage:String,
    clubId: [{ type: moongose.Schema.Types.ObjectId, ref: 'Club'}]
});


export interface Member extends moongose.Document {
    name: String;
    profilImage:String
    address: String;
    clubId:String
}