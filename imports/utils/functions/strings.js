import { Meteor } from 'meteor/meteor';

const regValidateStrict = /[<>"'&]/g;
const regValidate = /((<|%3C|&lt;)script)|(('|"|%22|%27) *on[a-z_]+ *(=|%3D))/gi;

/** Check a string for malicious content */
const validateString = (content, strict = false) => {
  if (content.length > 50000) {
    throw new Meteor.Error('api.utils.functions.strings.validateString.tooLong', 'api.utils.stringTooLong');
  }
  /** strict forbids any of the following characters : < > " ' &
      otherwise, forbid script tags and pattern like " onload=... */
  const scriptRegex = strict ? regValidateStrict : regValidate;
  if (content.match(scriptRegex) !== null) {
    throw new Meteor.Error(
      'api.utils.functions.strings.validateString.error',
      strict ? 'api.utils.badCharsDetected' : 'api.utils.scriptDetected',
    );
  }
  return content;
};

export default validateString;
