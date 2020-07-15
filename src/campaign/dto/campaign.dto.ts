import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

import { CandidateDto } from './candidate.dto';
import { ICampaign } from '../interface/campaign.interface';

export class CampaignDto implements ICampaign {
  @IsNotEmpty()
  title!: string;

  @IsDate()
  @Type(() => Date)
  startTime!: Date;

  @IsDate()
  @Type(() => Date)
  endTime!: Date;

  @IsNotEmpty()
  candidates!: CandidateDto[];
}
