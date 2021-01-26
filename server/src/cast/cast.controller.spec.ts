import { Test, TestingModule } from '@nestjs/testing';
import { CastController } from './cast.controller';

describe('Cast Controller', () => {
  let controller: CastController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CastController],
    }).compile();

    controller = module.get<CastController>(CastController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
