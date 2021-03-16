<script>
  import { _ } from "svelte-i18n";
  import { globalState } from "/imports/utils/functions/stores";
  import { ROUTES } from "/imports/utils/enums";

  // components
  import BigLink from "/imports/ui/components/common/BigLink.svelte";

  const { state } = globalState();
  $: console.log($state);
</script>

<svelte:head>
  <title>{$_("title")} | {$_("links.home")}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">{$_("pages.home.title")}</h1>
  </div>
</section>
