import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';

import {Provider} from 'react-redux'
import {createStore, combineReducers} from 'redux'

import token from './reducers/token'
import userPseudo from "./reducers/pseudo";
import userPreferences from "./reducers/filter"
import userGeoLoc from "./reducers/userGeoLoc"

import SignIn from './SignIn';
import SignUp from './SignUp';
import ChatScreen from './ChatScreen'
import MapScreen from './MapScreen'

const store = createStore(combineReducers({token, userGeoLoc, userPseudo, userPreferences }))

function App() {
  return (

    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={SignIn} path="/" exact />
          <Route component={SignUp} path="/signup" exact />
          <Route component={MapScreen} path="/mapscreen" exact />
          <Route component={ChatScreen} path="/chatscreen" exact />
        </Switch>
      </Router>
    </Provider>
    

  );
}

export default App;

export const sportAssets = [
  {
    isChosen: false,
    name: 'escalade',
    id: '503289d391d4c4b30a586d6a',
    isPicked: false,
    img: './assets/escalade.png'
  },
  {
    isChosen: false,
    name: 'badminton',
    id: '52e81612bcbc57f1066b7a2b',
    isPicked: false,
    img: './assets/badminton.png'
  },
  {
    isChosen: false,
    name: 'basketball',
    id: '4bf58dd8d48988d1e1941735',
    isPicked: false,
    img: './assets/basketball.png'
  },
  {
    isChosen: false,
    name: 'fitness',
    id: '52f2ab2ebcbc57f1066b8b48',
    isPicked: false,
    img: './assets/fitness.png'
  },
  {
    isChosen: false,
    name: 'football',
    id: '4cce455aebf7b749d5e191f5',
    isPicked: false,
    img: './assets/football.png'
  },
  {
    isChosen: false,
    name: 'natation',
    id: '4bf58dd8d48988d105941735',
    isPicked: false,
    img: './assets/natation.png'
  },
  {
    isChosen: false,
    name: 'rugby',
    id: '52e81612bcbc57f1066b7a2c',
    isPicked: false,
    img: './assets/rugby.png'
  },
  {
    isChosen: false,
    name: 'running',
    id: '5744ccdfe4b0c0459246b4b2',
    isPicked: false,
    img: './assets/running.png'
  },
  {
    isChosen: false,
    name: 'skate',
    id: '4bf58dd8d48988d167941735',
    isPicked: false,
    img: './assets/skate.png'
  },
  {
    isChosen: false,
    name: 'squash',
    id: '52e81612bcbc57f1066b7a2d',
    isPicked: false,
    img: './assets/squash.png'
  },
  {
    isChosen: false,
    name: 'tennis',
    id: '4e39a956bd410d7aed40cbc3',
    isPicked: false,
    img: './assets/tennis.png'
  },
  {
    isChosen: false,
    name: 'velo',
    id: '52f2ab2ebcbc57f1066b8b49',
    isPicked: false,
    img: './assets/velo.png'
  },
  {
    isChosen: false,
    name: 'volleyball',
    id: '4eb1bf013b7b6f98df247e07',
    isPicked: false,
    img: './assets/volleyball.png'
  }
]
