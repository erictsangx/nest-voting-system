import { IVoteCount } from '../interface/vote-count.interface';
import { VoteCount } from '../schema/vote-count.schema';

export class VoteCountEntity implements IVoteCount {
  candidateId: string;
  count: number;
  updatedAt: Date;

  constructor(candidateId: string, count: number, updatedAt: Date) {
    this.candidateId = candidateId;
    this.count = count;
    this.updatedAt = updatedAt;
  }

  static fromDoc(obj: VoteCount): VoteCountEntity {
    return new VoteCountEntity(obj.candidateId, obj.count, obj.updatedAt);
  }
}
