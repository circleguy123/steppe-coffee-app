import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyResolver } from './loyalty.resolver';
import { LoyaltyService } from './loyalty.service';

describe('LoyaltyResolver', () => {
  let resolver: LoyaltyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoyaltyResolver, LoyaltyService],
    }).compile();

    resolver = module.get<LoyaltyResolver>(LoyaltyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
