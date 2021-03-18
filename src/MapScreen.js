import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Button, Card, Menu } from 'antd';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';

import 'react-upload-image-gallery/dist/style.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Leaflet from 'leaflet'

import { sportAssets } from "./App";

function MapScreen(props) {

    const [currentLatitude, setCurrentLatitude] = useState(48.866667);
    const [currentLongitude, setCurrentLongitude] = useState(2.333333);
    const [dateEvent, setDateEvent] = useState('')

    const [sportAddress, setSportAddress] = useState('')
    const [sportTime, setSportTime] = useState('')
    const [sportMix, setSportMix] = useState('')
    const [sportHandi, setSportHandi] = useState('')
    const [sportName, setSportName] = useState('')
    const [sportPlace, setSportPlace] = useState('')
    const [sportDistance, setSportDistance] = useState('')
    const [sportTitle, setSportTitle] = useState('')

    const [dateBackEvent, setDateBackEvent] = useState(null)

    const filterPassedTime = time => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        console.log('date', dateEvent)
        return currentDate.getTime() < selectedDate.getTime();
    }

    const [show, setShow] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false)
    const ref = useRef(null);
    const [target, setTarget] = useState(null);

    const [kilometer, setKilometer] = useState(10000);

    const useStyles = makeStyles({
        root: {
            height: 300,
        },
    });

        //Création event mix ou non 
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

        //Overlay pour la création d'event
        const toggleOverlayEvent = (event) => {
            setShow(!show)
            setTarget(event.target);
        }

        //Overlay pour afficher confirmer l'endroit choisi sur la map
        const toggleOverlayPlaceConfirm = (event) => {
            setShowOverlay(!showOverlay)
            setTarget(event.target);
        }

        //const pour choisir si l'event est mix ou non 
        const handleEventMix = (idx) => {
            const copy = [...isEventMixed];
            const oldIdx = copy.findIndex((e) => e.isChosen);
            if (oldIdx != -1) {
                copy[oldIdx].isChosen = !copy[oldIdx].isChosen;
            }
            copy[idx].isChosen = !copy[idx].isChosen;
            setIsEventMixed(copy);
        };

        //générer le bouton surligné lorsque l'utilisateur choisi si l'event est mix
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

        //state si l'event est privé
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

        //const pour choisir si l'event est privé ou non 
        const handleEventPrivate = (idx) => {
            const copy = [...isEventPrivate];
            const oldIdx = copy.findIndex((e) => e.isChosen);
            if (oldIdx != -1) {
                copy[oldIdx].isChosen = !copy[oldIdx].isChosen;
            }
            copy[idx].isChosen = !copy[idx].isChosen;
            setIsEventPrivate(copy);
        };

        //générer le bouton surligné lorsque l'utilisateur choisi si l'event est privé
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
        const [placeAddress, setPlaceAddress] = useState(null);
        const [placeLocation, setPlaceLocation] = useState({
            latitude: null,
            longitude: null,
        });

        const [events, setEvents] = useState([]);
        const [places, setPlaces] = useState([]);
        const [myEvents, setMyEvents] = useState([]);

        // handisport state
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

        //const si choisi de créer event avec handisport
        const handleHandi = (idx) => {
            const copy = [...isEventHandi];
            const oldIdx = copy.findIndex((e) => e.isChosen);
            if (oldIdx != -1) {
                copy[oldIdx].isChosen = !copy[oldIdx].isChosen;
            }
            copy[idx].isChosen = !copy[idx].isChosen;
            setIsEventHandi(copy);
        };

        //générer le bouton surligné lorsque l'utilisateur choisi si l'event est créé avec handisport
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

        //sport state
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
                    <img src={sportAssets.find((obj) => obj.id === e.id).img} width='40' height='40'
                        onClick={() => handleFilterFavourite(idx)} key={idx}
                    ></img></Button>
            ));

        console.log('pref', props.preferences)

        // filter les sports 
        const handlePickFavourite = (idx) => {
            if (!props.preferences) {
                return;
              }
              const copy = { ...props.preferences };
              const copySports = copy.favoriteSports;
              const oldIdx = copySports.findIndex((e) => e.isChosen);
              if (oldIdx != -1) {
                copySports[oldIdx].isChosen = !copySports[oldIdx].isChosen;
              }
              copySports[idx].isChosen = !copySports[idx].isChosen;
              props.savePreferences(copy);
        };

        // bouton surligné pour les sports filtrés
        const generateSportChosen = !props.preferences.favoriteSports
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
                <img src={sportAssets.find((obj) => obj.id === e.id).img}
                    width='40' height='40'
                    onClick={() => handlePickFavourite(idx)} key={idx}
                ></img></Button>
        ));

        //test icon
        const icons = new Leaflet.Icon({
            iconUrl: "./assets/skate.png",
            iconSize: [30, 30],
        })


        const renderEventsMap = () => {
            return (
              events.map((e, idx) => {

                var latitude = e.location.latitude
                var longitude = e.location.longitude
                
                function formattedDate(date) {
                  const yyyy = date.slice(0, 4)
                  const dd = date.slice(8, 10)
                  const mm = date.slice(5, 7);
                  return dd + '/' + mm + '/' + yyyy;
                }
                function formattedHour(date) {
                  const hh = date.slice(11, 13)
                  const min = date.slice(14,16)
                  return hh + 'h' + min;
                }
                if(e.handiSport === false) {
                 var handiSport = 'Non'
                } else {var handiSport = 'Oui'}
                if(e.mix === false) {
                  var mix = 'Non'
                } else {var mix = 'Oui'}
                const relatedSport = sportAssets.find(obj => obj.id === e.sport).img
                return (
                  <Marker
                    key={idx}
                    position={{
                      latitude,
                      longitude,
                    }}
                  >
                    <img src={relatedSport} style={{ height: 35, width: 35, borderWidth: 3, borderColor: '#C280DE', borderRadius: 50 }} />
                    <Popover
                      style={{ width: 200, height: 'auto' }}>
                        <Popover.Title style={{ fontWeight: 'bold', color: '#F4B223', alignSelf: 'center', fontSize: 16, marginBottom: 4 }}> Session : {e.title}</Popover.Title>
                        <Popover.Content>Lieu : {e.address}</Popover.Content>
                        <Popover.Content >Horaire : Le {formattedDate(e.time)} à {formattedHour(e.time)}</Popover.Content>
                        <Popover.Content>Handisport : {handiSport}</Popover.Content>
                        <Popover.Content>Session mixte : {mix}</Popover.Content>
                        </Popover>
                        </Marker>
                )
              })
            )
        
          }
        const renderEventName = (eventList) => {
            function formattedDate(date) {
                const yyyy = date.slice(0, 4)
                const dd = date.slice(8, 10)
                const mm = date.slice(5, 7);
                return dd + '/' + mm + '/' + yyyy;
            }
            function formattedHour(date) {
                const hh = date.slice(11, 13)
                const min = date.slice(14, 16)
                return hh + 'h' + min;
            }
            return (
                eventList.map((e, idx) => {
                    return (
                        <ListItem key={idx}>
                            <ListItemText style={{ fontWeight: 'bold', color: '#F4B223', alignSelf: 'center', fontSize: 16, marginBottom: 4 }}>Session : {e.title}</ListItemText>
                            <ListItemText style={{ alignSelf: 'center' }}>Le {formattedDate(e.time)} à {formattedHour(e.time)}</ListItemText>
                        </ListItem>
                    )
                })
            )
        }

        const renderPlacesSearch = () => {
            return searchedPlaces.map((e, idx) => (
              <Popover
                key={idx}
                bottomDivider
                onClick={() => handleConfirmExistingPlace(idx)}
              >
                <Popover.Title style={{ fontWeight: "600" }}>
                    {e.name}
                  </Popover.Title>
                  <Popover.Content>{e.address}</Popover.Content>
              </Popover>
            ));
          };
        
          console.log('place', places[1].location)

        // render les markeurs avec les différentes places 
        console.log('places', places)
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
                    // var withEvent = { height: 35, width: 35, borderRadius: '50%', borderWidth: 3, borderColor: '#FF00AE' }
                    // var withoutEvent = { height: 35, width: 35, borderRadius: '50%', borderWidth: 3, borderColor: '#00DBFF' }
                    return (
                        <Marker
                            key={idx}
                            position={{latitude,longitude}}
                            icon={iconsport}
                        // style={e.events.length > 0 ? withEvent : withoutEvent}
                        >
                            <Popover
                                style={{ width: 200, height: 'auto' }}>
                                {renderEventName(e.events)}
                                <Popover.Content style={{ fontWeight: 'bold', alignSelf: 'center' }}>{e.name}</Popover.Content>
                                <Popover.Content style={{ alignSelf: 'center', marginBottom: 5 }}>{e.address}</Popover.Content>
                            </Popover>
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
                fetchEventsAndPlaces(jsonResponse.preferences)
            }
            preferenceFetching();

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

        useEffect(() => {
            setKilometer(props.preferences.distanceSearch)
        }, [props.preferences]);

        useEffect(() => {
            if (props.preferences.favoriteSports) {
                fetchEventsAndPlaces(props.preferences);
            }
        }, [])


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
            if (resultJson.result) setMyEvents(resultJson.events);
        }

        const handleCreateEvent = async () => {
            setShow(!show)
            if (!props.preferences) {
                return;
            }


            const sportSelectedIndex = props.preferences.favoriteSports.findIndex(
                (e) => e.isPicked
            );
            const sportSelected =
                props.preferences.favoriteSports[sportSelectedIndex].id;


            if (!placeId && !placeLocation.latitude && !placeLocation.longitude) {
                return;
            }
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
                    handiSport: isEventHandi,
                    mix: isEventMixed,
                    location: { lat: placeLocation.latitude, lon: placeLocation.longitude },
                    privateEvent: isEventPrivate,
                    sport: sportSelected,
                }),
            });
            const resJson = await res.json();
            if (resJson.result) {
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

        const toggleSearchExistingPlace = (bool) => {
            setIsSearchingExistingPlace(!isSearchingExistingPlace);
            if (bool) {
                fetchSearchedPlaces();
            }
        };

        const handleConfirmExistingPlace = (idx) => {
            const { address, location } = searchedPlaces[idx];
            const placeID = searchedPlaces[idx].placeId;
            setPlaceId(placeID);
            setPlaceAddress(address);
            setPlaceLocation({
                latitude: location.latitude,
                longitude: location.longitude,
            });
            toggleSearchExistingPlace(false);
        };

        const changeDistanceSearch = (obj) => {
            if (!props.preferences) {
                return;
            }
            const copy = { ...props.preferences };
            copy.distanceSearch = Math.round(obj.value / 1000);
            props.savePreferences(copy);
        };

        const handleCustomPlace = () => {
            setIsSettingCustomPlace(!isSettingCustomPlace);
        };

        const handleOnRegionChangeComplete = (region) => {
            const { latitude, longitude } = region;
            setPlaceLocation({
                latitude,
                longitude,
            });
        };
        const handleConfirmCustomPlace = async (bool) => {
            if (!bool) {
                const res = await fetch(`/get-address-from-custom`, {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(placeLocation),
                });
                const resJson = await res.json();
                setPlaceAddress(resJson.address);
                setIsCustomAddressVisible(!isCustomAddressVisible);
            } else {
                setIsCustomAddressVisible(!isCustomAddressVisible);
                setIsSettingCustomPlace(!isSettingCustomPlace);
            }
        };

        const fetchEventsAndPlaces = async (prefs) => {
            const sportsSelected = prefs.favoriteSports.filter((e) => e.isPicked);

            const res = await fetch(`/get-events`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    sportsSelected,
                    distancePreference: prefs.distanceSearch ? prefs.distanceSearch : 10,
                    userLocation: { lat: currentLatitude, lon: currentLongitude },
                    isOnMap: true,
                }),
            });


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
            console.log('json', res2Json)
            if (res2Json.result) setPlaces(res2Json.places);
        }
        const fetchSearchedPlaces = async () => {
            const sportChosen = props.preferences.favoriteSports.filter(
                (e) => e.isPicked
            );
            if (!sportChosen) {
                return;
            }
            const res = await fetch(`/get-places`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    sportsSelected: sportChosen,
                    distancePreference: 20, //TBC
                    userLocation: { lat: currentLatitude, lon: currentLongitude },
                }),
            });
            const resJson = await res.json();
            if (resJson.result) {
                setSearchedPlaces(resJson.places);
            }
        };

        const mapStylewithoutpoi = [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "poi.sports_complex",
              stylers: [
                {
                  color: "#fab223",
                },
              ],
            },
            {
              featureType: "poi.sports_complex",
              elementType: "labels",
              stylers: [
                {
                  color: "#000000",
                },
                {
                  visibility: "on",
                },
                {
                  weight: 1,
                },
              ],
            },
            {
              featureType: "poi.sports_complex",
              elementType: "labels.text",
              stylers: [
                {
                  color: "#2a3234",
                },
                {
                  visibility: "on",
                },
                {
                  weight: 0.5,
                },
              ],
            },
          ];
        
          const showDetails = (
            address,
            time,
            mix,
            sportHandi,
            sportName,
            sportPlace,
            distance,
            title,
            image
          ) => {
            setSportAddress(address);
            setSportTime(time);
            setSportMix(mix);
            setSportHandi(sportHandi);
            setSportName(sportName);
            setSportPlace(sportPlace);
            setSportDistance(distance);
            setSportTitle(title);
          };
        
          var showEvent = myEvents.map((e, i) => {
            function formattedDate(date) {
              const yyyy = date.slice(0, 4);
              const dd = date.slice(8, 10);
              const mm = date.slice(5, 7);
              return dd + "/" + mm + "/" + yyyy;
            }
            function formattedHour(date) {
              const hh = date.slice(11, 13);
              const min = date.slice(14, 16);
              return hh + ":" + min;
            }

            if(e.handiSport === false) {
                var handiSport = 'Non'
               } else {var handiSport = 'Oui'}
               if(e.mix === false) {
                 var mix = 'Non'
               } else {var mix = 'Oui'}
        
            var backgroundColor = "white";
            if (e.sportName == "escalade") {
              backgroundColor = "#AAF09B";
            }
            if (e.sportName == "football") {
              backgroundColor = "#BFDFEC";
            }
            if (e.sportName == "tennis") {
              backgroundColor = "#FFD637";
            }
            if (e.sportName == "rugby") {
              backgroundColor = "#FF9CA7";
            }
            if (e.sportName == "velo") {
              backgroundColor = "#F5A8DB";
            }
            if (e.sportName == "basketball") {
              backgroundColor = "#F1B649";
            }
            if (e.sportName == "badminton") {
              backgroundColor = "#F9C98B";
            }
            if (e.sportName == "fitness") {
              backgroundColor = "#F8C98B";
            }
            if (e.sportName == "natation") {
              backgroundColor = "#69CCE7";
            }
            if (e.sportName == "running") {
              backgroundColor = "#48B0D7";
            }
            if (e.sportName == "skate") {
              backgroundColor = "#977AD6";
            }
            if (e.sportName == "volley") {
              backgroundColor = "#73D3C6";
            }
            if (e.sportName == "squash") {
              backgroundColor = "#B3E8A1";
            }
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
                    <text style={{ fontWeight: 'bold', fontSize: 18 }}>{e.title} </text>
                    <img
                        style={{ width: 100, height: 100, borderRadius: 50 }}

                      src={
                        sportAssets.find((object) => sportName === object.name).img
                      }
                    />

                </div>

                <text>Le {formattedDate(e.time)} à {formattedHour(e.time)}</text>
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

            </Card>})
        

        const classes = useStyles();
        return (
            <div>
                <nav>

                    <Menu style={{ textAlign: 'center', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', backgroundColor: "#F4B223" }} mode="horizontal" >
                        <img src='./assets/logosplace.png' style={{ width: 150, height: 50, alignSelf: 'flex-start' }}></img>

                        <Menu.Item style={{ width: 800 }}>
                        </Menu.Item>

                        <Menu.Item key="test" style={{ textAlign: 'center', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                            </div>
                            {isSettingCustomPlace ? (
                                <Overlay
                                    show={showOverlay}
                                    target={target}
                                    placement="auto"
                                    container={ref.current}>
                                    <Popover style={{ flex: 1, flexDirection: "row"}}>
                                    <Popover.Content>
                                            <Button
                                                style={{
                                                    borderRadius: 20,
                                                    backgroundColor: "white",
                                                    width: 150,
                                                    marginLeft: 15,
                                                }}
                                                onClick={handleCustomPlace}
                                            >Annuler</Button>
                                            <Button
                                                style={{
                                                    backgroundColor: "#F4B223",
                                                    width: 150,
                                                    borderRadius: 20,
                                                    borderColor: "#2a3234",
                                                }}
                                                onClick={() => handleConfirmCustomPlace(false)}
                                            >Confirmer</Button>
                                            </Popover.Content>
                                    </Popover>
                                </Overlay>
                            ) : (
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
                            )}
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
                        {/* {events.length > 0 ? renderEventsMap() : null} */}
                        {/* {places.length > 0 ? renderPlacesMap() : null} */}
                        {searchedPlaces.length > 0 ? renderPlacesSearch() : null}
                    </MapContainer>


                    <div style={{ marginRight: 25, width: 500 }}>
                        <text style={{ fontWeight: 'bold', fontSize: 18 }}>Filtre des sports </text>
                        <div >
                            {filterSportFavourite}
                            <Button onClick={() => handleConfirmFilters()}>Confirmer</Button>
                    <div>
                        <text style={{ fontWeight: 'bold', fontSize: 18 }}>Distance de recherche </text></div>
                            <React.Fragment>
                            <div className={classes.root}>
                            <Slider
                                getAriaValue={props.preferences.distanceSearch * 1000}
                                defaultValue={0}
                                aria-labelledby="vertical-slider"
                                valueLabelDisplay="auto"
                                step={0.1}
                                max={30}
                                style={{ width: 500, height: 40, color:'#F4B223' }}
                                onChangeCommitted={(v) => changeDistanceSearch({ value: v })}
                                onChange={(v) => setKilometer(v / 1000)}
                            />
                            </div>
                            </React.Fragment>
                            
                        </div>
                        <div className='scrollable'>

                        {showEvent} 
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
                                    src="./assets/football.png"
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
                                                    selected={dateEvent}
                                                    onChange={date => setDateEvent(date)}
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
                                                {generateHandisport}
                                            </div>

                                            <text>
                                                Sélectionne le sport de la session
            </text>

                                            <div
                                            >
                                                {props.preferences ? generateSportChosen : null}
                                            </div>


                                            <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-around', marginTop: 5 }}>
                                                <Button
                                                    onClick={toggleOverlayPlaceConfirm}
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
                                                    onClick={() => handleCustomPlace()}
                                                >Créer mon spot</Button>
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
