export default function (userPreferences = {}, action) {
    if (action.type == "savePreferences") {
      console.log('coucou2', action.preferences)
      return action.preferences;
    } else {
      console.log('je passe par le else du reducer')
      return userPreferences;
    }
  }