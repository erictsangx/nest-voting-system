import { IsNotEmpty } from 'class-validator';

export class VoteDto {
  @IsNotEmpty()
  candidateId: string;
  @IsNotEmpty()
  campaignId: string;
  @IsNotEmpty()
  hkId: string;

  constructor(candidateId: string, campaignId: string, hkId: string) {
    this.candidateId = candidateId;
    this.campaignId = campaignId;
    this.hkId = hkId;
  }
}
