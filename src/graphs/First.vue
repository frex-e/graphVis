<template>
  <div class="graph h-64" id="first"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as g from './utils/index'

let graph : g.Canvas | undefined;
onMounted(() => {
  graph = new g.Canvas('#first')

  graph.addNode("A")
  graph.addNode("B")
  graph.addLink("A", "B")

  // console.log(graph._nodes)
  // console.log(graph._links)

  graph.addNode("C")

  graph.createViews()
})
</script>