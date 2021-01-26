import { Test, TestingModule } from '@nestjs/testing';
import { TrailerController } from './trailer.controller';

describe('Trailer Controller', () => {
  let controller: TrailerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrailerController],
    }).compile();

    controller = module.get<TrailerController>(TrailerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
