import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, } from 'mongoose';
import { Campaign, ICampaign } from './schema/campaign.schema';
import { VoteCount } from './schema/vote-count.schema';
import { CampaignDto } from './dto/campaign.dto';
import { VoteCountDto } from './dto/vote-count.dto';
import { Vote } from './schema/vote.schema';
import { VoteDto } from './dto/vote.dto';

function toCampaignDto(obj: Campaign): CampaignDto {
  return new CampaignDto(obj.title, obj.startTime, obj.endTime, obj.candidates, obj._id);
}

function toVoteCountDto(obj: VoteCount): VoteCountDto {
  return new VoteCountDto(obj.candidateId, obj.count);
}

@Injectable()
export class CampaignService {

  constructor(
    @InjectModel('Campaign') private readonly campaignModel: Model<Campaign>,
    @InjectModel('VoteCount') private readonly voteCountModel: Model<VoteCount>,
    @InjectModel('Vote') private readonly voteModel: Model<Vote>,
  ) {}

  async create(createCampaignDto: ICampaign): Promise<CampaignDto | null> {
    const campaign = new this.campaignModel(createCampaignDto);
    const zeroCount = campaign.candidates.map(ele => {
      return { candidateId: ele.id, count: 0 };
    });
    await this.voteCountModel.insertMany(zeroCount);
    const result = await campaign.save();
    return toCampaignDto(result);
  }

  async findOne(campaignId: string): Promise<CampaignDto | null> {
    const campaign = await this.campaignModel.findById(campaignId);
    if (campaign != null) {
      return toCampaignDto(campaign);
    }
    return null;
  }

  async countVote(candidateId: string): Promise<number> {
    return this.voteModel.countDocuments({
      candidateId: {
        $eq: candidateId
      }
    });
  }

  async upsertVoteCount(voteCountDto: VoteCountDto): Promise<Query<any>> {
    return this.voteCountModel.updateOne({
      candidateId: {
        $eq: voteCountDto.candidateId
      }
    }, {
      count: voteCountDto.count
    }, {
      upsert: true
    });
  }

  /**
   * sort by total vote counts DESC
   */
  async listAvailable(): Promise<CampaignDto[] | null> {
    const now = new Date();
    const list = await this.campaignModel
      .aggregate(
        [
          {
            '$match': {
              'startTime': {
                '$lte': now
              },
              'endTime': {
                '$gte': now
              }
            }
          }, {
          '$lookup': {
            'from': 'votecounts',
            'localField': 'candidates.id',
            'foreignField': 'candidateId',
            'as': 'counting'
          }
        }, {
          '$addFields': {
            'total': {
              '$sum': '$counting.count'
            }
          }
        }, {
          '$sort': {
            'total': -1
          }
        }, {
          '$project': {
            'counting': 0,
            'total': 0,
            '__v': 0
          }
        }
        ]
      ).exec();
    return list.map((ele: any) => {
      return toCampaignDto(ele);
    });
  }

  /**
   * sort by endTime DESC
   */
  async listExpired(): Promise<CampaignDto[] | null> {
    const list = await this.campaignModel.find(({
      endTime: {
        $lt: new Date()
      }
    })).sort({
      endTime: -1
    }).exec();

    return list.map((ele) => {
      return toCampaignDto(ele);
    });
  }

  async getVoteCount(candidateIds: string[]): Promise<VoteCountDto[]> {
    const list = await this.voteCountModel.find({
      candidateId: {
        $in: candidateIds
      }
    });

    return list.map((ele) => {
      return toVoteCountDto(ele);
    });
  }

  /**
   * Mongo UNIQUE COMPOUND INDEX(campaignId, hkId)
   * Ignore duplicated votes
   */
  async createVote(voteDto: VoteDto): Promise<Vote | null> {
    const vote = new this.voteModel(voteDto);
    try {
      return await vote.save();
    } catch (err) {
      console.warn(err.message);
      return null;
    }
  }

  /**
   * Increase vote count by 1
   * @param candidateId
   */
  async incVoteCount(candidateId: string): Promise<VoteCount | null> {
    return this.voteCountModel.updateOne({
      candidateId: {
        $eq: candidateId
      }
    }, {
      $inc: {
        count: 1
      }
    }, {
      upsert: true
    });
  }

  async listVote(hkId: string): Promise<VoteDto[]> {
    const list = await this.voteModel.find({
      hkId: {
        $eq: hkId
      }
    });
    return list.map(v => {
      return new VoteDto(v.candidateId, v.campaignId, v.hkId);
    });
  }
}
