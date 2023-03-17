<template>
  <div class="graph h-64" id="first"></div>
  <button @click="addNode">Hi</button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as g from './utils/index'

let graph : g.Canvas | undefined;

onMounted(() => {
  graph = new g.Canvas('#first')

  // graph?.addNode("a")
  // graph?.addNode("b")
  // graph?.addNode("c")
  // graph?.addLink("a","c")
})

let count = 0;
const addNode = () => {
  graph?.addNode(count)
  if(count >= 1) {
    graph?.addLink(Math.floor(Math.random() * count),count)
  }
  count++;
}
</script>