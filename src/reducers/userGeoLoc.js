export default function (userGeoLoc = {}, action) {
    if (action.type == "saveUserLocation") {
        return action.geoloc;
      } else {
        return userGeoLoc;
      }
    }