import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IVote } from '../interface/vote.interface';

@Schema()
export class Vote extends Document implements IVote {
  @Prop({ required: true })
  candidateId!: string;
  @Prop({ required: true })
  campaignId!: string;
  @Prop({ required: true })
  hkId!: string;
  @Prop({ required: true, default: new Date() })
  addedAt!: Date;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
