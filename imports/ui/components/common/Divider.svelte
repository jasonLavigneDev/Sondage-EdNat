<script>
  export let transparent = false;
</script>

<style lang="scss">
  .divider {
    height: 1px;
    background-color: var(--lightgrey);
    width: 100%;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .transparent {
    background-color: transparent;
  }
</style>

<div class="divider" class:transparent />
