<script setup lang="ts">
import {onMounted, ref} from "vue"
import Header from "@/components/Header.vue"
const fileList = ref<{ name: string; title: string }[]>([])

async function fetchFileList() {
  try {
    const res = await fetch("/data/list.txt")
    if (!res.ok) {
      console.error("Failed to fetch file list")
      return
    }

    const files = (await res.text()).split("\n").filter((file) => file.trim())
    fileList.value = await Promise.all(
        files.map(async (file) => {
          const fileRes = await fetch(`/data/${file}`)
          if (!fileRes.ok) throw new Error(`Failed to fetch file: ${file}`)
          const firstLine = (await fileRes.text()).split("\n")[0] || file
          return {name: file, title: firstLine}
        })
    );
  } catch (e) {
    console.error("Error fetching file list:", e)
  }
}

onMounted(async () => {
  await fetchFileList()
})
</script>

<template>
  <Header />

  <div class="w-screen h-screen flex justify-center items-center py-6 overflow-hidden">
    <a
        v-for="file in fileList"
        :key="file.name"
        class="flex justify-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
        :href="`/?file=${file.name}`"
    >
      {{ file.title }}
    </a>
  </div>
</template>

<style scoped>

</style>