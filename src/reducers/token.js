export default function(token = '', action){
    if(action.type == 'addToken'){
        console.log('je suis le token du reducer', action.token)
        return action.token
    } else {
        return token
    }
}