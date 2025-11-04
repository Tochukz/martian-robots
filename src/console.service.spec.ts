import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleService } from './console.service';

describe('S3Service', () => {
  let service: ConsoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsoleService],
    }).compile();

    service = module.get<ConsoleService>(ConsoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseCoordinates', () => {
    it('should return the x, y coordinates from an input', () => {
      const x = '30';
      const y = '45';
      const result = service.parseCoordinates([x, y]);
      const { x: xCoord, y: yCoord } = result ?? {};
      expect(typeof result).toBe('object');
      expect(xCoord).toBe(parseInt(x));
      expect(yCoord).toBe(parseInt(y));
    });

    it('it should return false for invalid input - letter in input', () => {
      const result = service.parseCoordinates(['5', 'A']);
      expect(result).toBe(false);
    });

    it('should return false for invalid input - high number in input', () => {
      const result = service.parseCoordinates(['55', '30']);
      expect(result).toBe(false);
    });
  });

  describe('setBounds', () => {
    it('should set coordinates for valid input', () => {
      const x = 40;
      const y = 50;
      const result = service.setBounds(`${x} ${y}`);
      expect(result).toBe(true);
      expect(service.bounds).toEqual({ x, y });
    });
    it('should return false for invalid input - less than 2 integer', () => {
      const result = service.setBounds('40');
      expect(result).toBe(false);
      expect(service.bounds).toEqual({ x: 50, y: 50 });
    });
    it('should return false for invalid input -  more than 2 integers', () => {
      const result = service.setBounds('40 50 81');
      expect(result).toBe(false);
      expect(service.bounds).toEqual({ x: 50, y: 50 });
    });
  });

  describe('processPosition', () => {
    it('should set the position for valid input', () => {
      const x = 40;
      const y = 35;
      const direction = 'E';
      const result = service.processPosition(`${x} ${y} ${direction}`);
      expect(result).toBe(true);
      expect(service.position.x).toBe(x);
      expect(service.position.y).toBe(y);
      expect(service.position.direction).toBe(direction);
    });

    it('should return false for invalid input - invalid cardinal direction', () => {
      const result = service.processPosition('30 40 X');
      expect(result).toBe(false);
      expect(service.position.x).toBe(0);
      expect(service.position.y).toBe(0);
      expect(service.position.direction).toBe('N');
    });

    it('should return false for invalid input - y coordinate greather than 50', () => {
      const result = service.processPosition('30 55 E');
      expect(result).toBe(false);
      expect(service.position.x).toBe(0);
      expect(service.position.y).toBe(0);
      expect(service.position.direction).toBe('N');
    });
  });

  describe('processInstructions', () => {
    it('move robot 6 steps from default position (0 0 N)', () => {
      const result = service.processInstructions('FFFFFF');
      expect(result).toBe('0 6 N');
    });
    it('move robot 5 step to the east and 3 steps to the north starting from position (5 5 E)', () => {
      service.processPosition('5 5 E');
      const result = service.processInstructions('FFFFFLFFF');
      expect(result).toBe('10 8 N');
    });
    it('Turn robot to the north, move 7 steps and turn to the east and move 5 steps starting from position (20 30 S)', () => {
      service.processPosition('20 30 S');
      const result = service.processInstructions('LLFFFFFFFRFFFFF');
      expect(result).toBe('25 37 E');
    });
    it('Move robot to the middle of space and pointing south starting from (13, 15 W)', () => {
      service.processPosition('13, 15 W');
      const result = service.processInstructions('RFFFFFFFFFFRFFFFFFFFFFFFR');
      expect(result).toBe('25 25 S');
    });
    it('Move Robot off bottom left edge start at default position 0 0 N', () => {
      const result = service.processInstructions('LF');
      expect(result).toBe('0 0 W LOST');
    });
    it('Move Robot off the bottom right edge starting at position (7, 7 N)', () => {
      service.setBounds('15 15');
      service.processPosition('7 7 N');
      const result = service.processInstructions('RFFFFFFFFFR');
      expect(result).toBe('15 7 E LOST');
    });
    it('Move Robot off the top right edge starting at position (5, 10 E)', () => {
      service.setBounds('15 15');
      service.processPosition('5 10 E');
      const result = service.processInstructions('LFFFFFF');
      expect(result).toBe('5 15 N LOST');
    });
  });

  describe('getPositionString', () => {
    it('should return default position as string', () => {
      const result = service.getPositionString();
      expect(result).toBe('0 0 N');
    });
    it('should return current position as string', () => {
      service.processPosition('15 20 E');
      const result = service.getPositionString();
      expect(result).toBe('15 20 E');
    });
  });

  describe('move', () => {
    it('should push robot y cordinate by 1', () => {
      service.move();
      expect(service.position.y).toBe(1);
    });
    it('should push robot x cordinate by 3', () => {
      service.processPosition('12 0 E');
      service.move();
      service.move();
      service.move();
      expect(service.position.x).toBe(15);
    });
    it('should ignore move to forbidden coordinates -1 0', () => {
      service.processInstructions('LF');
      service.processPosition('0 0 W');
      service.move();
      service.move();
      service.move();
      expect(service.position.x).toBe(0);
      expect(service.position.y).toBe(0);
      expect(service.position.direction).toBe('W');
    });
  });
});
