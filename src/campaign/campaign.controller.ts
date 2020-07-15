import { Body, Controller, Get, Post, Query, UnprocessableEntityException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { CampaignDto } from './dto/campaign.dto';
import { CampaignService } from './campaign.service';
import { VoteCountDto } from './dto/vote-count.dto';
import { VoteDto } from './dto/vote.dto';
import { privacyHash, validateHKID } from '../core/math';
import { Vote } from './schema/vote.schema';

const INVALID_HK_ID = 'Invalid HK ID';
const INVALID_CAMPAIGN = 'Campaign not existed or expired';
const INVALID_CANDIDATE = 'Wrong candidate';

@ApiTags('Campaign')
@Controller('/api/v1/campaign')
export class CampaignController {

  constructor(private readonly campaignService: CampaignService) {}

  @ApiOperation({ summary: 'available campaigns (startTime<=now<=endTime, sort by total votes DESC)' })
  @ApiOkResponse({ type: [CampaignDto] })
  @Get('list/available')
  async listAvailable(): Promise<CampaignDto[] | null> {
    return this.campaignService.listAvailable();
  }

  @ApiOperation({ summary: 'expired campaigns (endTime<now, order by endTime, sort by endTime DESC)' })
  @ApiOkResponse({ type: [CampaignDto] })
  @Get('list/expired')
  async listExpired(): Promise<CampaignDto[] | null> {
    return this.campaignService.listExpired();
  }

  @ApiOperation({ summary: 'vote counting of candidates' })
  @ApiOkResponse({ type: [VoteCountDto] })
  @Post('count')
  async count(@Body() candidateIds: string[]): Promise<VoteCountDto[]> {
    return this.campaignService.getVoteCount(candidateIds);
  }

  @ApiOperation({ summary: 'list votes by HK ID' })
  @ApiUnprocessableEntityResponse({ description: INVALID_HK_ID })
  @Get('/list-vote')
  async listVote(@Query('hkId') hkId: string): Promise<VoteDto[]> {
    //validate HK ID
    if (!validateHKID(hkId)) {
      throw new UnprocessableEntityException(INVALID_HK_ID);
    }
    return this.campaignService.listVote(privacyHash(hkId.toUpperCase()));
  }

  @ApiOperation({
    summary: 'Vote a candidate',
    description: 'ONE HK ID can only vote ONE candidate for each campaign, duplicated votes will be ignored'
  })
  @ApiUnprocessableEntityResponse({ description: `${INVALID_HK_ID}<br/>${INVALID_CAMPAIGN}<br/>${INVALID_CANDIDATE}` })
  @Post('vote')
  async vote(@Body() voteDto: VoteDto) {

    //validate HK ID
    if (!validateHKID(voteDto.hkId)) {
      throw new UnprocessableEntityException(INVALID_HK_ID);
    }

    //check campaign existed and available
    const campaign = await this.campaignService.findOne(voteDto.campaignId);
    if (!campaign?.isAvailable()) {
      throw new UnprocessableEntityException(INVALID_CAMPAIGN);
    }

    //check campaign owns the candidate
    const foundCandidate = campaign.candidates.some(v => {
      return v.id == voteDto.candidateId;
    });
    if (!foundCandidate) {
      throw new UnprocessableEntityException(INVALID_CANDIDATE);
    }

    const inserted = await this.campaignService.createVote(VoteDto.hashed(voteDto));
    //inc vote count if voting succeed
    if (inserted != null) {
      await this.campaignService.incVoteCount(inserted.candidateId);
    }
  }

}
