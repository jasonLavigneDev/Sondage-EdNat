<script>
  import { _ } from "svelte-i18n";
  import tippy from "sveltejs-tippy";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { ROUTES } from "/imports/utils/enums";
  import copy from "copy-to-clipboard";
  import { toast } from "@zerodevx/svelte-toast";

  export let poll;
  let votes;

  const tooltip = (content) => ({
    content,
    placement: "bottom",
  });
  $: votes = useTracker(() => {
    Meteor.subscribe("polls_answers.getCount", { pollId: poll._id });
    return Counts.get(`polls_answers.get-${poll._id}`);
  });
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
    </div>
  </th>
  <td>
    {poll.title}
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
    {poll.dates.reduce((acc, v) => acc + v.slots.length, 0)}
  </td>
  <td> {$votes} </td>
</tr>
