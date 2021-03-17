export default function (userPreferences = {}, action) {
    if (action.type == "savePreferences") {
      return action.preferences;
    } else {
      return userPreferences;
    }
  }