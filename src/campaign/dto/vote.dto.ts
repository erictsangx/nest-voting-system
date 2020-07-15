import { IsNotEmpty } from 'class-validator';
import { IVote } from '../interface/vote.interface';

export class VoteDto implements IVote {
  @IsNotEmpty()
  candidateId!: string;
  @IsNotEmpty()
  campaignId!: string;
  @IsNotEmpty()
  hkId!: string;
}
