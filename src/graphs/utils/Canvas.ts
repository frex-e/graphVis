// TODO: Edges, Non-force layout, Draggable, Seperate View Links/Nodes and Model Links/Nodes

import * as d3 from 'd3';
import { Node } from './Node';
import { Link} from './Link'

import  { d3adaptor } from 'webcola'
import cola from 'webcola'
import { SourceNode } from 'source-map-js/lib/source-node';

export type uuid = string | number;

export type MultiAdd = {
  nodes?: uuid[];
  links?: { source: uuid ; target: uuid }[];
};

export class Canvas {

  zoom : number = 0.9

  _tick : number = 1
  
  _svg : d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  _nodeSelection : d3.Selection<SVGGElement | d3.BaseType, Node, SVGSVGElement, unknown> | undefined;
  _linkSelection: d3.Selection<SVGGElement | d3.BaseType, Link, SVGSVGElement, unknown> | undefined;
  _nodes : Node[] = [];
  // _force : cola.Layout & cola.ID3StyleLayoutAdaptor;
  _force: d3.Simulation<Node, Link>;
  _cola: cola.Layout & cola.ID3StyleLayoutAdaptor;
  _links : Link[] = [];

  constructor(elementSelector: string) {
    this._svg = d3.select(elementSelector).append('svg');

    // this._force = cola.d3adaptor(d3).linkDistance(10).avoidOverlaps(true).size([1000,1000])

    this._force = d3.forceSimulation<Node, Link>(this._nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(0, 0))
      .force('link', d3.forceLink(this._links))

    this._cola = d3adaptor(d3)
      .linkDistance(30)
      .avoidOverlaps(true)

    this._cola.on('tick', () => this.ticked())
  }

  private update() {
    // this.updateLinks()
    this._cola.nodes(this._nodes)
    this._cola.links(this._links)
    this._cola.start()

    console.log("Update!")

    // Nodes
    this._nodeSelection = this._svg
      .selectAll('g.node')
      .data(this._nodes)
      .join('g')
      .attr('class', 'node')

    // Links Temporary gotta figure out animating lines
    this._linkSelection = this._svg
      .selectAll('g.link')
      .data(this._links)
      .join('g')
      .attr('class', 'link')
    this._linkSelection.append('line')

    /////

    this._nodeSelection.attr('transform', (d) => `translate(${d.x},${d.y})`)
    
    this._nodeSelection.each((d,i,n) => {
      if (d.shape === 'circle') {
        d3.select(n[i]).append('circle')
          .attr('class', 'main')
      } else {
        d3.select(n[i]).append('rect')
          .attr('class', 'main')
      }
    })
  }

  private fitViewbox() {
    const { x, y, width, height } = this._svg.node()?.getBBox() || {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }

    const svgWidth = this._svg.node()?.parentElement?.getBoundingClientRect().width || 0
    const svgHeight = this._svg.node()?.parentElement?.getBoundingClientRect().height || 0

    const ratio =  Math.max(width / svgWidth, height / svgHeight) / this.zoom

    const midX = x + width / 2
    const midY = y + height / 2

    this._svg.attr('viewBox', `${midX - svgWidth * ratio / 2} ${midY - svgHeight * ratio / 2} ${svgWidth * ratio} ${svgHeight * ratio}`)
    this._svg.attr('height',svgHeight)
    this._svg.attr('width',svgWidth)
  }

  private ticked() {
    // All visual updates should be done here.

    // Nodes ---------------------------------------------------------------------
    // Position
    this._nodeSelection?.attr('transform', (d) => `translate(${d.x},${d.y})`)
    
    // Shape & Size
    this._nodeSelection?.select('circle.main')
      .attr('r', (d) => d.size)
    this._nodeSelection?.select('rect.main')
      .attr('width', (d) => d.size / 2)
    
    // Color
    this._nodeSelection?.select('circle.main')
      .attr('fill', (d) => d.color)


    // Links ---------------------------------------------------------------------
    this._linkSelection?.select('line')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)

    // Color
    this._linkSelection?.select('line')
      .attr('stroke', (d) => d.color)



    this.fitViewbox()
    this._tick++
    console.log(this._tick)
  }

  // Multiadd
  multiAdd(data : MultiAdd) {
    data.nodes?.forEach((n) => {
      // Without calling addnode method
      let node = new Node(n,0,0)
      this._nodes.push(node)
    })

    data.links?.forEach((l) => {
      let sourceNode = this.node(l.source)
      let targetNode = this.node(l.target)

      if (sourceNode && targetNode) {
        let link = new Link(sourceNode,targetNode)
        this._links.push(link)
      }
    })

    this.update()
  }

  // Get Node
  node(id : uuid) : Node | undefined {
    return this._nodes.find((n) => n.id === id)
  }

  addNode(id : uuid,x : number = 0, y:number = 0): Node {
    let node = new Node(id,x,y)
    this._nodes.push(node)
    this.update()
    return node
  }

  addLink(source : uuid|Node, target : uuid|Node) : Link | undefined {
    let sourceNode : Node | undefined
    let targetNode : Node | undefined

    if (!(source instanceof Node)) {
      sourceNode = this.node(source)
    } else {
      sourceNode = source
    }

    if (!(target instanceof Node)) {
      targetNode = this.node(target)
    } else {
      targetNode = target
    }

    if (sourceNode && targetNode) {
      let link = new Link(sourceNode,targetNode)
      this._links.push(link)
      this.update()
      return link
    }
  }

}