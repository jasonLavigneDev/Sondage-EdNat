function isValideMail(mail) {
  var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (mail.match(regex)) {
    return true;
  }
  return false;
}

export default isValideMail;
