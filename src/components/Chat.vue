<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue"
import {io} from "socket.io-client"
import {useProfileStore} from "@/stores/profile.ts"

let socket
const messages = ref<HTMLDivElement | null>(null)
const messageBox = ref("")

const profile = useProfileStore()

const props = defineProps({
  bingoId: String
})

interface Message {
  author: string,
  content: string
}

onMounted(() => {
  socket = io("/")
  socket.emit("joinChat", props.bingoId)
  socket.on("newMessage", (message: Message) => {
    appendMessage(message)
  })
})

onBeforeUnmount(() => {
  socket!.disconnect()
})

function appendMessage(message: Message) {
  if(messages.value) {
    const messageElement = document.createElement('p')
    messageElement.innerHTML = `<b>${message.author}</b>: ${message.content}`

    messages.value.appendChild(messageElement)
  }
}

function sendMessage() {
  socket!.emit("message", messageBox.value)
  appendMessage({author: "Me", content: messageBox.value})
  messageBox.value = ''
}
</script>

<template>
  <div class="flex flex-col p-2 bg-gray-300">
    <div ref="messages" class="overflow-y-scroll overflow-x-clip break-words break-all p-2">

    </div>
    <div class="mt-auto w-full flex gap-2" v-if="profile.data">
      <input type="text" v-model="messageBox" class="grow bg-white rounded-2xl p-2">
      <button
          class="flex justify-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
          @click="sendMessage"
      >
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
    <div class="mt-auto w-full flex justify-center gap-2 bg-white rounded-lg p-2 text-center" v-else>
      Please sign in to chat
    </div>
  </div>
</template>

<style scoped>

</style>