import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, } from 'mongoose';
import { Campaign } from './schema/campaign.schema';
import { VoteCount } from './schema/vote-count.schema';
import { CampaignDto } from './dto/campaign.dto';
import { VoteCountEntity } from './entity/vote-count.entity';
import { Vote } from './schema/vote.schema';
import { VoteDto } from './dto/vote.dto';
import { CampaignEntity } from './entity/campaign.entity';
import { VoteEntity } from './entity/vote.entity';

@Injectable()
export class CampaignService {

  constructor(
    @InjectModel('Campaign') private readonly campaignModel: Model<Campaign>,
    @InjectModel('VoteCount') private readonly voteCountModel: Model<VoteCount>,
    @InjectModel('Vote') private readonly voteModel: Model<Vote>,
  ) {}

  /**
   * create a campaign as well as creating voteCounts
   */
  async create(campaignDto: CampaignDto): Promise<CampaignEntity | null> {
    const campaign = new this.campaignModel(campaignDto);
    const zeroCount = campaign.candidates.map(ele => {
      return { candidateId: ele.id, count: 0, updatedAt: new Date() };
    });
    await this.voteCountModel.insertMany(zeroCount);
    const result = await campaign.save();
    return CampaignEntity.fromDoc(result);
  }

  async findOne(campaignId: string): Promise<CampaignEntity | null> {
    const campaign = await this.campaignModel.findById(campaignId);
    if (campaign != null) {
      return CampaignEntity.fromDoc(campaign);
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

  async upsertVoteCount(voteCountEntity: VoteCountEntity): Promise<Query<any>> {
    return this.voteCountModel.updateOne({
      candidateId: {
        $eq: voteCountEntity.candidateId
      }
    }, {
      count: voteCountEntity.count,
      updatedAt: voteCountEntity.updatedAt
    }, {
      upsert: true
    });
  }

  /**
   * sort by total vote counts DESC
   */
  async listAvailable(): Promise<CampaignEntity[] | null> {
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
      return CampaignEntity.fromDoc(ele);
    });
  }

  /**
   * sort by endTime DESC
   */
  async listExpired(): Promise<CampaignEntity[] | null> {
    const list = await this.campaignModel.find(({
      endTime: {
        $lt: new Date()
      }
    })).sort({
      endTime: -1
    }).exec();

    return list.map((ele) => {
      return CampaignEntity.fromDoc(ele);
    });
  }

  /**
   * list all vote counts corresponding to the candidateId
   * @param candidateIds
   */
  async listVoteCount(candidateIds: string[]): Promise<VoteCountEntity[]> {
    const list = await this.voteCountModel.find({
      candidateId: {
        $in: candidateIds
      }
    });

    return list.map((ele) => {
      return VoteCountEntity.fromDoc(ele);
    });
  }

  /**
   * Mongo UNIQUE COMPOUND INDEX(campaignId, hkId)
   * Ignore duplicated votes
   */
  async createVote(voteEntity: VoteEntity): Promise<VoteEntity | null> {
    const vote = new this.voteModel(voteEntity);
    try {
      const result = await vote.save();
      return VoteEntity.fromDoc(result);
    } catch (err) {
      console.warn(err.message);
      return null;
    }
  }

  /**
   * Increase vote count by 1
   */
  async incVoteCount(candidateId: string): Promise<VoteCountEntity | null> {
    const result = await this.voteCountModel.updateOne({
      candidateId: {
        $eq: candidateId
      }
    }, {
      $inc: {
        count: 1
      },
      updatedAt: new Date()
    }, {
      upsert: true
    });
    return VoteCountEntity.fromDoc(result);
  }

  async listVote(hkId: string): Promise<VoteEntity[]> {
    const list = await this.voteModel.find({
      hkId: {
        $eq: hkId
      }
    });
    return list.map(v => {
      return VoteEntity.fromDoc(v);
    });
  }
}
