<script setup lang="ts">
import {defineProps, defineEmits} from 'vue'
import Button from "@/components/Button.vue"

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String
  }
})

const emit = defineEmits()

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div v-if="props.visible" class="modal" @click="closeModal">
    <div class="content" @click.stop>
      <div class="w-full flex items-center"
           :class="[ props.title ? 'justify-between gap-6' : 'justify-end']">
        <h1 class="text-3xl">{{props.title}}</h1>

        <Button class="danger" icon="close" @click="closeModal"></Button>
      </div>

      <div class="slot">
        <slot></slot>
      </div>

      <div v-if="$slots.actions" class="flex justify-end w-full p-2 gap-2">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>


<style scoped lang="postcss">
@reference "@/style.css";

</style>