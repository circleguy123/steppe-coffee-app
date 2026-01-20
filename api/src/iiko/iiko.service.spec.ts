import { Test, TestingModule } from '@nestjs/testing';
import { IikoService } from './iiko.service';

describe('IikoService', () => {
  let service: IikoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IikoService],
    }).compile();

    service = module.get<IikoService>(IikoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
