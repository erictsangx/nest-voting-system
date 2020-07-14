export class VoteCountDto {
  candidateId: string;
  count: number;

  constructor(candidateId: string, count: number) {
    this.candidateId = candidateId;
    this.count = count;
  }
}
