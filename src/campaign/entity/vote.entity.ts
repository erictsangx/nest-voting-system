import { IVote } from '../interface/vote.interface';
import { Vote } from '../schema/vote.schema';
import { VoteDto } from '../dto/vote.dto';
import { privacyHash } from '../../core/math';

export class VoteEntity implements IVote {
  candidateId: string;
  campaignId: string;
  hkId: string;
  addedAt: Date;

  constructor(candidateId: string, campaignId: string, hkId: string, addedAt: Date) {
    this.candidateId = candidateId;
    this.campaignId = campaignId;
    this.hkId = hkId;
    this.addedAt = addedAt;
  }

  static fromDoc(obj: Vote): VoteEntity {
    return new VoteEntity(obj.candidateId, obj.campaignId, obj.hkId, obj.addedAt);
  }

  static fromDto(obj: VoteDto): VoteEntity {
    return new VoteEntity(obj.candidateId, obj.campaignId, privacyHash(obj.hkId), new Date());
  }
}
