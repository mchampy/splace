import React, {useState} from 'react';
import './App.css';
import {Input,Button,Card } from 'antd';
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Logo from "./assets/logosplace.png";

function SignIn(props) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const [userExists, setUserExists] = useState(false);
  const [listErrorsSignin, setErrorsSignin] = useState([]);


  var handleSubmitSignin = async () => {
 
      const data = await fetch(`/users/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${email}&password=${password}`
      })
  
      const body = await data.json()
  
      if (body.result == true) {
        props.addToken(body.token)
        setUserExists(true)
  
      } else {
        setErrorsSignin(body.error)
      }
    }
  
    if (userExists) {
      return <Redirect to='/MapScreen' />
    }
    

  return (
    <div className="Login-page" 
    style={{ backgroundImage: 'linear-gradient(rgba(255,188,62,1), rgba(255,67,67,1))' }}>
      <img src={Logo} style={{width:'500px', margin:'10px'}} alt='pic' />

          {/* SIGN-IN */}

          <div className="Sign">

            <Card style={{width:'400px'}}>
                  
            <Input onChange={(e) => setEmail(e.target.value)} className="Login-input" style={{width:320}} placeholder="email" />

            <Input.Password onChange={(e) => setPassword(e.target.value)} className="Login-input" style={{width:320}} placeholder="mot de passe" />

            {listErrorsSignin}
            
            <div style={{display:'flex', justifyContent:'space-around'}}>
            <Button  className="Button" onClick={() => handleSubmitSignin()} >Se connecter</Button>
            <Link to ='/signup'><Button  className="Button" style={{backgroundColor: 'white', color:'#F4B223'}}>Inscription</Button></Link>
            </div>

            </Card>

          </div>

      </div>
  );
}

function mapDispatchToProps(dispatch){
  return {
    addToken: function(token){
      dispatch({type: 'addToken', token: token})
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(SignIn)
