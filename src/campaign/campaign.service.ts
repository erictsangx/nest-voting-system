import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, } from 'mongoose';
import { Campaign, ICampaign } from './campaign.schema';
import { VoteCount } from './vote-count.schema';
import { CampaignDto } from './dto/campaign.dto';

function toCampaignDto(obj: Campaign): CampaignDto {
  return new CampaignDto(obj.title, obj.startTime, obj.endTime, obj.candidates, obj._id);
}

@Injectable()
export class CampaignService {

  constructor(
    @InjectModel('Campaign') private readonly campaignModel: Model<Campaign>,
    @InjectModel('VoteCount') private readonly voteCountModel: Model<VoteCount>
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

  async listAvailable(): Promise<CampaignDto[] | null> {
    const list = await this.campaignModel
      .aggregate(
        [
          {
            '$match': {
              'startTime': {
                '$lte': new Date()
              },
              'endTime': {
                '$gte': new Date()
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

  async listExpired(): Promise<CampaignDto[] | null> {
    const now = new Date();
    const list = await this.campaignModel.find(({
      endTime: {
        $lt: now
      }
    })).sort({
      endTime: -1
    }).exec();

    return list.map((ele) => {
      return toCampaignDto(ele);
    });
  }
}
