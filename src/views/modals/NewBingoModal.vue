<script setup lang="ts">
import {ref} from "vue"
import Modal from "@/components/Modal.vue"
import Button from "@/components/Button.vue"
import axios from "axios"

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["close"])

const form = ref<HTMLFormElement | null>(null)
const bingoTitle = ref("")
const bingoPhrases = ref("")

const closeModal = () => {
  bingoTitle.value = ""
  bingoPhrases.value = ""

  emit("close")
}

const submit = () => {
  if(form.value){
    form.value.requestSubmit()
  }
}

const saveBingo = async () => {
  try {
    const response = await axios.post("/api/bingo", {
      title: bingoTitle.value,
      phrases: bingoPhrases.value.split("\n"),
    })
    console.log("Bingo saved successfully:", response.data)
    closeModal()
    window.location.href = `/bingo/${response.data}`
  } catch (error) {
    console.error("Error saving bingo:", error)
  }
}
</script>

<template>
  <Modal
      title="New Bingo"
      :visible="props.visible"
      @close="closeModal"
  >
    <form ref="form" class="flex flex-col gap-6" @submit.prevent="saveBingo">
      <div class="flex flex-col gap-2">
        <label for="title">Bingo Title <span class="text-red-500">*</span></label>
        <input
            id="title"
            type="text"
            v-model="bingoTitle"
            placeholder="Enter bingo title"
            maxlength="64"
            class="border rounded-md p-2 w-full"
            required
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="title">Bingo Phrases <span class="text-red-500">*</span></label>
        <textarea
            id="title"
            type="text"
            v-model="bingoPhrases"
            placeholder="Enter bingo phrases (1 per line)"
            class="border rounded-md p-2 w-full"
            required
        />
      </div>


    </form>

    <template v-slot:actions>
      <Button class="danger" @click="closeModal" type="button">Cancel</Button>
      <Button @click="submit">Save</Button>
    </template>
  </Modal>
</template>

<style scoped>
</style>