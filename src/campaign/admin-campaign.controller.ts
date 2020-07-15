import { Body, Controller, Post, Query, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CampaignService } from './campaign.service';
import { Types } from 'mongoose';
import { CampaignDto } from './dto/campaign.dto';
import { VoteCountEntity } from './entity/vote-count.entity';
import { CampaignEntity } from './entity/campaign.entity';

const INVALID_DATE = 'startTime > endTime';

@ApiTags('Admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('/api/v1/campaign/admin')
export class AdminCampaignController {

  constructor(private readonly campaignService: CampaignService) {}

  @Post('/create')
  @ApiCreatedResponse({ type: CampaignDto })
  @ApiUnprocessableEntityResponse({ description: INVALID_DATE })
  async create(@Body() campaignDto: CampaignDto): Promise<CampaignEntity | null> {

    if (campaignDto.startTime > campaignDto.endTime) {
      throw  new UnprocessableEntityException(INVALID_DATE);
    }

    //create ids for candidates
    campaignDto.candidates = campaignDto
      .candidates
      .map(ele => {
        return { name: ele.name, id: Types.ObjectId().toHexString() };
      });

    return await this.campaignService.create(campaignDto);
  }

  @ApiOperation({ summary: 'Count all votes of a campaign and update the corresponding vote count' })
  @ApiQuery({ name: 'campaignId', example: '5efdee7032659b4f24d179a6' })
  @Post('/confirm-vote-count')
  async confirmVoteCount(@Query('campaignId') campaignId: string) {
    const campaign = await this.campaignService.findOne(campaignId);

    if (campaign == null) {return;}

    for (const candidate of campaign.candidates) {
      const counting = await this.campaignService.countVote(candidate.id);
      await this.campaignService.upsertVoteCount(new VoteCountEntity(candidate.id, counting, new Date()));
    }
  }
}
