import { Module } from '@nestjs/common';
import { AdminCampaignController } from './admin-campaign.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './schema/campaign.schema';
import { CampaignService } from './campaign.service';
import { VoteCount, VoteCountSchema } from './schema/vote-count.schema';
import { CampaignController } from './campaign.controller';
import { Vote, VoteSchema } from './schema/vote.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]),
    MongooseModule.forFeature([{ name: VoteCount.name, schema: VoteCountSchema }]),
    MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }])
  ],
  controllers: [AdminCampaignController, CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
