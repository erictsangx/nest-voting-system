import { ICandidate } from '../interface/candidate.interface';

export class CandidateEntity implements ICandidate {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
