<script>
  import { Meteor } from 'meteor/meteor';

</script>

{#if Meteor.user().avatar}
  <figure class="image">
    <img class="with-avatar is-rounded" alt={Meteor.user().firstName} src={Meteor.user().avatar} />
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
    max-height: 48px;
    max-width: 48px;
  }
  .with-avatar {
    background-color: transparent;
    max-height: 40px;
    max-width: 40px;
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
