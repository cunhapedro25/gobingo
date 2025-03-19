<script setup lang="ts">
import {onMounted, type Ref, ref} from "vue"
import { domToPng } from 'modern-screenshot'
import Bingo from "./components/bingo.vue"
import BingoCard from "./components/BingoCard.vue"

const data: Ref<String[] | null | undefined> = ref([])
const showBingo = ref(false)
const title = ref<String>("goBingo")
const originalPhrases = ref<String[]>([])
const bingoCardRef = ref<InstanceType<typeof BingoCard> | null>(null)

function shuffle(array: String[]) {
  let currentIndex = array.length

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }
}

async function loadData() {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const file = urlParams.get('file')

    const res = await fetch(`/data/${file}`)
    let phrases = (await res.text()).split("\n")
    title.value = phrases.shift() || "goBingo";
    document.title = title.value.toString();
    originalPhrases.value = [...phrases]

    shuffle(phrases)
    data.value = phrases.slice(0, 24)
    data.value.splice(12, 0, "Free")
  } catch (e) {
    data.value = null
  }
}

onMounted(async () => {
  await loadData()
})

function bingo() {
  showBingo.value = true
  setTimeout(() => {
    showBingo.value = false
  }, 2000)
}

function reshuffleData() {
  if (originalPhrases.value.length > 0) {
    const phrases = [...originalPhrases.value]
    shuffle(phrases)
    data.value = phrases.slice(0, 24)
    data.value.splice(12, 0, "Free")

    if (bingoCardRef.value) {
      bingoCardRef.value.resetState()
    }
  }
}

function copyTableToClipboard() {
  domToPng(document.getElementById("card") as Node).then(async dataUrl => {
    const blob = await (await fetch(dataUrl)).blob()
    const clipboardItem = new ClipboardItem({ [blob.type]: blob })
    await navigator.clipboard.write([clipboardItem])
    alert("Copied!")
  })
}

function copyLinkToClipboard() {
  navigator.clipboard.writeText(window.location.href)
  alert("Link copied!")
}
</script>

<template>
  <Bingo v-if="showBingo" />
  <div class="absolute top-0 right-0 flex justify-center gap-2 p-2">
    <button
        class="flex justify-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
        @click="reshuffleData"
    >
      <span class="material-symbols-outlined">autorenew</span>
    </button>
    <button
        class="flex justify-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
        @click="copyLinkToClipboard"
    >
      <span class="material-symbols-outlined">share</span>
    </button>
    <button
        class="flex justify-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
        @click="copyTableToClipboard"
    >
      <span class="material-symbols-outlined">image</span>
    </button>
  </div>

  <div class="w-screen h-screen flex justify-center items-center py-6 overflow-hidden">
    <div id="card" class="h-full flex flex-col justify-center items-center gap-2 p-2">
      <div class="bg-white rounded-2xl p-2 text-center">
        <h1 class="text-6xl">{{ title }}</h1>
      </div>

      <BingoCard
          v-if="data"
          :entries="data"
          @bingo="bingo"
          ref="bingoCardRef"
      />
    </div>
  </div>
</template>

<style scoped>

</style>