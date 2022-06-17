<template>
  <div class="container">
    <div class="tumbleweed"></div>
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  /* top: 0; */
  left: 0;
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  background: url('https://curtasaude.com.br/wp-content/uploads/2015/04/correndonocalor.png') no-repeat;
  background-size: 100%;
}

.tumbleweed {
  position: absolute;
  width: 70px;
  height: 70px;
  background: url('https://vignette4.wikia.nocookie.net/imaspeedrunner/images/3/3a/Orphan_tumbleweed.png/revision/latest?cb=20131006213006')
    no-repeat;
  background-size: 100%;
}

.tumbleweed {
  animation: tumbleweed linear 6s;
  animation-iteration-count: infinite;
}

@keyframes tumbleweed {
  0% {
    transform: translate(0vw, 45px) rotate(0deg);
  }
  9% {
    transform: translate(9vw, 5px) rotate(130deg);
  }
  17% {
    transform: translate(17vw, 45px) rotate(250deg);
  }
  26% {
    transform: translate(26vw, 15px) rotate(360deg);
  }
  34% {
    transform: translate(34vw, 45px) rotate(490deg);
  }
  42% {
    transform: translate(42vw, 30px) rotate(600deg);
  }
  50% {
    transform: translate(50vw, 45px) rotate(720deg);
  }
  59% {
    transform: translate(59vw, 15px) rotate(830deg);
  }
  67% {
    transform: translate(67vw, 45px) rotate(950deg);
  }
  76% {
    transform: translate(76vw, 15px) rotate(1060deg);
  }
  84% {
    transform: translate(84vw, 45px) rotate(1180deg);
  }
  93% {
    transform: translate(93vw, 15px) rotate(1300deg);
  }
  100% {
    transform: translate(100vw, 45px) rotate(1420deg);
  }
}
</style>
