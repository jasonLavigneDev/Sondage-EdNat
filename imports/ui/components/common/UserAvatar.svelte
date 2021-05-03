<script>
  import { Meteor } from "meteor/meteor";
</script>

{#if Meteor.user().avatar}
  <figure class="image is-48x48 ">
    <img
      class="with-avatar is-rounded"
      alt={Meteor.user().firstName}
      src="https://bulma.io/images/placeholders/128x128.png"
    />
  </figure>
{:else}
  <div class="no-avatar">
    {Meteor.user().firstName.substring(0, 1)}
  </div>
{/if}

<style>
  .image {
    display: flex;
    align-items: center;
    margin-left: 5px;
    height: 40px;
    width: 40px;
  }
  .with-avatar {
    background-color: transparent;
  }
  .no-avatar {
    margin-left: 5px;
    display: flex;
    overflow: hidden;
    position: relative;
    font-size: 1.25rem;
    align-items: center;
    flex-shrink: 0;
    line-height: 1;
    user-select: none;
    border-radius: 50%;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #bdbdbd;
    color: white;
  }
</style>
