import { Test, TestingModule } from '@nestjs/testing';
import { UserOrdersResolver } from './user-orders.resolver';
import { UserOrdersService } from './user-orders.service';

describe('UserOrdersResolver', () => {
  let resolver: UserOrdersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserOrdersResolver, UserOrdersService],
    }).compile();

    resolver = module.get<UserOrdersResolver>(UserOrdersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
