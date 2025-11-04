import { Injectable } from '@nestjs/common';
import { Position, Coordinates, Direction } from './interfaces/position';

@Injectable()
export class ConsoleService {
  bounds: Coordinates = {
    x: 50,
    y: 50,
  };

  position: Position = {
    x: 0,
    y: 0,
    direction: 'N',
  };

  forbiddenCoordinates: Coordinates[] = [];

  directions = ['N', 'E', 'S', 'W'];

  parseCoordinates(strCoordinates: string[]) {
    const x = parseInt(strCoordinates[0]);
    const y = parseInt(strCoordinates[1]);
    if (isNaN(x) || x > 50 || isNaN(y) || y > 50) {
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
    this.bounds = coordinates;
    return true;
  }

  processPosition(input: string) {
    const position = input.split(' ');
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
    const commands = input.split('');
    const possibleInstructions = ['L', 'R', 'F'];
    const isInvalid = commands.some((x) => !possibleInstructions.includes(x));
    if (isInvalid) {
      return false;
    }
    const directions = this.directions;
    for (const command of commands) {
      const currectDirection = this.position.direction;
      const index = directions.findIndex((x) => x == currectDirection);
      switch (command) {
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
        case 'F': {
          const previousPosition = { ...this.position };
          this.move();
          if (this.isLost()) {
            this.position = { ...previousPosition };
            return this.getPositionString('LOST');
          }
          break;
        }
      }
    }

    return this.getPositionString();
  }

  isLost() {
    const { x, y } = this.position;
    const { x: xMax, y: yMax } = this.bounds;
    if (x < 0 || x > xMax || y < 0 || y > yMax) {
      this.forbiddenCoordinates.push({ x, y });
      return true;
    }
    return false;
  }

  getPositionString(append: string = '') {
    const { x, y, direction } = this.position;
    const positionStr = `${x} ${y} ${direction}`;
    if (append) {
      return `${positionStr} ${append}`;
    }
    return positionStr;
  }

  move() {
    let { x, y } = this.position;
    const direction = this.position.direction;
    switch (direction) {
      case 'N':
        y += 1;
        break;
      case 'S':
        y -= 1;
        break;
      case 'E':
        x += 1;
        break;
      case 'W':
        x -= 1;
        break;
    }

    const isForbidden = this.forbiddenCoordinates.find(
      (cord) => cord.x == x && cord.y == y,
    );
    if (!isForbidden) {
      this.position = { x, y, direction };
    }
  }
}
