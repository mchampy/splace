import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Button, Card, Menu } from 'antd';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'

import 'react-upload-image-gallery/dist/style.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Leaflet from 'leaflet'

import { sportAssets } from "./App";

function MapScreen(props) {

    const [currentLatitude, setCurrentLatitude] = useState(48.866667);
    const [currentLongitude, setCurrentLongitude] = useState(2.333333);
    const [visible, setVisible] = useState(false);
    const [visibleEvent, setVisibleEvent] = useState(false);
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [visibleAddFriends, setVisibleAddFriends] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const [sportAddress, setSportAddress] = useState('')
    const [sportTime, setSportTime] = useState('')
    const [sportMix, setSportMix] = useState('')
    const [sportHandi, setSportHandi] = useState('')
    const [sportName, setSportName] = useState('')
    const [sportPlace, setSportPlace] = useState('')
    const [sportDistance, setSportDistance] = useState('')
    const [sportTitle, setSportTitle] = useState('')

    const [dateBackEvent, setDateBackEvent] = useState(null)

    const [startDate, setStartDate] = useState('');
    const filterPassedTime = time => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        console.log('startDate')
        return currentDate.getTime() < selectedDate.getTime();

    }

    const [show, setShow] = useState(false);
    const ref = useRef(null);
    const [target, setTarget] = useState(null);

    const toggleSwitchEventMix = () => {
        setIsEventMixed((previousState) => !previousState);
    };
    const toggleSwitchEventPrivate = () => {
        setIsEventPrivate((previousState) => !previousState);
    };
    const toggleSwitchEventHandi = () => {
        setIsEventHandi((previousState) => !previousState);
    };
    const [kilometer, setKilometer] = useState(10000);

    //event creation states
    const [isEventMixed, setIsEventMixed] = useState([
        {
            name: "Oui",
            isChosen: false,
        },
        {
            name: "Non",
            isChosen: false,
        },
    ]);


    const toggleOverlayEvent = (event) => {
        setShow(!show)
        setTarget(event.target);
    }


    const handleEventMix = (idx) => {
        const copy = [...isEventMixed];
        const oldIdx = copy.findIndex((e) => e.isChosen);
        if (oldIdx != -1) {
            copy[oldIdx].isChosen = !copy[oldIdx].isChosen;
        }
        copy[idx].isChosen = !copy[idx].isChosen;
        setIsEventMixed(copy);
    };

    const generateEventMix = isEventMixed.map((e, idx) => (
        <Button
            onClick={() => handleEventMix(idx)}
            key={idx}
            style={
                isEventMixed[idx].isChosen
                    ? {
                        backgroundColor: "transparent",
                        borderColor: "#F4B223",
                        borderWidth: 2,
                        borderRadius: "8%",
                        margin: 5,
                    }
                    : {
                        backgroundColor: "transparent",
                        borderColor: "#DAD8D1",
                        borderWidth: 2,
                        borderRadius: "8%",
                        margin: 5,
                    }
            }
        >{e.name}</Button>
    ));

    const [isEventPrivate, setIsEventPrivate] = useState(
        [
            {
                name: "Oui",
                isChosen: false,
            },
            {
                name: "Non",
                isChosen: false,
            },
        ]);


    const handleEventPrivate = (idx) => {
        const copy = [...isEventPrivate];
        const oldIdx = copy.findIndex((e) => e.isChosen);
        if (oldIdx != -1) {
            copy[oldIdx].isChosen = !copy[oldIdx].isChosen;
        }
        copy[idx].isChosen = !copy[idx].isChosen;
        setIsEventPrivate(copy);
    };

    const generatePrivateEvent = isEventPrivate.map((e, idx) => (
        <Button
            onClick={() => handleEventPrivate(idx)}
            key={idx}
            style={
                isEventPrivate[idx].isChosen
                    ? {
                        backgroundColor: "transparent",
                        borderColor: "#F4B223",
                        borderWidth: 2,
                        borderRadius: "8%",
                        margin: 5,
                    }
                    : {
                        backgroundColor: "transparent",
                        borderColor: "#DAD8D1",
                        borderWidth: 2,
                        borderRadius: "8%",
                        margin: 5,
                    }
            }
        >{e.name}</Button>
    ));

    const [eventTitle, setEventTitle] = useState("");

    const [isSettingCustomPlace, setIsSettingCustomPlace] = useState(false);
    const [isCustomAddressVisible, setIsCustomAddressVisible] = useState(false);

    const [isSearchingExistingPlace, setIsSearchingExistingPlace] = useState(
        false
    );
    const [placeId, setPlaceId] = useState(null);
    const [searchedPlaces, setSearchedPlaces] = useState([]);
    /*  const [copiedText, setCopiedText] = useState('') */
    const [placeAddress, setPlaceAddress] = useState(null);
    const [placeLocation, setPlaceLocation] = useState({
        latitude: null,
        longitude: null,
    });

    const [events, setEvents] = useState([]);
    const [places, setPlaces] = useState([]);
    const [myEvents, setMyEvents] = useState([]);

    const [isEventHandi, setIsEventHandi] = useState([
        {
            name: "Oui",
            isChosen: false,
        },
        {
            name: "Non",
            isChosen: false,
        },
    ]);


    const handleHandi = (idx) => {
        const copy = [...isEventHandi];
        const oldIdx = copy.findIndex((e) => e.isChosen);
        if (oldIdx != -1) {
            copy[oldIdx].isChosen = !copy[oldIdx].isChosen;
        }
        copy[idx].isChosen = !copy[idx].isChosen;
        setIsEventHandi(copy);
    };

    const generateHandisport = isEventHandi.map((e, idx) => (
        <Button
            onClick={() => handleHandi(idx)}
            key={idx}
            style={
                isEventHandi[idx].isChosen
                    ? {
                        backgroundColor: "transparent",
                        borderColor: "#F4B223",
                        borderWidth: 2,
                        borderRadius: "8%",
                        margin: 5,
                    }
                    : {
                        backgroundColor: "transparent",
                        borderColor: "#DAD8D1",
                        borderWidth: 2,
                        borderRadius: "8%",
                        margin: 5,
                    }
            }
        >{e.name}</Button>
    ));

    const [favourite, setFavourite] = useState([
        {
            name: "escalade",
            id: "503289d391d4c4b30a586d6a",
            isPicked: false,
            img: "./assets/escalade.png",
        },
        {
            name: "badminton",
            id: "52e81612bcbc57f1066b7a2b",
            isPicked: false,
            img: "./assets/badminton.png",
        },
        {
            name: "basketball",
            id: "4bf58dd8d48988d1e1941735",
            isPicked: false,
            img: "./assets/basketball.png",
        },
        {
            name: "fitness",
            id: "52f2ab2ebcbc57f1066b8b48",
            isPicked: false,
            img: "./assets/fitness.png",
        },
        {
            name: "football",
            id: "4cce455aebf7b749d5e191f5",
            isPicked: false,
            img: "./assets/football.png"
        },
        {
            name: "natation",
            id: "4bf58dd8d48988d105941735",
            isPicked: false,
            img: "./assets/natation.png",
        },
        {
            name: "rugby",
            id: "52e81612bcbc57f1066b7a2c",
            isPicked: false,
            img: "./assets/rugby.png",
        },
        {
            name: "running",
            id: "5744ccdfe4b0c0459246b4b2",
            isPicked: false,
            img: "./assets/running.png",
        },
        {
            name: "skate",
            id: "4bf58dd8d48988d167941735",
            isPicked: false,
            img: "./assets/skate.png",
        },
        {
            name: "squash",
            id: "52e81612bcbc57f1066b7a2d",
            isPicked: false,
            img: "./assets/squash.png",
        },
        {
            name: "tennis",
            id: "4e39a956bd410d7aed40cbc3",
            isPicked: false,
            img: "./assets/tennis.png",
        },
        {
            name: "velo",
            id: "52f2ab2ebcbc57f1066b8b49",
            isPicked: false,
            img: "./assets/velo.png",
        },
        {
            name: "volleyball",
            id: "4eb1bf013b7b6f98df247e07",
            isPicked: false,
            img: "./assets/volleyball.png",
        },
    ]);

    const [filterFavourite, setFilterFavourite] = useState([
        {
            name: "escalade",
            id: "503289d391d4c4b30a586d6a",
            isPicked: false,
            img: "./assets/escalade.png",
        },
        {
            name: "badminton",
            id: "52e81612bcbc57f1066b7a2b",
            isPicked: false,
            img: "./assets/badminton.png",
        },
        {
            name: "basketball",
            id: "4bf58dd8d48988d1e1941735",
            isPicked: false,
            img: "./assets/basketball.png",
        },
        {
            name: "fitness",
            id: "52f2ab2ebcbc57f1066b8b48",
            isPicked: false,
            img: "./assets/fitness.png",
        },
        {
            name: "football",
            id: "4cce455aebf7b749d5e191f5",
            isPicked: false,
            img: "./assets/football.png"
        },
        {
            name: "natation",
            id: "4bf58dd8d48988d105941735",
            isPicked: false,
            img: "./assets/natation.png",
        },
        {
            name: "rugby",
            id: "52e81612bcbc57f1066b7a2c",
            isPicked: false,
            img: "./assets/rugby.png",
        },
        {
            name: "running",
            id: "5744ccdfe4b0c0459246b4b2",
            isPicked: false,
            img: "./assets/running.png",
        },
        {
            name: "skate",
            id: "4bf58dd8d48988d167941735",
            isPicked: false,
            img: "./assets/skate.png",
        },
        {
            name: "squash",
            id: "52e81612bcbc57f1066b7a2d",
            isPicked: false,
            img: "./assets/squash.png",
        },
        {
            name: "tennis",
            id: "4e39a956bd410d7aed40cbc3",
            isPicked: false,
            img: "./assets/tennis.png",
        },
        {
            name: "velo",
            id: "52f2ab2ebcbc57f1066b8b49",
            isPicked: false,
            img: "./assets/velo.png",
        },
        {
            name: "volleyball",
            id: "4eb1bf013b7b6f98df247e07",
            isPicked: false,
            img: "./assets/volleyball.png",
        },
    ]);

    const handleFilterFavourite = (idx) => {
        const copy = [...filterFavourite];
        copy[idx].isPicked = !copy[idx].isPicked;
        setFilterFavourite(copy);
    };

    const filterSportFavourite = filterFavourite.map((e, idx) => (
        <Button
            style={
                filterFavourite[idx].isPicked
                    ? {
                        borderColor: "black",
                        borderWidth: 2,
                        borderRadius: 30,
                        margin: 2,
                        paddingLeft: 1,
                        paddingTop: 1,
                        width: 46,
                        height: 46,
                    }
                    : {
                        borderColor: "transparent",
                        borderWidth: 0,
                        borderRadius: 30,
                        margin: 2,
                        paddingLeft: 1,
                        paddingTop: 1,
                        width: 46,
                        height: 46,
                    }}>
            <img src={e.img} width='40' height='40'
                onClick={() => handleFilterFavourite(idx)} key={idx}
            ></img></Button>
    ));

    const handlePickFavourite = (idx) => {
        const copy = [...favourite];
        const oldIdx = copy.findIndex((e) => e.isPicked);
        if (oldIdx != -1) {
            copy[oldIdx].isPicked = !copy[oldIdx].isPicked;
        }
        copy[idx].isPicked = !copy[idx].isPicked;
        setFavourite(copy);
    };

    const generateSportFavourite = favourite.map((e, idx) => (
        <Button
            style={
                favourite[idx].isPicked
                    ? {
                        borderColor: "black",
                        borderWidth: 2,
                        borderRadius: 30,
                        margin: 2,
                        paddingLeft: 1,
                        paddingTop: 1,
                        width: 46,
                        height: 46,
                    }
                    : {
                        borderColor: "transparent",
                        borderWidth: 0,
                        borderRadius: 30,
                        margin: 2,
                        paddingLeft: 1,
                        paddingTop: 1,
                        width: 46,
                        height: 46,
                    }}>
            <img src={e.img} width='40' height='40'
                onClick={() => handlePickFavourite(idx)} key={idx}
            ></img></Button>
    ));
    const icons = new Leaflet.Icon({
        iconUrl: "./assets/badminton.png",
        iconSize: [30, 30], // size of the icon
    })

    
    // useEffect(() => {
    // async function preferenceFetching() {
    //     const response = await fetch(`/users/get-preferences`, {
    //       method: "POST",
    //       headers: { "Content-type": "application/json" },
    //       body: JSON.stringify({ token: props.token }),
    //     });
    //     const jsonResponse = await response.json();
    //     props.savePreferences(jsonResponse.preferences)
    //     fetchEventsAndPlaces(jsonResponse.preferences)
    //   }
    //   preferenceFetching();
  
    // }, []);
  
    // useEffect(() => {
    //   setKilometer(props.preferences.distanceSearch)
    // }, [props.preferences]);
  
    useEffect(() => {
      if (props.preferences.favoriteSports) {
        fetchEventsAndPlaces(props.preferences);
      }
    },[])
  
    async function fetchMyEvents() {
      const resmyevents = await fetch(`/users/get-my-events`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          token: props.token,
        }),
      });
      const resultJson = await resmyevents.json();
      if (resultJson.result) setMyEvents(resultJson.events);
    }
  
    const handleCreateEvent = async () => {
      // console.log(dateBackEvent, hourEvent)
      if (!props.preferences) {
        return;
        
      }
  
      const sportSelectedIndex = props.preferences.favoriteSports.findIndex(
        (e) => e.isChosen
      );
      const sportSelected =
        props.preferences.favoriteSports[sportSelectedIndex].id;
  
  
      if (!placeId && !placeLocation.latitude && !placeLocation.longitude) {
        return;
      }
      if (!eventTitle) {
        return;
      }
      const res = await fetch(`/events/create-event`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          token: props.token,
          title: eventTitle,
        //   time: timeEvent,
        //   date: dateEvent,
          address: placeAddress,
          placeId,
          handiSport: isEventHandi,
          mix: isEventMixed,
          location: { lat: placeLocation.latitude, lon: placeLocation.longitude },
          privateEvent: isEventPrivate,
          sport: sportSelected,
        }),
      });
      const resJson = await res.json();
      if (resJson.result) {
        setVisible(!visible);
        // setDateEvent("../../....");
        // setTimeEvent(".. : ..");
        setIsEventMixed(false);
        setIsEventPrivate(false);
        setIsEventHandi(false);
        setEventTitle("");
        setPlaceLocation({ latitude: null, longitude: null });
        setPlaceId(null);
        if (props.preferences.favoriteSports) {
          fetchEventsAndPlaces(props.preferences);
        }
      }
    };

    const fetchEventsAndPlaces = async (prefs) => {

        const sportsSelected = prefs.favoriteSports.filter((e) => e.isPicked);

        const res = await fetch(`/get-events`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                sportsSelected,
                // distancePreference: prefs.distanceSearch ? prefs.distanceSearch : 10,
                userLocation: { lat: currentLatitude, lon: currentLongitude },
                isOnMap: true,
            }),
        });

        const res2 = await fetch(`/get-places`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                sportsSelected,
                // distancePreference: prefs.distanceSearch ? prefs.distanceSearch : 10,
                userLocation: { lat: currentLatitude, lon: currentLongitude },
            }),
        });
        const res2Json = await res2.json();
        if (res2Json.result) setPlaces(res2Json.places);
    }

    return (
        <div>
            <nav>

                <Menu style={{ textAlign: 'center', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', backgroundColor: "#F4B223" }} mode="horizontal" >
                    <img src='./assets/logosplace.png' style={{ width: 150, height: 50, alignSelf: 'flex-start' }}></img>

                    <Menu.Item style={{ width: 800 }}>
                    </Menu.Item>

                    <Menu.Item key="test" style={{ textAlign: 'center', alignItems: 'flex-end' }}>
                        <Button onClick={toggleOverlayEvent}
                            style={{
                                borderRadius: 20,
                                backgroundColor: "#F4B223",
                                borderWidth: 2,
                                borderColor: 'white',
                                color: 'white',
                                margin: 10,
                                marginTop: 10
                            }}
                        >Créer un évènement</Button>
                    </Menu.Item>
                    <Menu.Item key="test" style={{ textAlign: 'center', alignItems: 'flex-end' }}>
                        <Link to="/" ><Button style={{
                            borderRadius: 20,
                            backgroundColor: "white",
                            outlineColor: "#F4B223",
                            color: '#F4B223',
                            marginTop: 10
                        }}>Logout</Button>
                        </Link>
                    </Menu.Item>

                </Menu>
            </nav>


            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', position: 'inherit' }}>
                <MapContainer style={{ width: 850, height: 620 }} center={[48.866667, 2.333333]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[48.866667, 2.333333]}
                        icon={icons} >
                        <Popup>
                            MARKER
                        </Popup>
                    </Marker>

                </MapContainer>


                <div style={{ marginRight: 25, width: 500 }}>
                    <text style={{ fontWeight: 'bold', fontSize: 18 }}>Filtre les sports qui t'intèressent </text>
                    <div>
                        {filterSportFavourite}
                    </div>
                    <div className='scrollable'>

                        <Card style={{
                            borderRadius: 30,
                            backgroundColor: "#BFDFEC",
                            margin: 3
                        }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    alignSelf: 'center'
                                }}
                            >
                                <text style={{ fontWeight: 'bold', fontSize: 18 }}>Plouf dans la Seine </text>
                                <img
                                    style={{ width: 100, height: 100, borderRadius: 50 }}
                                    // src="./assets/football.png"
                                //   src={
                                //     sportAssets.find((object) => sportName === object.name).img
                                //   }
                                />

                            </div>

                            <text>Le 14/02/2021 à 11h20</text>
                            <div style={{ display: 'flex', marginBottom: 15 }}>

                                <text>Adresse : </text>
                                <text> 20 rue de Frescaty, Montigny les Metz </text>

                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'stretch' }}>
                                <text >
                                    {" "}
                  Adapté Handisport : Oui
                </text>
                                <text >
                                    {" "}
                  Evenement Mixte : Non
                </text>
                            </div>

                        </Card> <Card style={{
                            borderRadius: 30,
                            backgroundColor: "#BFDFEC",
                            margin: 3
                        }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    alignSelf: 'center'
                                }}
                            >
                                <text style={{ fontWeight: 'bold', fontSize: 18 }}>Plouf dans la Seine </text>
                                <img
                                    style={{ width: 100, height: 100, borderRadius: 50 }}
                                    // src="./assets/football.png"
                                //   src={
                                //     sportAssets.find((object) => sportName === object.name).img
                                //   }
                                />

                            </div>

                            <text>Le 14/02/2021 à 11h20</text>
                            <div style={{ display: 'flex', marginBottom: 15 }}>

                                <text>Adresse : </text>
                                <text> 20 rue de Frescaty, Montigny les Metz </text>

                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'stretch' }}>
                                <text >
                                    {" "}
                  Adapté Handisport : Oui
                </text>
                                <text >
                                    {" "}
                  Evenement Mixte : Non
                </text>
                            </div>

                        </Card>


                        <Card style={{
                            borderRadius: 30,
                            backgroundColor: "#BFDFEC",
                            margin: 3
                        }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    alignSelf: 'center'
                                }}
                            >
                                <text style={{ fontWeight: 'bold', fontSize: 18 }}>Plouf dans la Seine </text>
                                <img
                                    style={{ width: 100, height: 100, borderRadius: 50 }}
                                    // src="./assets/football.png"
                                //   src={
                                //     sportAssets.find((object) => sportName === object.name).img
                                //   }
                                />

                            </div>

                            <text>Le 14/02/2021 à 11h20</text>
                            <div style={{ display: 'flex', marginBottom: 15 }}>

                                <text>Adresse : </text>
                                <text> 20 rue de Frescaty, Montigny les Metz </text>

                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'stretch' }}>
                                <text >
                                    {" "}
                  Adapté Handisport : Oui
                </text>
                                <text >
                                    {" "}
                  Evenement Mixte : Non
                </text>
                            </div>

                        </Card>
                    </div>
                    <div ref={ref}>
                        <Overlay
                            show={show}
                            target={target}
                            placement="bottom"
                            container={ref.current}
                        >
                            <Popover id="popover-contained" style={{ width: 580 }}>
                                <Popover.Content>
                                    <Card ref={ref} style={{ borderColor: '#F4B223', borderWidth: 3, marginTop: 10 }}>
                                        <text style={{ fontWeight: 'bold', fontSize: 20, }}>Créer un évènement </text>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: "row",
                                                alignItems: 'stretch',
                                                justifyContent: 'space-between',
                                                marginBottom: 15,
                                                marginTop: 30
                                            }}
                                        >

                                            <text > Date et horaire: </text>
                                            <DatePicker
                                                className='react-datepicker'
                                                selected={startDate}
                                                onChange={date => setStartDate(date)}
                                                showTimeSelect
                                                filterTime={filterPassedTime}
                                                dateFormat="dd/MM/yyyy HH:mm"
                                            />

                                            <text  >  Titre de l'événement: </text>
                                            <textarea
                                                style={{
                                                    height: 25,
                                                }}
                                                onChange={text => setEventTitle(text)}

                                            />

                                        </div>

                                        <div
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignSelf: "stretch",
                                                marginBottom: 10,
                                            }}
                                        >
                                            <text >Evènement mixte</text>
                                            {generateEventMix}

                                            <text style={{ marginLeft: 45 }}>Evènement privé</text>
                                            {generatePrivateEvent}
                                        </div>

                                        <div
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignSelf: "stretch",
                                                alignItems: "center",
                                                marginBottom: 10,
                                            }}
                                        >
                                            <text >
                                                Accessible aux handicapés
              </text>
                                            {/* {generateHandisport} */}
                                        </div>

                                        <text>
                                            Sélectionne le sport de la session
            </text>

                                        <div
                                        >
                                            {/* {generateSportFavourite} */}
                                            {/* {props.preferences ? generateSportChosen : null} */}
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-around', marginTop: 5 }}>
                                            <Button
                                                placeholder="Sélectionner un terrain"
                                                style={{
                                                    borderRadius: 20,
                                                    backgroundColor: "#3e3e3e",
                                                    color: 'white',
                                                    width: 200,
                                                }}
                                            >Sélectionner un terrain</Button>
                                            <Button
                                                style={{
                                                    borderRadius: 20,
                                                    backgroundColor: "#3e3e3e",
                                                    color: 'white',
                                                    width: 200,
                                                }}
                                            >Créer mon spot</Button>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button
                                                style={{
                                                    borderRadius: 20,
                                                    backgroundColor: "#F4B223",
                                                    width: 150,
                                                    marginTop: 20,
                                                }}
                                                onClick={handleCreateEvent}
                                            >Confirmer</Button>
                                        </div>

                                    </Card>
                                </Popover.Content>
                            </Popover>
                        </Overlay>
                    </div>
                </div>
            </div>
        </div >
    );
}


function mapStateToProps(state) {
    return { preferences: state.userPreferences, token: state.token };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      savePreferences: function (preferences) {
        dispatch({ type: "savePreferences", preferences });
      },
    };
  }
  
  export default connect(
      mapStateToProps, 
      mapDispatchToProps
      )(MapScreen);