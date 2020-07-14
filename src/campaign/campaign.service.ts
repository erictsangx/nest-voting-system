import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, ICampaign } from './campaign.schema';
import { VoteCount } from './vote-count.schema';

@Injectable()
export class CampaignService {

  constructor(
    @InjectModel('Campaign') private readonly campaignModel: Model<Campaign>,
    @InjectModel('VoteCount') private readonly voteCountModel: Model<VoteCount>
  ) {}

  async create(createCampaignDto: ICampaign): Promise<Campaign | null> {
    const campaign = new this.campaignModel(createCampaignDto);
    const zeroCount = campaign.candidates.map(ele => {
      return { candidateId: ele.id, count: 0 };
    });
    await this.voteCountModel.insertMany(zeroCount);
    return campaign.save();
  }
}
