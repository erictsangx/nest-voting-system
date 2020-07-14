import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Vote extends Document {
  @Prop({ required: true })
  candidateId!: string;
  @Prop({ required: true })
  campaignId!: string;
  @Prop({ required: true })
  hkId!: string;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
