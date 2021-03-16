<script>
    import Loader from './Loader'
    export let component;
</script>

{#await component.then ? component : component()}
    <Loader />
{:then Cmp}
   <svelte:component this={Cmp.default} />
{/await}