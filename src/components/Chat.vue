<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col p-2 bg-gray-300">
    <div ref="messages" class="overflow-scroll p-2">

    </div>
    <div class="mt-auto w-full flex gap-2">
      <input type="text" class="grow bg-white rounded-2xl">
      <button
          class="flex justify-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
      >
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>