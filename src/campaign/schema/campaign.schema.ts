import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CandidateDto } from '../dto/candidate.dto';

export interface ICampaign {
  title: string;
  startTime: Date;
  endTime: Date;
  candidates: CandidateDto[];
}

@Schema()
export class Campaign extends Document implements ICampaign {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  startTime: Date;
  @Prop({ required: true })
  endTime: Date;
  @Prop({ required: true })
  candidates: CandidateDto[];

  constructor(title: string, startTime: Date, endTime: Date, candidates: CandidateDto[]) {
    super();
    this.title = title;
    this.startTime = startTime;
    this.endTime = endTime;
    this.candidates = candidates;
  }
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
