<script>
  import { _ } from "svelte-i18n";
  import moment from "moment";
  import tippy from "sveltejs-tippy";
  import { ROUTES } from "/imports/utils/enums";
  import { toast } from "@zerodevx/svelte-toast";
  import { toasts } from "../../../utils/enums";

  export let answer;
  let loading = false;

  const tooltip = (content) => ({
    content,
    placement: "bottom",
  });

  const validateMeeting = () => {
    loading = true;
    Meteor.call(
      "polls_answers.meeting.validate",
      { answerId: answer._id },
      (e) => {
        loading = false;
        if (e) {
          toast.push($_(e.reason), toasts.error);
        }
      }
    );
  };
</script>

<tr>
  <th>
    <div class="buttons">
      <button
        class="button"
        class:is-loading={loading}
        class:is-success={answer.confirmed}
        class:is-primary={!answer.confirmed}
        on:click={validateMeeting}
        use:tippy={tooltip(
          answer.confirmed
            ? $_("components.SinglePollAnswerLine.validated_tooltip")
            : $_("components.SinglePollAnswerLine.validate_tooltip")
        )}
      >
        <span class="icon">
          <i
            class="fas"
            class:fa-calendar-check={answer.confirmed}
            class:fa-paper-plane={!answer.confirmed}
          />
        </span>
        <span>
          {#if answer.confirmed}
            {$_("components.SinglePollAnswerLine.validated")}
          {:else}
            {$_("components.SinglePollAnswerLine.validate")}
          {/if}
        </span>
      </button>
    </div>
  </th>
  <td>
    {answer.email}
  </td>
  <td>
    {moment(answer.meetingSlot).format("LLL")}
  </td>
</tr>
