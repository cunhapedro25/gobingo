<script setup lang="ts">
import {ref, onMounted} from "vue"

defineProps({
  entries: {
    type: Array<String>,
    required: true
  }
})

const emit = defineEmits(["bingo", "resetState"])
defineExpose({ resetState })

const state = ref(Array(25).fill(false))
const randomPositions = ref<{ left: number; top: number }[]>([])

onMounted(() => {
  generateRandomPositions() // Generate random positions on mount
})
function resetState() {
  state.value = Array(25).fill(false)
  generateRandomPositions()
}

function generateRandomPositions() {
  randomPositions.value = Array(25).fill(null).map(() => ({
    left: Math.random() * 6,
    top: Math.random() * 6,
  }))
}

function toggle(n: number) {
  state.value[n] = !state.value[n]
  if (checkBingo()) {
    setTimeout(() => emit("bingo"), 50)
  }
}

function checkBingo(): boolean {
  const gridSize = 5
  const grid = state.value

  for (let i = 0; i < gridSize; i++) {
    if (grid.slice(i * gridSize, (i + 1) * gridSize).every((x) => x)) {
      return true
    }
  }

  for (let i = 0; i < gridSize; i++) {
    if (grid.filter((_, index) => index % gridSize === i).every((x) => x)) {
      return true
    }
  }

  if (grid.filter((_, index) => index % (gridSize + 1) === 0).every((x) => x)) {
    return true
  }

  return !!grid
      .filter((_, index) => index % (gridSize - 1) === 0 && index !== 0 && index !== gridSize * gridSize - 1)
      .every((x) => x)
}
</script>

<template>
  <div class="max-h-11/12 aspect-square rounded-2xl bg-red-500 p-4 flex flex-col select-none">
    <div class="grid grid-cols-5 pb-2">
      <div
          v-for="letter in 'bingo'"
          :key="letter"
      >
        <p class="text-white text-[clamp(2rem,6vmin,4rem)] text-center capitalize">
          {{ letter }}
        </p>
      </div>
    </div>

    <div class="flex-1 min-h-0 grid grid-cols-5 grid-rows-5">
      <div
          v-for="(entry, index) in entries"
          :key="index"
          class="relative z-0 bg-white w-full h-full aspect-square border-2 border-solid border-black flex justify-center items-center p-1 text-center"
          @click="toggle(index)"
          :style="{
            fontSize: `clamp(8px, ${Math.max(2, 4 - (entry.length / 8))}vmin, 6rem)`,
            lineHeight: '1.1'
          }"
      >
        <div
            class="absolute w-11/12 bg-yellow-200/60 rounded-full aspect-square"
            :class="state[index] ? 'flex' : 'hidden'"
            :style="{
              left: `${randomPositions[index]?.left || 0}%`,
              top: `${randomPositions[index]?.top || 0}%`,
            }"
        >
        </div>

        <p>{{ entry }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>