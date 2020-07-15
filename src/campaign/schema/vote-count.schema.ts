import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IVoteCount } from '../interface/vote-count.interface';

@Schema()
export class VoteCount extends Document implements IVoteCount {
  @Prop({ required: true })
  candidateId!: string;
  @Prop({ required: true })
  count!: number;
  @Prop({ required: true })
  updatedAt!: Date;
}

export const VoteCountSchema = SchemaFactory.createForClass(VoteCount);
