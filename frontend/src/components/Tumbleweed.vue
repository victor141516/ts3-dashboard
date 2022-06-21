<script lang="ts" setup>
import tumbleweed from '../assets/tumbleweed.png'
const image = `url(${tumbleweed})`
</script>

<template>
  <div class="container">
    <div class="tumbleweed"></div>
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
}

.tumbleweed {
  position: absolute;
  width: 70px;
  height: 70px;
  background: v-bind(image) no-repeat;
  background-size: 100%;
}

.tumbleweed {
  animation: tumbleweed linear 6s;
  animation-iteration-count: infinite;
}

@keyframes tumbleweed {
  0% {
    transform: translate(calc(0vw - 100px), 45px) rotate(0deg);
  }
  9% {
    transform: translate(calc(9vw - 82px), 5px) rotate(130deg);
  }
  17% {
    transform: translate(calc(17vw - 66px), 45px) rotate(250deg);
  }
  26% {
    transform: translate(calc(26vw - 48px), 15px) rotate(360deg);
  }
  34% {
    transform: translate(calc(34vw - 32px), 45px) rotate(490deg);
  }
  42% {
    transform: translate(calc(42vw - 16px), 30px) rotate(600deg);
  }
  50% {
    transform: translate(calc(50vw + 0px), 45px) rotate(720deg);
  }
  59% {
    transform: translate(calc(59vw + 18px), 15px) rotate(830deg);
  }
  67% {
    transform: translate(calc(67vw + 34px), 45px) rotate(950deg);
  }
  76% {
    transform: translate(calc(76vw + 52px), 15px) rotate(1060deg);
  }
  84% {
    transform: translate(calc(84vw + 68px), 45px) rotate(1180deg);
  }
  93% {
    transform: translate(calc(93vw + 86px), 15px) rotate(1300deg);
  }
  100% {
    transform: translate(calc(100vw + 100px), 45px) rotate(1420deg);
  }
}
</style>
