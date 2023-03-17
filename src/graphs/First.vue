<template>
  <div class="graph h-64" id="first"></div>
  <button @click="addNode">Hi</button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as g from './utils/index'

let graph : g.Canvas | undefined;
onMounted(() => {
  console.log("aa")

  graph = new g.Canvas('#first')

})

let count = 0

const addNode = () => {
  graph?.multiAdd({
    nodes: [count,count+1,count+2],
    links: [
      { source: count, target: count+1 },
      { source: count+1, target: count+2}
    ]
  })

  count += 3

  if (count >= 10) {
    graph?.multiAdd({
      links: [
        { source: count - 4, target: count -  -8}
      ]
    })
  }
}
</script>