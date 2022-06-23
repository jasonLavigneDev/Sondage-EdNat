<script>
  import { fly } from "svelte/transition";
  import moment from "moment";
  import "moment/locale/fr";

  import { locales, locale } from "svelte-i18n";

  export let mobile = false;
  let opened = false;
  const toggle = () => (opened = !opened);

  const selectLocale = (l) => {
    locale.set(l);
    moment.locale(l);
    localStorage.setItem('mezig.language', l);
    toggle();
  };
</script>

{#if mobile}
  {#each $locales as l}
    <img
      class:active={$locale.split("-")[0] === l}
      alt={l}
      src="/i18n/{l}.png"
      on:click={() => selectLocale(l)}
    />
  {/each}
{:else}
  <img
    class="current"
    alt={$locale}
    src="/i18n/{$locale.split('-')[0]}.png"
    on:click={toggle}
  />

  {#if opened}
    <div class="box" transition:fly={{ x: 200 }}>
      {#each $locales as l}
        <img src="/i18n/{l}.png" alt={l} on:click={() => selectLocale(l)} />
      {/each}
    </div>
  {/if}
{/if}

<style>
  img {
    height: 30px;
    margin: auto 5px;
    cursor: pointer;
  }
  .current {
    margin-right: 10px;
  }
  .box {
    padding: 1rem;
    position: absolute;
    top: 60px;
    right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
