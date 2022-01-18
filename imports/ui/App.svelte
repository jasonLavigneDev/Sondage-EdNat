<script>
  import { _ } from 'svelte-i18n';
  import { SvelteToast } from '@zerodevx/svelte-toast';

  import '/imports/utils/locales/index';
  import Router from '/imports/ui/Router.svelte';
  import Nav from '/imports/ui/components/navigation/Nav.svelte';
  import Footer from '/imports/ui/components/navigation/Footer.svelte';
  import { globalState } from '/imports/utils/functions/stores';
  import { toast_options } from '/imports/utils/enums';
  import PackageJSON from '../../package.json';
  let version = PackageJSON.version;

  let width;
  const { setState } = globalState();

  const checkDeviceSize = () => {
    setState({ mobile: width < 768 });
  };
</script>

<div bind:clientWidth={width} />
<svelte:window on:resize={checkDeviceSize} />

<svelte:head>
  <title>{$_('title')} {version}</title>
</svelte:head>
<SvelteToast options={toast_options} />
<Nav />

<main>
  <Router />
</main>

<Footer />

<style>
  main {
    padding-top: calc(52px + var(--space-between));
    min-height: calc(100vh - 64px);
    padding-bottom: 20px;
  }
</style>
