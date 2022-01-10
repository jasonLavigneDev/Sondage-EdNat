<script>
  import { _ } from "svelte-i18n";
  import tippy from "sveltejs-tippy";
  import { toggleActivePoll, removePolls } from "/imports/api/polls/methods";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { ROUTES } from "/imports/utils/enums";
  import copy from "copy-to-clipboard";
  import { toast } from "@zerodevx/svelte-toast";
  import Modal from "../../components/common/Modal.svelte";
  import { toasts } from "../../../utils/enums";

  export let poll;
  let votes;
  let removePollModal = false;

  const tooltip = (content) => ({
    content,
    placement: "bottom",
  });
  const togglePoll = () => {
    toggleActivePoll.call({ pollId: poll._id });
  };
  const toggleModal = () => (removePollModal = !removePollModal);
  $: votes = useTracker(() => {
    Meteor.subscribe("polls_answers.getCount", { pollId: poll._id });
    return Counts.get(`polls_answers.get-${poll._id}`);
  });
  const removePoll = () => {
    removePolls.call({ pollId: poll._id }, (e, r) => {
      if (e) {
        toast.push($_(e.reason), toasts.error);
      }
      removePollModal = false;
    });
  };
  const copyToClipboard = () => {
    const url = `${Meteor.absoluteUrl()}${ROUTES.ANSWER_POLL_RM(
      poll._id
    ).replace("/", "")}`;
    copy(url);
    toast.push($_("components.SinglePollLine.copied"));
  };
</script>

<tr>
  <th>
    <div class="buttons">
      {#if poll.active}
        <button
          class="button is-small is-primary"
          value={poll._id}
          on:click={togglePoll}
          use:tippy={tooltip($_("pages.home.deactivate_tooltip"))}
        >
          <i class="fas fa-eye" />
        </button>
      {:else if poll.completed}
        <button class="button is-small is-success" disabled>
          <i class="fas fa-check" />
        </button>
      {:else}
        <button
          class="button is-small is-warning"
          disabled={poll.completed}
          value={poll._id}
          on:click={togglePoll}
          use:tippy={tooltip($_("pages.home.activate_tooltip"))}
        >
          <i class="fas fa-eye-slash" />
        </button>
      {/if}

      <a
        href={!poll.active && $votes === 0
          ? ROUTES.EDIT_POLL_RM(poll._id)
          : ROUTES.ADMIN}
      >
        <button
          class="button is-small is-light"
          disabled={poll.active || $votes !== 0}
          use:tippy={tooltip($_("pages.home.edit_tooltip"))}
        >
          <i class="fas fa-pen" />
        </button>
      </a>

      <button
        class="button is-small is-info"
        use:tippy={tooltip($_("pages.home.link_tooltip"))}
        on:click={copyToClipboard}
      >
        <i class="far fa-copy" />
      </button>
      <a
        href={ROUTES.ANSWER_POLL_RM(poll._id)}
        class="button is-small is-primary"
        use:tippy={tooltip($_("pages.home.open_tooltip"))}
      >
        <i class="fas fa-external-link-alt" />
      </a>
      <button
        class="button is-small is-danger"
        on:click={toggleModal}
        disabled={poll.active}
        use:tippy={tooltip($_("pages.home.delete_tooltip"))}
      >
        <i class="fas fa-trash" />
      </button>
    </div>
  </th>
  <td>
    {poll.title}
  </td>
  <td>
    {$_(`types.${poll.type}_table`)}
  </td>
  <td>
    {poll.groups.length}
  </td>
  <td>
    {$_(`polls_datas.${poll.public}`)}
  </td>
  <td>
    {poll.allDay ? $_(`polls_datas.allDay`) : poll.duration}
  </td>
  <td>
    {poll.dates.reduce((acc, v) => acc + (poll.allDay ? 1 : v.slots.length), 0)}
  </td>
  <td> {$votes} </td>
</tr>

<Modal
  toggle={toggleModal}
  active={removePollModal}
  action={removePoll}
  title={$_("pages.home.remove_title")}
  validButton={$_("pages.home.remove_valid")}
  validClass="is-danger"
  cancelButton={$_("pages.home.remove_cancel")}
  cancelClass="is-white"
>
  <p>{$_("pages.home.remove_text")}</p>
  <p><b>{poll.title}</b></p>
</Modal>
