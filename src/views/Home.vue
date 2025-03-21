<script setup lang="ts">
import {onMounted, ref} from "vue"
import Header from "@/components/Header.vue"
import type {Bingo} from "@/models/Bingo.ts"
import axios from "axios"

const bingos = ref<Bingo[]>([])

async function fetchBingoList() {
  try {
    bingos.value = (await axios.get("/api/bingo")).data
  } catch (e) {
    console.error("Error fetching bingo list:", e)
  }
}

onMounted(async () => {
  await fetchBingoList()
})
</script>

<template>
  <Header />

  <div class="w-screen h-screen flex justify-center items-center py-6 overflow-hidden">
    <a
        v-for="bingo in bingos"
        :key="bingo.title"
        class="flex justify-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
        :href="`/bingo/${bingo._id}`"
    >
      {{ bingo.title }}
    </a>
  </div>
</template>

<style scoped>

</style>