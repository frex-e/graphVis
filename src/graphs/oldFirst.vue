<!-- <script setup lang="ts" >
import { onMounted } from 'vue';
import * as d3 from 'd3'
import { geoCircle } from 'd3';

let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>


const nodeData: utils.Node[] = [...Array(8).keys()].map((i) => {
  return {
    id: i,
    x: i * 50,
    y: 0
  }
})

const rawLinkData: utils.RawLink[] = [...Array(7).keys()].map((i) => {
  return {
    source: i,
    target: i + 1
  }
})

const linkData: utils.Link[] = rawLinkData.map((d) => {
  return {
    source: nodeData[d.source],
    target: nodeData[d.target],
    animating: false
  }
})

onMounted(() => {
  // Init
  svg = d3
    .select("#first")
    .append("svg")

  let edges = svg
    .append("g")
    .selectAll("edges")
    .data(linkData)
    .enter()
    .append('g')

  let nodes = svg
    .append("g")
    .selectAll("nodes")
    .data(nodeData)
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)



  nodes.append('rect')
    .attr('width', 30)
    .attr('height', 30)
    .attr('rx', 5)
    .attr('x', -15)
    .attr('y', -15)
    .attr('fill', 'gray')

  edges.append('line')
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y)
    .attr('stroke', 'black')

    d3.forceSimulation(nodeData)
      .force("charge", d3.forceManyBody().strength(-100))
      .force("link", d3.forceLink(linkData).distance(50))
  
  
  // Layout

  let simulation = d3.forceSimulation(nodeData)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink(linkData).distance(50))
    .force("center", d3.forceCenter(0, 0))
    .on("tick", () => {
      nodes.attr('transform', (d) => `translate(${d.x},${d.y})`)

      edges.select('line')
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

      utils.fitGraphViewbox(svg,0.9)
    })
  //   .force("x", d3.forceX())
  //   .force("y", d3.forceY())
  //   .on("tick", ticked);

})
</script> -->