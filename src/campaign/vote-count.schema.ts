import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// import { CampaignDto } from './dto/campaign.dto';

@Schema()
export class VoteCount extends Document {
  @Prop({ required: true })
  candidateId!: string;
  @Prop({ required: true })
  count!: number;

  constructor(candidateId: string, count: number) {
    super();
    this.candidateId = candidateId;
    this.count = count;
  }
}

const VoteCountSchema = SchemaFactory.createForClass(VoteCount);

// VoteCountSchema.methods.toDto = function (): CampaignDto {
//   const obj = this.toObject();
//   return new CampaignDto(obj.title, obj.startTime, obj.endTime, obj.candidates, obj._id);
// };

export { VoteCountSchema };

// export const CampaignSchema = new mongoose.Schema({
//   title: String,
//   startTime: Date,
//   endTime: Date,
//   candidates: {
//     name: String,
//     id: { type: mongoose.Types.ObjectId, default: mongoose.Types.ObjectId() }
//   }
// });
