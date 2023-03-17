import { Node } from './Node';
import * as d3 from 'd3';
import type { Canvas } from './Canvas';

export class Link implements d3.SimulationLinkDatum<Node> {
  source: Node;
  target: Node;

  color: string = 'gray';
  size: number = 10;
  label: string = ' '

  private animating: boolean = false;

  constructor(source: Node, target: Node) {
    this.source = source;
    this.target = target;
  }
}