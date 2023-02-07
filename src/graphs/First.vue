<template>
  <div class="graph h-64" id="first"></div>
</template>

<script setup lang="ts" >
import { onMounted } from 'vue';
import * as d3 from 'd3'
import { geoCircle } from 'd3';
import * as utils from './graphUtils'

let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>


const nodeData: utils.Node[] = [...Array(8).keys()].map((i) => {
  return {
    id: i,
    x: i * 50,
    y: 0
  }
})

const linkData: utils.Link[] = [...Array(7).keys()].map((i) => {
  return {
    source: i,
    target: i + 1
  }
})

onMounted(() => {
  // Init
  svg = d3
    .select("#first")
    .append("svg")

  let nodes = svg
    .append("g")
    .selectAll("nodes")
    .data(nodeData)
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)

  let edges = svg
    .append("g")
    .selectAll("edges")
    .data(linkData)
    .enter()
    .append('g')

  nodes.append('rect')
    .attr('width', 30)
    .attr('height', 30)
    .attr('rx', 5)
    .attr('x', -15)
    .attr('y', -15)
    .attr('fill', 'gray')

  nodes.append('text')
    .text((d) => d.id)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'white')

  utils.fitGraphViewbox(svg,0.9)

  // Layout

  // let simulation = d3.forceSimulation(nodeData)
  //   .force("charge", d3.forceManyBody().strength(-100))
  //   .force("link", d3.forceLink(linkData).distance(50))
  //   .force("center", d3.forceCenter(0, 0))
  //   .force("x", d3.forceX())
  //   .force("y", d3.forceY())
  //   .on("tick", ticked);

})
</script>