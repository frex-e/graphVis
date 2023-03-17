import * as d3 from 'd3';
import { Link } from './Link';
import { Canvas, uuid } from './Canvas';

export type Shape = 'circle' | 'square';

export class Node implements d3.SimulationNodeDatum {
  id: uuid;
  x: number = 0;
  y: number = 0;

  vx: number = 10;
  vy: number = 10;
  shape: Shape = 'circle';
  size = 5;
  color: string = 'gray';

  links : Link[] = [];

  constructor(id: uuid, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;

    return this
  }

  setPos([x,y]: [number, number]) {
    this.x = x;
    this.y = y;

    return this
  }

  setPosXY(x: number, y: number) {
    this.x = x;
    this.y = y;

    return this
  }

}