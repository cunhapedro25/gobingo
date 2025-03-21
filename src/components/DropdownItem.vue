<script setup lang="ts">
import {useRouter} from "vue-router"

const props = defineProps({
  icon: {
    type: String,
    default: null
  },
  path: {
    type: String,
    default: null
  }
})

const router = useRouter()

const route = () => {
  if (props.path) {
    if (props.path) {
      if (props.path.startsWith('/api')) {
        window.location.href = props.path
      } else {
        router.push(props.path)
      }
    }
  }
}
</script>

<template>
  <button class="item" @click="route()" type="button">
    <span v-if="props.icon" class="material-symbols-rounded fill">{{props.icon}}</span>

    <slot></slot>
  </button>
</template>

<style scoped lang="postcss">
@reference "@/style.css";

</style>