<script setup lang="ts">

import {onMounted, type Ref, ref} from "vue"
import Datatable from "./components/datatable.vue"

const data: Ref<String[] | null | undefined> = ref([])

function shuffle(array: String[]) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const file = urlParams.get('file')

    const res = await fetch(`/data/${file}`)
    let phrases = (await res.text()).split("\n")
    shuffle(phrases)

    data.value = phrases.slice(0, 24)
    data.value.splice(12, 0, "Free")
  } catch (e) {
    data.value = null
  }
})
</script>

<template>


  <Datatable v-if="data" :entries="data" />
</template>

<style scoped>

</style>
