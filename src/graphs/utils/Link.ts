import { Node, ViewNode} from './Node';
import * as d3 from 'd3';
import type { Canvas } from './Canvas';
import * as cola from 'webcola';

export class ViewLink implements cola.Link<ViewNode | number>{
  source: number | ViewNode;
  target: number | ViewNode;

  model : Link;

  constructor(source: number, target: number, model: Link) {
    this.source = source;
    this.target = target;
    this.model = model
  }
}

export class Link implements cola.Link<Node>,d3.SimulationLinkDatum<Node> {
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