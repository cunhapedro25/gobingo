<script setup lang="ts">

import {onMounted, type Ref, ref} from "vue"
import Datatable from "./components/datatable.vue"
import { domToPng } from 'modern-screenshot'

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

function bingo() {
  alert("BINGO!")
}

function downloadTable() {
  domToPng(document.getElementById("table") as Node).then(dataUrl => {
    const link = document.createElement('a')
    link.download = 'screenshot.png'
    link.href = dataUrl
    link.click()
  })
}
</script>

<template>
  <button @click="downloadTable">Download table</button>
  <Datatable id="table" v-if="data" :entries="data" @bingo="bingo" />
</template>

<style scoped>

</style>
