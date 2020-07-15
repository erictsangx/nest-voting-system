import { IsNotEmpty } from 'class-validator';
import { privacyHash } from '../../core/math';

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

  static hashed(dto: VoteDto): VoteDto {
    return new VoteDto(dto.candidateId, dto.campaignId, privacyHash(dto.hkId));
  }

}
