import { Module } from '@nestjs/common';
import { AdminCampaignController } from './admin-campaign.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './campaign.schema';
import { CampaignService } from './campaign.service';
import { VoteCount, VoteCountSchema } from './vote-count.schema';
import { CampaignController } from './campaign.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]),
    MongooseModule.forFeature([{ name: VoteCount.name, schema: VoteCountSchema }])
  ],
  controllers: [AdminCampaignController, CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
