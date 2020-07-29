import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimeController } from './showtime.controller';

describe('Showtime Controller', () => {
  let controller: ShowtimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimeController],
    }).compile();

    controller = module.get<ShowtimeController>(ShowtimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
