<script setup lang="ts">
import {onMounted} from "vue"
// @ts-ignore
import confetti from 'canvas-confetti'
onMounted(() => {
  confetti({
    particleCount: 100,
    spread: 360,
    origin: {
      x: 0.5,
      y: 0.5,
    },
    shapes: ["circle"]
  })
})
</script>

<template>
  <div class="fixed z-50 top-0 left-0 w-full h-full bg-black/75 flex justify-center items-center transition-all duration-500">
    <div class="text-6xl font-bold text-white animate-pulse">BINGO!!!</div>
  </div>
</template>

<style scoped>

</style>