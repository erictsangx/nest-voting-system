import { Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CampaignDto } from './dto/campaign.dto';
import { CampaignService } from './campaign.service';

@Controller('/api/v1/campaign')
export class CampaignController {

  constructor(private readonly campaignService: CampaignService) {}

  @Get('list/available')
  @ApiOperation({ summary: 'available campaigns (startTime<=now<=endTime, sort by total votes DESC' })
  @ApiOkResponse({
    type: [CampaignDto],
  })
  async listAvailable(): Promise<CampaignDto[] | null> {
    return this.campaignService.listAvailable();
  }

  @Get('list/expired')
  @ApiOperation({ summary: 'expired campaigns (endTime<now, order by endTime, sort by endTime DESC)' })
  @ApiOkResponse({
    type: [CampaignDto],
  })
  async listExpired(): Promise<CampaignDto[] | null> {
    return this.campaignService.listExpired();
  }
}
