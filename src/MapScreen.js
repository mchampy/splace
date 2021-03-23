import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './App.css';
import { Button, Card, Menu, Input } from 'antd';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'

import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Moment from 'react-moment';

import 'react-upload-image-gallery/dist/style.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Leaflet from 'leaflet'

import { sportAssets } from "./App";

function MapScreen(props) {

    const [dateEvent, setDateEvent] = useState(new Date())
    const [eventTitle, setEventTitle] = useState("");
    const [placeAddress, setPlaceAddress] = useState(null);
    const [places, setPlaces] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [placeId, setPlaceId] = useState(null);
    const [state, setState] = React.useState({
        handisport: false,
        mixed: false,
        private: true,
    });
    

    // switch event changement d'état au clic
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const filterPassedTime = time => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
    }

    // marker draggable
    const useStyles = makeStyles({
        root: {
            height: 300,
        },
    });

    const center = {
        lat: 48.866667,
        lng: 2.333333
    }

    const [position, setPosition] = useState(center)

    const icons = new Leaflet.Icon({
        iconUrl: './assets/logoActive.png',
        iconSize: [30, 35],
    })

    function DraggableMarker() {

        const [draggable, setDraggable] = useState(false)

        const markerRef = useRef(null)
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current
                    console.log('marker', marker)
                
                    if (marker !== null) {
                let markerLatLng = marker.getLatLng()
                if (markerLatLng["lng"] === undefined) {
                    var positionMarker = {lat: markerLatLng["lat"], lng: markerLatLng["lon"]}
                }
                else {
                    var positionMarker = {lat: markerLatLng["lat"], lng: markerLatLng["lng"]}
                }
                        setPosition(positionMarker)
                        console.log('position', position)
                    } handleConfirmCustomPlace()
                },

            }),
            [],
        )

        const toggleDraggable = useCallback(() => {
            setDraggable((d) => !d)
        }, [])

        return (
            <Marker
                icon={icons}
                draggable={draggable}
                eventHandlers={eventHandlers}
                position={position}

                ref={markerRef}>
                <Popup minWidth={90}>
                    <span onClick={toggleDraggable}>
                        {draggable
                            ? 'Bougez-moi'
                            : "Choisir l'emplacement"}
                    </span>
                </Popup>
            </Marker>
        )
    }
    // fin du code markeur draggable

    const handleFetchMyEvent = async () => {
        fetchMyEvents();
    }

    //const pour choisir son sport favori (1 choix)
    const handleFilterFavourite = (idx) => {
        if (!props.preferences) {
            return;
        }
        const copy = { ...props.preferences };
        const copySports = copy.favoriteSports;
        copySports[idx].isPicked = !copySports[idx].isPicked;
        props.savePreferences(copy);
    };

    //générer le bouton surligné lorsque l'utilisateur choisi le sport de l'event créé
    const filterSportFavourite = !props.preferences.favoriteSports
        ? null
        : props.preferences.favoriteSports.map((e, idx) => (
            <Button
                style={
                    e.isPicked
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
                <img src={sportAssets.find(obj => obj.id === e.id).img} width='40' height='40'
                    onClick={() => handleFilterFavourite(idx)} key={idx}
                ></img></Button>
        ));


    const handlePickFavourite = (idx) => {
        if (!props.preferences) {
            return;
        }
        const copy = { ...props.preferences };
        const copySports = copy.favoriteSports;
        const oldIdx = copySports.findIndex((e) => e.isPicked);
        if (oldIdx != -1) {
            copySports[oldIdx].isPicked = !copySports[oldIdx].isPicked;
        }
        copySports[idx].isPicked = !copySports[idx].isPicked;
        props.savePreferences(copy);
    };


    // bouton surligné pour les sports choisis dans creation event
    const generateSportChosen = !props.preferences.favoriteSports
        ? null
        : props.preferences.favoriteSports.map((e, idx) => (
            <Button
                key={idx}
                style={
                    e.isPicked
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
                <img src={sportAssets.find((obj) => obj.id === e.id).img}
                    width='40' height='40'
                    onClick={() => handlePickFavourite(idx)}
                ></img></Button>
        ));

    // style pour le switch dans création event
    const OrangeSwitch = withStyles({
        switchBase: {
            color: '#F4B223',
            '&$checked': {
                color: '#F4B223',
            },
            '&$checked + $track': {
                backgroundColor: '#F4B223',
            },
        },
        checked: {},
        track: {},
    })(Switch);


    // render les markeurs avec les différentes places 
    const renderPlacesMap = () => {
        return (
            places.map((e, idx) => {
                var latitude = e.location.latitude
                var longitude = e.location.longitude
                const relatedSport = sportAssets.find(obj => obj.id === e.sportId).img
                const iconsport = new Leaflet.Icon({
                    iconUrl: relatedSport,
                    iconSize: [30, 30],
                })
                return (
                    <Marker
                        key={idx}
                        position={[latitude, longitude]}
                        icon={iconsport}
                    >
                        <Popup
                            style={{ width: 200, height: 'auto' }}>
                            <div>
                                <text style={{ fontWeight: 'bold', alignSelf: 'center' }}>{e.name}</text>
                            </div>
                            <text style={{ alignSelf: 'center', marginBottom: 5 }}>Adresse : {e.address}</text>
                        </Popup>
                    </Marker>
                )
            })
        )
    }


    // fetch les infos sur user et envoi au back
    useEffect(() => {
        async function preferenceFetching() {
            const response = await fetch(`/users/get-preferences`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ token: props.token }),
            });
            const jsonResponse = await response.json();
            props.savePreferences(jsonResponse.preferences)
            console.log('réponse pref', jsonResponse.preferences)
            fetchEventsAndPlaces(jsonResponse.preferences)
        }
        preferenceFetching();
        fetchMyEvents();
    }, []);


    // sauvegarder les infos du user et envoi au back
    const handleConfirmFilters = async () => {
        if (props.preferences.favoriteSports) {
            await fetch(`/users/save-preferences`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    preferences: props.preferences,
                    token: props.token,
                }),
            });

            fetchEventsAndPlaces(props.preferences)
        }
    };

    // création event et envoi au back
    async function fetchMyEvents() {
        const resmyevents = await fetch(`/users/get-my-events`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                token: props.token,
            }),
        });
        const resultJson = await resmyevents.json();
        console.log('myevents', resultJson)
        if (resultJson.result) setMyEvents(resultJson.events);
    }

    // création event
    const handleCreateEvent = async () => {
        if (!props.preferences) {
            return;
        }
        const sportSelectedIndex = props.preferences.favoriteSports.findIndex(
            (e) => e.isPicked
        );
        const sportSelected = props.preferences.favoriteSports[sportSelectedIndex].id;

        if (!eventTitle) {
            return;
        }
        // envoi création event au back
        const res = await fetch(`/events/create-event`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                token: props.token,
                title: eventTitle,
                date: dateEvent,
                address: placeAddress,
                placeId,
                handiSport: state.handisport,
                mix: state.mixed,
                location: position,
                privateEvent: state.private,
                sport: sportSelected,
            }),
        });
        const resJson = await res.json();
        if (resJson.result) {
            setState(false)
            setEventTitle("");
            if (props.preferences.favoriteSports) {
                fetchEventsAndPlaces(props.preferences);
            }
        }
    };


    // recherche reverse geo avec lat et lon du markeur lorsque create event
    const handleConfirmCustomPlace = async () => {
        const res = await fetch(`/get-address-from-custom`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                latitude: position.lat,
                longitude: position.lng,
            }),
        });
        const resJson = await res.json();
        console.log('resjsonaddres', resJson)
        setPlaceAddress(resJson.address);
    };

    const fetchEventsAndPlaces = async (prefs) => {
        const sportsSelected = prefs.favoriteSports.filter((e) => e.isPicked);

        const res2 = await fetch(`/get-places`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                sportsSelected,
                distancePreference: prefs.distanceSearch ? prefs.distanceSearch : 10,
                userLocation: { lat: 48.866667, lon: 2.333333 },
                token: props.token
            }),
        });
        const res2Json = await res2.json();
        if (res2Json.result) setPlaces(res2Json.places);
    }

    // card de mes events lorsque crées
    var showEvent = myEvents.map((e, i) => {
        if (e.handiSport === false) {
            var handiSport = 'Non'
        } else { var handiSport = 'Oui' }
        if (e.mix === false) {
            var mix = 'Non'
        } else { var mix = 'Oui' }

        var backgroundColor = "white";
        if (e.sportName === "escalade") {
            backgroundColor = "#AAF09B";
        }
        if (e.sportName === "football") {
            backgroundColor = "#BFDFEC";
        }
        if (e.sportName === "tennis") {
            backgroundColor = "#FFD637";
        }
        if (e.sportName === "rugby") {
            backgroundColor = "#FF9CA7";
        }
        if (e.sportName === "velo") {
            backgroundColor = "#F5A8DB";
        }
        if (e.sportName === "basketball") {
            backgroundColor = "#F1B649";
        }
        if (e.sportName === "badminton") {
            backgroundColor = "#F9C98B";
        }
        if (e.sportName === "fitness") {
            backgroundColor = "#F8C98B";
        }
        if (e.sportName === "natation") {
            backgroundColor = "#69CCE7";
        }
        if (e.sportName === "running") {
            backgroundColor = "#48B0D7";
        }
        if (e.sportName === "pilates") {
            backgroundColor = "#48B0D7";
        }
        if (e.sportName === "skate") {
            backgroundColor = "#977AD6";
        }
        if (e.sportName === "volleyball") {
            backgroundColor = "#73D3C6";
        }
        if (e.id === "volleyball") {
            backgroundColor = "#73D3C6";
        }
        if (e.sportName === "squash") {
            backgroundColor = "#B3E8A1";
        }
        return (
            <Card key={i} style={{
                borderRadius: 30,
                backgroundColor: backgroundColor,
                margin: 3
            }} >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignSelf: 'center'
                    }}
                >
                    <text style={{ fontWeight: 'bold', fontSize: 18 }}>{e.title} </text>
                    <img
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                        src={'./assets/' + e.sportName + '.png'}
                    />

                </div>
                <div><span>Le </span>
                    <Moment format="DD/MM/YYYY">{e.time}</Moment>
                    <span> à </span>
                    <Moment format="HH:mm">{e.time}</Moment></div>
                <div style={{ display: 'flex', marginBottom: 15 }}>

                    <text>Adresse : </text>
                    <text> {e.address} </text>

                </div>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'stretch' }}>
                    <text >
                        {" "}
                    Adapté Handisport : {handiSport}
                    </text>
                    <text >

                        Evenement Mixte : {mix}
                    </text>
                </div>

            </Card>)
    })

    // logout
    const handleLogout = async () => {

    }

    return (
        <div>
            <nav>
                <Menu style={{ display: 'flex', flexDirection:'row', alignItems:"center", justifyContent: 'space-between', backgroundColor: "#F4B223" }} mode="horizontal" >
                    <img src='./assets/logosplace.png' style={{ width: 150, height: 50 }}></img>
                    <Menu.Item >
                        <Link to="/"><Button style={{
                            borderRadius: 20,
                            backgroundColor: "white",
                            outlineColor: "#F4B223",
                            color: '#F4B223',
                            marginTop: 10
                        }}
                            onClick={() => handleLogout()}
                        >Déconnexion</Button>
                        </Link>
                    </Menu.Item>
                </Menu>
            </nav>


            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: "100vh" }}>
                <MapContainer style={{ width: '50%', height: "100vh" }} center={[48.866667, 2.333333]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {places.length > 0 ? renderPlacesMap() : null}

                    <DraggableMarker />
                </MapContainer>


                <div style={{ width: '50%', margin: 5, overflowY: 'scroll' }}>
                    <text style={{ fontWeight: 'bold', fontSize: 18 }}>Filtre des sports </text>
                    <div >
                        {filterSportFavourite}
                        <Button style={{
                            borderRadius: '70%',
                            backgroundColor: "white",
                            borderColor: '#F4B223',
                            color: '#F4B223',
                            width: 40,
                            height: 40,
                            padding: 1,
                            margin: 5
                        }}
                            onClick={() => handleConfirmFilters()}>Ok</Button>


                    </div>

                    <Card style={{
                        borderColor: '#F4B223', borderWidth: 3, marginTop: 10
                    }}>
                        <text style={{ fontWeight: 'bold', fontSize: 18 }}>Créer un évènement </text>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: "row",
                                alignItems: 'stretch',
                                marginBottom: 15,
                                marginTop: 20
                            }}
                        >

                            <text style={{
                                marginRight: 10
                            }}> Date et horaire: </text>
                            <DatePicker
                                className='react-datepicker'
                                selected={dateEvent}
                                onChange={date => setDateEvent(date)}
                                showTimeSelect
                                filterTime={filterPassedTime}
                                dateFormat="dd/MM/yyyy HH:mm"
                            />
                        </div>
                        <div>
                            <text >  Titre de l'événement: </text>
                            <Input
                                onChange={(e) => setEventTitle(e.target.value)}
                            />
                        </div>
                        <FormControl component="fieldset">
                            <FormGroup>
                                <FormControlLabel
                                    control={<OrangeSwitch checked={state.handisport} onChange={handleChange} name="handisport" />}
                                    label="Accessible aux handicapés"
                                />
                                <FormControlLabel
                                    control={<OrangeSwitch checked={state.mixed} onChange={handleChange} name="mixed" />}
                                    label="Evènement mixte"
                                />
                                <FormControlLabel
                                    control={<OrangeSwitch checked={state.private} onChange={handleChange} name="private" />}
                                    label="Evènement privé"
                                />
                            </FormGroup>
                        </FormControl>
                        <div>
                            <text>
                                Sélectionne le sport de la session
                                             </text>
                        </div>
                        <div
                        >
                            {generateSportChosen}
                        </div>
                        <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-around', marginTop: 5 }}>
                        </div>
                        <div style={{ flex: 'display', alignContent: 'center' }}>
                            <img src="./assets/logoActive.png" width="20px" style={{ marginRight: 10 }}></img>
                            <text >Clique sur le marqueur de la carte pour définir l'adresse
                                        </text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                            <Button
                                style={{
                                    borderRadius: 20,
                                    backgroundColor: "#F4B223",
                                    color: 'white',
                                    width: 200,
                                }}
                                onClick={() => handleCreateEvent()}>
                                Confirmer</Button>
                        </div>
                    </Card>
                    <Button
                        style={{ width: '100%' }}
                        onClick={() => handleFetchMyEvent()}>
                        <FontAwesomeIcon style={{ width: 20, height: 20 }} icon={faSync}/></Button>

                    <div>
                        <div>
                            {showEvent}
                        </div>
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
        addToken: function (token) {
            dispatch({ type: "addToken", token });
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapScreen);