import { ICampaign } from '../schema/campaign.schema';
import { IsDate, IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { CandidateDto } from './candidate.dto';

export class CampaignDto implements ICampaign {
  @IsNotEmpty()
  title: string;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @IsNotEmpty()
  candidates: CandidateDto[];

  @IsEmpty()
  id?: string;

  constructor(title: string, startTime: Date, endTime: Date, candidates: CandidateDto[], id: string) {
    this.title = title;
    this.startTime = startTime;
    this.endTime = endTime;
    this.candidates = candidates;
    this.id = id;
  }

}
