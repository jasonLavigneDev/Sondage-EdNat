<script>
  import { Meteor } from 'meteor/meteor';
  import { _ } from 'svelte-i18n';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { onMount } from 'svelte';
  import Matomo, { matomo } from '@dexlib/svelte-matomo';

  import '/imports/utils/locales/index';
  import Router from '/imports/ui/Router.svelte';
  import Nav from '/imports/ui/components/navigation/Nav.svelte';
  import Footer from '/imports/ui/components/navigation/Footer.svelte';
  import { globalState } from '/imports/utils/functions/stores';
  import { toast_options } from '/imports/utils/enums';
  import PackageJSON from '../../package.json';
  let version = PackageJSON.version;

  const { matomo: matomoSettings } = Meteor.settings.public;
  onMount(() => {
    if (matomoSettings?.urlBase) {
      matomo.trackPageView();
    }
  });

  let width;
  const { setState } = globalState();

  const checkDeviceSize = () => {
    setState({ mobile: width < 768 });
  };
</script>

<div bind:clientWidth={width} />
<svelte:window id="test" on:resize={checkDeviceSize} />

<svelte:head>
  <title>{$_('title')} {version}</title>
</svelte:head>
<SvelteToast options={toast_options} />
<Nav />

<main>
  {#if matomoSettings?.urlBase}
    <Matomo url={matomoSettings.urlBase} siteId={matomoSettings.siteIdSondage} />
  {/if}
  <Router />
</main>

<Footer />

<style>
  :root {
    --toastWidth: 24rem;
  }
  main {
    padding-top: calc(52px + var(--space-between));
    min-height: calc(100vh - 64px);
    padding-bottom: 20px;
  }
</style>
