import { Test, TestingModule } from '@nestjs/testing';
import { PrebookingController } from './prebooking.controller';

describe('Prebooking Controller', () => {
  let controller: PrebookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrebookingController],
    }).compile();

    controller = module.get<PrebookingController>(PrebookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
