import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CampaignDto } from './dto/campaign.dto';
import { CampaignService } from './campaign.service';
import { VoteCountDto } from './dto/vote-count.dto';
import { VoteDto } from './dto/vote.dto';

@ApiTags('Campaign')
@Controller('/api/v1/campaign')
export class CampaignController {

  constructor(private readonly campaignService: CampaignService) {}

  @ApiOperation({ summary: 'available campaigns (startTime<=now<=endTime, sort by total votes DESC)' })
  @ApiOkResponse({
    type: [CampaignDto],
  })
  @Get('list/available')
  async listAvailable(): Promise<CampaignDto[] | null> {
    return this.campaignService.listAvailable();
  }

  @ApiOperation({ summary: 'expired campaigns (endTime<now, order by endTime, sort by endTime DESC)' })
  @ApiOkResponse({
    type: [CampaignDto],
  })
  @Get('list/expired')
  async listExpired(): Promise<CampaignDto[] | null> {
    return this.campaignService.listExpired();
  }

  @ApiOperation({ summary: 'vote counting of candidates' })
  @ApiOkResponse({
    type: [CampaignDto],
  })
  @Get('count')
  async count(@Body() candidateIds: string[]): Promise<VoteCountDto[] | null> {
    return this.campaignService.getVoteCount(candidateIds);
  }

  @ApiOperation({
    summary: 'Vote a candidate',
    description: 'ONE HK ID can only vote ONE candidate for each campaign, duplicated votes will be ignored'
  })
  @Post('vote')
  async vote(@Body() voteDto: VoteDto) {
    const inserted = await this.campaignService.createVote(voteDto);
    if (inserted != null) {
      await this.campaignService.incVoteCount(inserted.candidateId);
    }
  }

}
