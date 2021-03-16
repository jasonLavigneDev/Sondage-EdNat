<script>
  import { fade } from "svelte/transition";
  export let message;
  export let mainLoader = false;
  const cubes = [
    "0.5s",
    "0.6s",
    "0.7s",
    "0.8s",
    "0.9s",
    "0.4s",
    "0.5s",
    "0.6s",
    "0.7s",
    "0.8s",
    "0.3s",
    "0.4s",
    "0.5s",
    "0.6s",
    "0.7s",
    "0.2s",
    "0.3s",
    "0.4s",
    "0.5s",
    "0.6s",
    "0.1s",
    "0.2s",
    "0.3s",
    "0.4s",
    "0.5s",
  ];
</script>

<style lang="scss">
  .wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.75);
    z-index: 10;
  }
  .mainLoader {
    position: fixed;
  }
  .loader-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px;
  }
  .loader-svg {
    margin: auto;
  }
  .subtitle {
    text-transform: uppercase;
  }

  :root {
    --sk-size: 60px;
    --sk-color: #02235e;
    --sk-color1: #5aa1d8;
  }
  .sk-grid {
    width: var(--sk-size);
    height: var(--sk-size);
    margin-bottom: 15px;
  }
  .sk-grid-cube {
    width: 20%;
    height: 20%;
    float: left;
    animation: sk-grid 1.5s infinite ease-in-out;
    animation-delay: var(--time);
    background-image: url("/logo.png");
    background-repeat: no-repeat;
    background-attachment: inherit;
    background-position: var(--position);
    background-size: 60px;
  }

  @keyframes sk-grid {
    0%,
    70%,
    100% {
      transform: scale3D(1, 1, 1);
    }
    50% {
      transform: scale3D(0.1, 0.1, 1);
    }
  }
</style>

<div
  class:mainLoader
  class="wrapper"
  transition:fade|local={{ duration: 200, delay: 200 }}>
  <div class="loader-wrapper">
    <div class="sk-grid">
      {#each cubes as cube, i}
        <div
          class="sk-grid-cube"
          style="--time:{cube}; --position:{(i % 5) * 25}% {Math.floor(i / 5) * 25}%" />
      {/each}
    </div>

    {#if message}<span class="subtitle">{message}</span>{/if}
  </div>
</div>
