import { Test, TestingModule } from '@nestjs/testing';
import { PrebookingService } from './prebooking.service';

describe('PrebookingService', () => {
  let service: PrebookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrebookingService],
    }).compile();

    service = module.get<PrebookingService>(PrebookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
