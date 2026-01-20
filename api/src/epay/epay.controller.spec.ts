import { Test, TestingModule } from '@nestjs/testing';
import { EpayController } from './epay.controller';

describe('EpayController', () => {
  let controller: EpayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpayController],
    }).compile();

    controller = module.get<EpayController>(EpayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
