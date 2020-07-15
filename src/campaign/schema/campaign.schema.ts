import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICampaign } from '../interface/campaign.interface';
import { CandidateEntity } from '../entity/candidate.entity';

@Schema()
export class Campaign extends Document implements ICampaign {
  @Prop({ required: true })
  title!: string;
  @Prop({ required: true })
  startTime!: Date;
  @Prop({ required: true })
  endTime!: Date;
  @Prop({ required: true })
  candidates!: CandidateEntity[];

}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
