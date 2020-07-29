import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimeService } from './showtime.service';

describe('ShowtimeService', () => {
  let service: ShowtimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowtimeService],
    }).compile();

    service = module.get<ShowtimeService>(ShowtimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
