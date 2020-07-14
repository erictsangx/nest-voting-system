import { Test, TestingModule } from '@nestjs/testing';
import { AdminCampaignController } from './admin-campaign.controller';

describe('AdminCampaign Controller', () => {
  let controller: AdminCampaignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminCampaignController],
    }).compile();

    controller = module.get<AdminCampaignController>(AdminCampaignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
