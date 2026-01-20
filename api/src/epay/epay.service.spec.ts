import { Test, TestingModule } from '@nestjs/testing';
import { EpayService } from './epay.service';

describe('EpayService', () => {
  let service: EpayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpayService],
    }).compile();

    service = module.get<EpayService>(EpayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
