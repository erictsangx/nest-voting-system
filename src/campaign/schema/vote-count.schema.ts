import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class VoteCount extends Document {
  @Prop({ required: true })
  candidateId!: string;
  @Prop({ required: true })
  count!: number;
}

export const VoteCountSchema = SchemaFactory.createForClass(VoteCount);
