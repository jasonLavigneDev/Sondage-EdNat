<script>
  function ampm(hours, minutes) {
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    minutes = minutes || 0;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + ampm;
  }
</script>
