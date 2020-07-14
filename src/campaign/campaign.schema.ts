import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CandidateDto } from './dto/candidate.dto';
import { CampaignDto } from './dto/campaign.dto';

export interface ICampaign {
  title: string;
  startTime: Date;
  endTime: Date;
  candidates: CandidateDto[];
}

@Schema()
export class Campaign extends Document implements ICampaign {
  @Prop({ required: true })
  title!: string;
  @Prop({ required: true })
  startTime!: Date;
  @Prop({ required: true })
  endTime!: Date;
  @Prop({ required: true })
  candidates!: CandidateDto[];

}

const CampaignSchema = SchemaFactory.createForClass(Campaign);

CampaignSchema.methods.toDto = function (): CampaignDto {
  const obj = this.toObject();
  return new CampaignDto(obj.title, obj.startTime, obj.endTime, obj.candidates, obj._id);
};

export { CampaignSchema };

// export const CampaignSchema = new mongoose.Schema({
//   title: String,
//   startTime: Date,
//   endTime: Date,
//   candidates: {
//     name: String,
//     id: { type: mongoose.Types.ObjectId, default: mongoose.Types.ObjectId() }
//   }
// });
