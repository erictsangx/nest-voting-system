import { ICampaign } from '../interface/campaign.interface';
import { CandidateEntity } from './candidate.entity';
import { Campaign } from '../schema/campaign.schema';

export class CampaignEntity implements ICampaign {

  title: string;
  startTime: Date;
  endTime: Date;
  candidates: CandidateEntity[];
  id: string;

  constructor(title: string, startTime: Date, endTime: Date, candidates: CandidateEntity[], id: string) {
    this.title = title;
    this.startTime = startTime;
    this.endTime = endTime;
    this.candidates = candidates;
    this.id = id;
  }

  isAvailable(): boolean {
    const now = new Date();
    return (this.startTime <= now && now <= this.endTime);
  }

  static fromDoc(obj: Campaign): CampaignEntity {
    return new CampaignEntity(obj.title, obj.startTime, obj.endTime, obj.candidates, obj._id);
  }

}
