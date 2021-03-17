export default function (userPseudo = "", action) {
    if (action.type == "register") {
        var userPseudoCopy = action.pseudo
// console.log('test reducer ---->',userPseudoCopy)
      return userPseudoCopy;
    } else {
      return userPseudo;
    }
  }