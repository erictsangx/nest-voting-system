import { IVoteCount } from '../interface/vote-count.interface';
import { VoteCount } from '../schema/vote-count.schema';

export class VoteCountEntity implements IVoteCount {
  candidateId: string;
  count: number;

  constructor(candidateId: string, count: number) {
    this.candidateId = candidateId;
    this.count = count;
  }

  static fromDoc(obj: VoteCount): VoteCountEntity {
    return new VoteCountEntity(obj.candidateId, obj.count);
  }
}
