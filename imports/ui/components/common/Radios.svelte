<script>
  export let value;
  export let disabled = false;
  export let action = () => null;
  export let options = [];
</script>

{#each options as option}
  <label class="radio-container">
    {option.label}
    <input type="radio" {disabled} bind:group={value} value={option.value} />
    <span class="checkmark" class:disabled />
  </label>
{/each}

<style>
  /* Customize the label (the radio-container) */
  .radio-container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .disabled {
    opacity: 0.7;
  }
  /* Hide the browser's default radio */
  .radio-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom radio */
  .checkmark {
    position: absolute;
    top: 5px;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    border-radius: 50%;
  }

  /* On mouse-over, add a grey background color */
  .radio-container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the radio is checked, add a blue background */
  .radio-container input:checked ~ .checkmark {
    background-color: var(--primary);
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .radio-container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .radio-container .checkmark:after {
    left: 7px;
    top: 7px;
    width: 11px;
    height: 11px;
    border: 1px solid white;
    border-radius: 50%;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    background-color: white;
  }
</style>
