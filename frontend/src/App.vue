<script setup lang="ts">
import { computed, ref } from 'vue'
import { getServerSummary, ServerSummaryResponse } from './services/api'
import Tumbleweed from './components/Tumbleweed.vue'
import loader from './assets/loader.svg'

const serverSummary = ref<ServerSummaryResponse | null>(null)

const speakNewPeople = (previous: ServerSummaryResponse, current: ServerSummaryResponse) => {
  if (!isSoundEnabled.value) return

  const prevSet = new Set(Object.values(previous).flat())
  const curSet = new Set(Object.values(current).flat())
  prevSet.forEach((v) => curSet.delete(v))
  const newPeopleList = Array.from(curSet)
  if (newPeopleList.length === 0) return

  const newPeopleText = new Intl.ListFormat().format(
    newPeopleList.map((p) => ({ victor141516: 'Víctor', Dav1z: 'David' }[p] ?? p)),
  )
  const lang = window.navigator.language.split('-')[0]
  const i18dTextOptions = {
    en: `${newPeopleText} connected to the server`,
    es: `Se ${newPeopleList.length === 1 ? 'ha' : 'han'} conectado ${newPeopleText}`,
  } as Record<string, string>
  const i18dText = i18dTextOptions[lang] ?? i18dTextOptions.en
  console.log({ lang, i18dText })

  const msg = new SpeechSynthesisUtterance()
  const voices = window.speechSynthesis.getVoices()
  msg.voice = voices[0]
  msg.volume = 1 // From 0 to 1
  msg.rate = 1 // From 0.1 to 10
  msg.pitch = 1 // From 0 to 2
  msg.text = i18dText
  msg.lang = lang
  speechSynthesis.speak(msg)
}

const onNewData = (previous: ServerSummaryResponse, current: ServerSummaryResponse) => {
  speakNewPeople(previous, current)
}

const isSoundEnabled = ref(false)

;(async () => {
  while (true) {
    await getServerSummary().then((data) => {
      onNewData(serverSummary.value ?? {}, data)
      serverSummary.value = data
    })
    await new Promise((res) => setInterval(res, 2000))
  }
})()

const isServerEmpty = computed(
  () => Object.values(serverSummary.value ?? {}).reduce((acc, cur) => acc + cur.length, 0) === 0,
)
</script>

<template>
  <button class="absolute top-0 left-0 mt-8 ml-8 text-6xl" @click="isSoundEnabled = !isSoundEnabled">
    {{ isSoundEnabled ? '🔊' : '🔇' }}
  </button>
  <div class="h-screen w-screen flex items-center justify-center pb-[20%]">
    <div v-if="!serverSummary" class="w-24 h-24">
      <img :src="loader" alt="Loader" class="w-full h-full" />
    </div>
    <ul v-else>
      <div v-if="isServerEmpty">
        <Tumbleweed />
      </div>
      <template v-else v-for="(users, channel) of serverSummary">
        <li v-if="users.length > 0" class="mt-3">
          <span class="font-bold">💬 {{ channel }}</span>
          <ul>
            <li v-for="user of users">🔵 {{ user }}</li>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>
