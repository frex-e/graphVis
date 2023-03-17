import * as d3 from 'd3';
import { Link } from './Link';
import { Canvas, uuid } from './Canvas';
import * as cola from 'webcola'

export type Shape = 'circle' | 'square';

export class ViewNode implements cola.Node, d3.SimulationNodeDatum {
    x: number;
    y: number ;
    vx: number | undefined;
    vy: number | undefined;
    fx: number | null | undefined;
    fy: number | null | undefined;

    model : Node

    constructor(model: Node) {
      this.model = model
      this.x = model.x
      this.y = model.y
      this.vx = model.vx
      this.vy = model.vy
      this.fx = model.fx
      this.fy = model.fy
    }
}

export class Node implements d3.SimulationNodeDatum,cola.Node {
  id: uuid;
  x: number = 0;
  y: number = 0;
  vx: number = 10;
  vy: number = 10;
  fx: number | null | undefined;
  fy: number | null | undefined;

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
}