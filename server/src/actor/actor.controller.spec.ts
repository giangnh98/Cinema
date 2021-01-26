import { Test, TestingModule } from '@nestjs/testing';
import { ActorController } from './actor.controller';

describe('Actor Controller', () => {
  let controller: ActorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActorController],
    }).compile();

    controller = module.get<ActorController>(ActorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
