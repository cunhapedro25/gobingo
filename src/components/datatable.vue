<script setup lang="ts">
import {ref} from "vue"

defineProps({
  entries: {
    type: Array<String>,
    required: true
  }
})

const emit = defineEmits(["bingo"])

const state = ref(Array(25).fill(false))

function toggle(n: number) {
  state.value[n] = !state.value[n]
  if(state.value.every((x) => x === true)) {
    setTimeout(() => emit("bingo"), 50)
  }
}
</script>

<template>
  <div class="grid grid-cols-5 gap-2 m-2">
    <div
        v-for="(entry, index) in entries"
        class="p-2 border-2 border-solid border-black rounded-lg text-center text-lg size-48
                flex justify-center items-center select-none"
        :class="state[index] == true ? 'bg-black text-white border-yellow-500 border-4' : 'bg-white'"
        @click="toggle(index)"
    >{{entry}}</div>
  </div>
</template>

<style scoped>

</style>