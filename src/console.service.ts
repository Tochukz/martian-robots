import { Injectable } from '@nestjs/common';
import { Position, Coordinates, Direction } from './interfaces/position';

@Injectable()
export class ConsoleService {
  coordinates: Coordinates = {
    x: 0,
    y: 0,
  };

  position: Position = {
    x: 0,
    y: 0,
    direction: 'N',
  };

  directions = ['N', 'E', 'S', 'W'];

  parseCoordinates(strCoordinates: string[]) {
    const x = parseInt(strCoordinates[0]);
    const y = parseInt(strCoordinates[1]);
    if (isNaN(x) || x > 50) {
      return false;
    } else if (isNaN(y) || y > 50) {
      return false;
    }

    return { x, y };
  }

  setBounds(input: string) {
    const strCoordinates: string[] = input.split(' ');
    if (strCoordinates.length !== 2) {
      return false;
    }

    const coordinates = this.parseCoordinates(strCoordinates);
    if (!coordinates) {
      return false;
    }
    this.coordinates = coordinates;
    console.log(coordinates);
    return true;
  }

  processPosition(input: string) {
    const position = input.split(' ');
    console.log('position', position);
    if (position.length != 3) {
      return false;
    }
    const direction = position[2] as Direction;
    if (!this.directions.includes(direction)) {
      return false;
    }
    const coordinates = this.parseCoordinates(position);
    if (!coordinates) {
      return false;
    }
    this.position = { ...coordinates, direction };
    return true;
  }

  processInstructions(input: string) {
    const instructions = input.split('');
    const possibleInstructions = ['L', 'R', 'F'];
    const isInvalid = instructions.some(
      (x) => !possibleInstructions.includes(x),
    );
    if (isInvalid) {
      return false;
    }
    const directions = this.directions;
    for (const instruction of instructions) {
      const currectDirection = this.position.direction;
      const index = directions.findIndex((x) => x == currectDirection);
      switch (instruction) {
        case 'L': {
          const direction = directions.at(index - 1);
          this.position.direction = direction as Direction;
          break;
        }
        case 'R': {
          const direction =
            index == 3 ? directions.at(0) : directions.at(index + 1);
          this.position.direction = direction as Direction;
          break;
        }
        case 'F':
          this.move(currectDirection);
          break;
      }
    }

    return this.getPositionString();
  }

  getPositionString() {
    const { x, y, direction } = this.position;
    const { x: xMax, y: yMax } = this.coordinates;
    const positionStr = `${x} ${y} ${direction}`;
    if (x < 0 || x > xMax || y < 0 || y > yMax) {
      return `${positionStr} LOST`;
    }
    return positionStr;
  }

  move(direction: Direction) {
    switch (direction) {
      case 'N':
        this.position.y += 1;
        break;
      case 'S':
        this.position.y -= 1;
        break;
      case 'E':
        this.position.x += 1;
        break;
      case 'W':
        this.position.x -= 1;
        break;
    }
  }
}
