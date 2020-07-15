import { IVote } from '../interface/vote.interface';
import { Vote } from '../schema/vote.schema';

export class VoteEntity implements IVote {
  candidateId: string;
  campaignId: string;
  hkId: string;

  constructor(candidateId: string, campaignId: string, hkId: string) {
    this.candidateId = candidateId;
    this.campaignId = campaignId;
    this.hkId = hkId;
  }

  static fromDoc(obj: Vote): VoteEntity {
    return new VoteEntity(obj.candidateId, obj.campaignId, obj.hkId);
  }
}
