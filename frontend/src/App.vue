<script setup lang="ts">
import { computed, ref } from 'vue'
import { getServerSummary, ServerSummaryResponse } from './services/api'
import Tumbleweed from './components/Tumbleweed.vue'
import loader from './assets/loader.svg'

const serverSummary = ref<ServerSummaryResponse | null>(null)

;(async () => {
  while (true) {
    await getServerSummary().then((data) => (serverSummary.value = data))
    await new Promise((res) => setInterval(res, 2000))
  }
})()

const isServerEmpty = computed(
  () => Object.values(serverSummary.value ?? {}).reduce((acc, cur) => acc + cur.length, 0) === 0,
)
</script>

<template>
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
