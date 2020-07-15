import { ICandidate } from './candidate.interface';

export interface ICampaign {
  title: string;
  startTime: Date;
  endTime: Date;
  candidates: ICandidate[];
}
