<script>
  import { location } from "../../utils/functions/locationTracker";
  import { goto } from "@sapper/app";
  import { _ } from "svelte-i18n";

  export let previousLocation;
  export let useHistory = false;
  const goBackward = async () => {
    if (!useHistory || !$location || !$location.previous) {
      await goto(previousLocation);
    } else {
      await goto(`${$location.previous.pathname}${$location.previous.search}`);
    }
  };
</script>

<section class="box-transparent">
  <button class="button" on:click={goBackward}>
    <span class="icon"> <i class="fa fa-arrow-left" /> </span>
    <span>{$_('back')}</span>
  </button>
</section>
