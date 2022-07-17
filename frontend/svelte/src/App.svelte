<script lang="ts">
  import Tumbleweed from "./lib/Tumbleweed.svelte";
  import clear from "./assets/clear.svg";
  import loader from "./assets/loader.svg";
  import {
    getServerSummary,
    sendMessage,
    ServerSummaryResponse,
    turnBombilla,
  } from "./services/api";
  import { speakNewPeople } from "./services/speaker";
  import vitilloOnImage from "./assets/vitillo-on.png";
  import vitilloOffImage from "./assets/vitillo-off.png";

  let isSoundEnabled = false;
  let viewerName = localStorage.getItem("viewerName") ?? "";
  let serverSummary: ServerSummaryResponse | null = null;
  const VIEWERS_CHANNEL_NAME = "_viewers";

  const onNewData = (
    previous: ServerSummaryResponse,
    current: ServerSummaryResponse
  ) => {
    if (isSoundEnabled) speakNewPeople(previous, current);
  };

  $: isServerEmpty =
    Object.values(serverSummary ?? {}).reduce(
      (acc, cur) => acc + cur.length,
      0
    ) === 0;
  (async () => {
    while (true) {
      await getServerSummary(viewerName).then((data) => {
        onNewData(serverSummary ?? {}, data);
        serverSummary = data;
      });
      await new Promise((res) => setTimeout(res, 2000));
    }
  })();

  const composeMessage = (channel: string) => {
    const message = window.prompt(`Send message to ${channel}`, "");
    if (message) sendMessage({ channel, message });
  };

  $: () => localStorage.setItem("viewerName", viewerName);

  let bombilla = false;
  const toggleBombilla = async () => {
    if (bombilla) {
      await turnBombilla({ state: "off" });
      bombilla = false;
    } else {
      await turnBombilla({ state: "on" });
      bombilla = true;
    }
  };
</script>

<main>
  <button
    class="absolute top-0 left-0 mt-8 ml-8 text-6xl"
    on:click={() => (isSoundEnabled = !isSoundEnabled)}
  >
    {isSoundEnabled ? "🔊" : "🔇"}
  </button>
  <button>
    <img
      on:click={toggleBombilla}
      class="absolute top-0 right-0 mt-8 mr-8"
      src={bombilla ? vitilloOnImage : vitilloOffImage}
      alt="vitillo.industries"
      width="400"
    />
  </button>
  <div
    class="h-screen w-screen flex flex-col items-center justify-center pb-[20vh]"
  >
    <div class="flex flex-col items-center">
      <label for="viewer-name">Viewer name</label>
      <div class="border rounded-full relative">
        <button
          on:click={() => (viewerName = "")}
          class="absolute top-[-3px] right-[-3px]"
        >
          <img src={clear} alt="clear input" class="scale-90" />
        </button>
        <input
          type="text"
          name="viewer-name"
          class="px-2 rounded-full outline-none"
          bind:value={viewerName}
        />
      </div>
    </div>

    {#if !serverSummary}
      <div class="w-24 h-24">
        <img src={loader} alt="Loader" class="w-full h-full" />
      </div>
    {:else}
      <ul class="mt-6">
        {#if isServerEmpty}
          <Tumbleweed />
        {:else}
          {#if serverSummary[VIEWERS_CHANNEL_NAME] && serverSummary[VIEWERS_CHANNEL_NAME]}
            <ul class="mb-6">
              {#each serverSummary[VIEWERS_CHANNEL_NAME] as user}
                <li>👀 {user}</li>
              {/each}
            </ul>
          {/if}
          {#each Object.entries(serverSummary) as [channel, users]}
            {#if users.length > 0 && channel !== VIEWERS_CHANNEL_NAME}
              <li class="mt-3">
                <span class="font-bold"
                  ><button on:click={() => composeMessage(channel)}>💬</button>
                  {channel}</span
                >
                <ul>
                  {#each users as user}
                    <li>🔵 {user}</li>
                  {/each}
                </ul>
              </li>
            {/if}
          {/each}
        {/if}
      </ul>
    {/if}
  </div>
</main>
