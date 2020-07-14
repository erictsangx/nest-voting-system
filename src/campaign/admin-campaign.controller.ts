import { Body, Controller, Get, Post, Query, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CampaignService } from './campaign.service';
import { Campaign } from './campaign.schema';
import { Types } from 'mongoose';
import { CampaignDto } from './dto/campaign.dto';
import { VoteCount } from './vote-count.schema';

const INVALID_DATE = 'startTime > endTime';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('/api/v1/campaign/admin')
export class AdminCampaignController {

  constructor(private readonly campaignService: CampaignService) {}

  @Post('/create')
  @ApiResponse({ status: 201, type: CampaignDto})
  @ApiUnprocessableEntityResponse({ description: INVALID_DATE })
  async create(@Body() campaignDto: CampaignDto): Promise<CampaignDto | null> {

    if (campaignDto.startTime > campaignDto.endTime) {
      throw  new UnprocessableEntityException(INVALID_DATE);
    }

    //sanitize ids
    campaignDto.id = undefined;
    campaignDto.candidates = campaignDto
      .candidates
      .map(ele => {
        return { name: ele.name, id: Types.ObjectId().toHexString() };
      });

    return await this.campaignService.create(campaignDto);
  }

  // @Get('/confirm-vote-count')
  // @ApiResponse({ status: 201, description: 'Count all votes of a campaign and update the corresponding vote count' })
  // @ApiUnprocessableEntityResponse({ description: INVALID_DATE })
  // async confirmVoteCount(@Query('campaignId') campaignId: string) {
  //   const campaign = await this.campaignService.findById(campaignId);
  //
  //   campaign?.candidates.forEach()
  //   console.log('campaign', campaign);
  // }
}
