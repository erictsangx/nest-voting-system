import { Body, Controller, Post, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CampaignService } from './campaign.service';
import { Campaign } from './campaign.schema';
import { Types } from 'mongoose';
import { CampaignDto } from './dto/campaign.dto';

const INVALID_DATE = 'startTime > endTime';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('/api/v1/campaign/admin')
export class AdminCampaignController {

  constructor(private readonly campaignService: CampaignService) {}

  @Post('/create')
  @ApiResponse({ status: 201, type: CampaignDto, description: 'Creates a campaign' })
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

    const result = await this.campaignService.create(campaignDto) as any;
    return result?.toDto() ?? null;
  }
}
