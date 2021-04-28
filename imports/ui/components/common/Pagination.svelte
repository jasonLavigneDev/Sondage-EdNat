<script>
  import { _ } from "svelte-i18n";

  export let page;
  export let total = 1;
  export let limit = 10;
  let array = [];
  $: array.length = Math.ceil(total / limit) || 1;
  $: array.fill(0);
</script>

{#if total > limit}
  <nav
    class="pagination is-primary is-right"
    role="navigation"
    aria-label="pagination"
  >
    <ul class="pagination-list">
      {#if page !== 1}
        <a class="pagination-previous" on:click={() => (page = page - 1)}
          >{$_("components.Pagination.previous")}</a
        >
      {/if}
      {#if array.length >= 10 && [1, 2].indexOf(page) === -1}
        <li>
          <a
            class="pagination-link"
            on:click={() => (page = 1)}
            class:is-current={1 === page}
            aria-label="Goto page 1">{1}</a
          >
        </li>
        {#if page > 3}
          <li><span class="pagination-ellipsis">&hellip;</span></li>
        {/if}
      {/if}
      {#each array as p, i}
        {#if array.length < 10}
          <li>
            <a
              class="pagination-link"
              on:click={() => (page = i + 1)}
              class:is-current={i + 1 === page}
              aria-label="Goto page {i + 1}">{i + 1}</a
            >
          </li>
        {:else if i === page || i + 1 === page || i + 2 === page}
          <li>
            <a
              class="pagination-link"
              class:is-current={i + 1 === page}
              on:click={() => (page = i + 1)}
              aria-label="Goto page {i + 1}">{i + 1}</a
            >
          </li>
        {/if}
      {/each}
      {#if array.length >= 10 && [array.length, array.length - 1].indexOf(page) === -1}
        {#if array.length - page > 2}
          <li><span class="pagination-ellipsis">&hellip;</span></li>
        {/if}
        <li>
          <a
            class="pagination-link"
            on:click={() => (page = array.length)}
            class:is-current={array.length === page}
            aria-label="Goto last page">{array.length}</a
          >
        </li>
      {/if}
      {#if page !== array.length}
        <a class="pagination-next" on:click={() => (page = page + 1)}
          >{$_("components.Pagination.next")}</a
        >
      {/if}
    </ul>
  </nav>
{/if}

<style>
  .pagination-previous {
    order: 0 !important;
  }
</style>
