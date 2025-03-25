<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"
import { io } from "socket.io-client"
import { useProfileStore } from "@/stores/profile.ts"
import Button from "@/components/Button.vue";

let socket
const messages = ref<HTMLDivElement | null>(null)
const messageBox = ref("")
const textareaRef = ref<HTMLTextAreaElement | null>(null)

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
  const trimmedMessage = messageBox.value.trim()
  if (trimmedMessage) {
    socket!.emit("message", trimmedMessage)
    appendMessage({author: "Me", content: trimmedMessage})
    messageBox.value = ''

    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  }
}

function handleKeydown(event: KeyboardEvent) {
  // Shift+Enter adds a new line
  if (event.shiftKey && event.key === 'Enter') {
    return
  }

  // Normal Enter sends the message and prevents default (new line)
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

function adjustTextareaHeight(event: Event) {
  const textarea = event.target as HTMLTextAreaElement

  textarea.style.height = 'auto'

  const maxHeight = 128
  textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
}
</script>

<template>
  <div class="flex flex-col p-2 bg-gray-300">
    <div ref="messages" class="overflow-y-scroll overflow-x-clip break-words break-all p-2">
    </div>
    <div class="mt-auto w-full flex items-center gap-2 min-h-fit bg-white rounded-2xl p-2 pl-1" v-if="profile.data">
      <textarea
          ref="textareaRef"
          type="text"
          v-model="messageBox"
          @input="adjustTextareaHeight"
          @keydown="handleKeydown"
          rows="1"
          class="grow appearance-none resize-none p-2 min-h-[2.5rem] h-fit max-h-32 border-none outline-0"
      />
      <Button
          class="h-fit"
          @click="sendMessage"
      >
        <span class="material-symbols-outlined">arrow_forward</span>
      </Button>
    </div>
    <div class="mt-auto w-full flex justify-center gap-2 bg-white rounded-lg p-2 text-center" v-else>
      Please sign in to chat
    </div>
  </div>
</template>

<style scoped>

</style>