<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getServerSummary, sendMessage, ServerSummaryResponse } from './services/api'
import Tumbleweed from './components/Tumbleweed.vue'
import loader from './assets/loader.svg'
import clear from './assets/clear.svg'
import { speakNewPeople } from './services/speaker'

const serverSummary = ref<ServerSummaryResponse | null>(null)
const VIEWERS_CHANNEL_NAME = '_viewers'

const onNewData = (previous: ServerSummaryResponse, current: ServerSummaryResponse) => {
  if (isSoundEnabled.value) speakNewPeople(previous, current)
}

const isSoundEnabled = ref(false)

const viewerName = ref<string>(localStorage.getItem('viewerName') ?? '')
;(async () => {
  while (true) {
    await getServerSummary(viewerName.value).then((data) => {
      onNewData(serverSummary.value ?? {}, data)
      serverSummary.value = data
    })
    await new Promise((res) => setInterval(res, 2000))
  }
})()

const isServerEmpty = computed(
  () => Object.values(serverSummary.value ?? {}).reduce((acc, cur) => acc + cur.length, 0) === 0,
)

const composeMessage = (channel: string) => {
  const message = window.prompt(`Send message to ${channel}`, '')
  if (message) sendMessage({ channel, message })
}

watch(viewerName, () => {
  localStorage.setItem('viewerName', viewerName.value)
})
</script>

<template>
  <button class="absolute top-0 left-0 mt-8 ml-8 text-6xl" @click="isSoundEnabled = !isSoundEnabled">
    {{ isSoundEnabled ? '🔊' : '🔇' }}
  </button>
  <div class="h-screen w-screen flex flex-col items-center justify-center pb-[20vh]">
    <div class="flex flex-col items-center">
      <label for="viewer-name">Viewer name</label>
      <div class="border rounded-full relative">
        <button @click="() => (viewerName = '')" class="absolute top-[-3px] right-[-3px]">
          <img :src="clear" class="scale-90" />
        </button>
        <input type="text" name="viewer-name" class="px-2 rounded-full outline-none" v-model="viewerName" />
      </div>
    </div>

    <div v-if="!serverSummary" class="w-24 h-24">
      <img :src="loader" alt="Loader" class="w-full h-full" />
    </div>
    <ul v-else class="mt-6">
      <div v-if="isServerEmpty">
        <Tumbleweed />
      </div>
      <template v-else>
        <ul v-if="serverSummary[VIEWERS_CHANNEL_NAME] && serverSummary[VIEWERS_CHANNEL_NAME]" class="mb-6">
          <li v-for="user of serverSummary[VIEWERS_CHANNEL_NAME]">👀 {{ user }}</li>
        </ul>
        <template v-for="(users, channel) of serverSummary">
          <li v-if="users.length > 0 && channel !== VIEWERS_CHANNEL_NAME" class="mt-3">
            <span class="font-bold"><button @click="() => composeMessage(channel)">💬</button> {{ channel }}</span>
            <ul>
              <li v-for="user of users">🔵 {{ user }}</li>
            </ul>
          </li>
        </template>
      </template>
    </ul>
  </div>
</template>
