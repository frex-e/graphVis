// TODO: Edges, Non-force layout, Draggable, Seperate View Links/Nodes and Model Links/Nodes
// Animation Queueing.

import * as d3 from 'd3';
import { Node,ViewNode } from './Node';
import { Link, ViewLink } from './Link'

import  { d3adaptor } from 'webcola'
import cola from 'webcola'

export type uuid = string | number;

export type MultiAdd = {
  nodes?: uuid[];
  links?: { source: uuid ; target: uuid }[];
};

export class Canvas {

  zoom : number = 0.9

  _tick : number = 1
  
  _svg : d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  _nodeSelection : d3.Selection<SVGGElement | d3.BaseType, ViewNode, d3.BaseType, unknown> | undefined;
  _linkSelection: d3.Selection<SVGGElement | d3.BaseType, ViewLink, d3.BaseType, unknown> | undefined;
  _nodes : Node[] = [];
  _links : Link[] = [];

  _viewNodes : ViewNode[] = [];
  _viewLinks : ViewLink[] = [];

  // _force : cola.Layout & cola.ID3StyleLayoutAdaptor;
  // _force: d3.Simulation<Node, Link>;
  _cola: cola.Layout & cola.ID3StyleLayoutAdaptor;

  constructor(elementSelector: string) {
    this._svg = d3.select(elementSelector).append('svg');

    this._svg.append("g").attr("class", "links");
    this._svg.append("g").attr("class", "nodes");

    this._cola = d3adaptor(d3)
      .linkDistance(15)
      .avoidOverlaps(true)
      .defaultNodeSize(6)

    // this.centreViewbox()
  }

  private update() {
    this.createViews()

    // Cola update node links
    this._cola.nodes(this._viewNodes).links(this._viewLinks).start(0,0,3);
    this._cola.on("tick", () => this.ticked())


    // Data join nodes
    this._nodeSelection = this._svg
      .select(".nodes")
      .selectAll(".node")
      .data(this._viewNodes)
      .join("g")
      .attr("class", "node")

      // .join("g")
      // .attr("class", "node")

    // Transform nodes


    // Shapes of nodes. Make rect slightly rounded
    this._nodeSelection.each((d,i,n) => {
      d3.select(n[i]).select('.main').remove()

      if (d.model.shape === 'circle') {
        d3.select(n[i]).append('circle').attr('class','main')
      } else if (d.model.shape === 'square') {
        d3.select(n[i]).append('rect')
          .attr('rx', 5)
          .attr('ry', 5)
          .attr('class','main')
      }
    })

    // Data join links
    this._linkSelection = this._svg
      .select(".links")
      .selectAll(".link")
      .data(this._viewLinks)
      .join("g")
      .attr("class", "link")

    this._linkSelection.select(".main").remove()
    this._linkSelection.append("line").attr("class","main")
  }

  private centreViewbox() {
    // Centre viewbox at (0,0) but don't change zoom level
    // const { x, y, width, height } = this._svg.node()?.getBBox() || {
    //   x: 0,
    //   y: 0,
    //   width: 0,
    //   height: 0,
    // }

    const svgWidth = this._svg.node()?.parentElement?.getBoundingClientRect().width || 0
    const svgHeight = this._svg.node()?.parentElement?.getBoundingClientRect().height || 0


    this._svg.attr('viewBox', `${-svgWidth/2} ${-svgHeight/2} ${svgWidth} ${svgHeight}`)
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
    // Sync Model and View objects
    this._viewNodes.forEach((v) => {
      v.model.x = v.x
      v.model.y = v.y
    })

  
    // All visual updates should be done here.

    // Nodes ---------------------------------------------------------------------
    // Position
    this._nodeSelection?.attr("transform", (d) => `translate(${d.x},${d.y})`)
    
    // Shape & Size
    this._nodeSelection?.select('circle.main').attr('r', (d) => d.model.size)
    this._nodeSelection?.select('rect.main').attr('width', (d) => d.model.size).attr('height', (d) => d.model.size/2)

    // Color
    this._nodeSelection?.select('.main').attr('fill', (d) => d.model.color)

    // White outline
    this._nodeSelection?.select('.main').attr('stroke', 'white')
    this._nodeSelection?.select('.main').attr('stroke-width', 0.5)

    // Links ---------------------------------------------------------------------
    // Position
    this._linkSelection?.select('line')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)

    // Color
    this._linkSelection?.select('line').attr('stroke', (d) => d.model.color)

    // // Fit viewbox
    this.fitViewbox()

    console.log(this._tick++)
  }

  createViews() {
    // Create view nodes
    this._viewNodes = this._nodes.map((n) => new ViewNode(n))

    // Create view links
    this._viewLinks = this._links.map((l) => new ViewLink(this._nodes.findIndex((x) => x == l.source),this._nodes.findIndex((x) => x == l.target),l))

    // console.log(this._viewNodes)
    // console.log(this._viewLinks)

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