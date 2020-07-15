import { IsNotEmpty } from 'class-validator';
import { ICandidate } from '../interface/candidate.interface';

export class CandidateDto implements ICandidate {
  @IsNotEmpty()
  name!: string;
}
