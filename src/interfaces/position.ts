export type Direction = 'N' | 'W' | 'S' | 'E';

export interface Coordinates {
  x: number;
  y: number;
}

export interface Position extends Coordinates {
  direction: Direction;
}
