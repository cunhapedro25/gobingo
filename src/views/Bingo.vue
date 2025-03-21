<script setup lang="ts">
import {onMounted, ref} from "vue"
import {domToPng} from 'modern-screenshot'
import BingoCard from "@/components/BingoCard.vue"
import BingoCelebration from "@/components/BingoCelebration.vue"
import axios from "axios"
import {useRoute} from "vue-router"
import Header from "@/components/Header.vue";

const showBingo = ref(false)
const bingoCardRef = ref<InstanceType<typeof BingoCard> | null>(null)

const bingo = ref<Bingo | null | undefined>(undefined)
const shuffledPhrases = ref<String[]>([])

const route = useRoute()

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
    bingo.value = (await axios.get(`/api/bingo/${route.params.id}`)).data
    reshuffleData()
  } catch (e) {
    bingo.value = null
  }
}

onMounted(async () => {
  await loadData()
})

function showBingoScreen() {
  showBingo.value = true
  setTimeout(() => {
    showBingo.value = false
  }, 2000)
}

function reshuffleData() {
  if (bingo.value.phrases.length > 0) {
    const phrases = [...bingo.value.phrases]
    shuffle(phrases)
    shuffledPhrases.value = phrases.slice(0, 24)
    shuffledPhrases.value.splice(12, 0, "Free")

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
  <Header/>

  <BingoCelebration v-if="showBingo" />

  <div class="w-screen h-screen flex justify-center items-center py-6 overflow-hidden">
    <div id="card" class="h-full flex flex-col justify-center items-center gap-2 p-2">
      <div class="bg-white rounded-2xl p-2 text-center">
        <h1 class="text-6xl">{{ bingo?.title }}</h1>
      </div>

      <BingoCard
          v-if="shuffledPhrases"
          :entries="shuffledPhrases"
          @bingo="showBingoScreen"
          ref="bingoCardRef"
      />
    </div>
  </div>

  <div v-if="bingo" class="absolute bottom-0 right-0 flex justify-center gap-2 p-2">
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
</template>

<style scoped>

</style>