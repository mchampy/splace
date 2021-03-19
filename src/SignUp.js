import React, { useState, useEffect } from 'react';
import './App.css';
import { Input, Button, Card } from 'antd';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Logo from "./assets/logosplace.png";
import DatePicker from "react-datepicker";

import { sportAssets } from "./App";

import { CloudinaryContext, Image } from "cloudinary-react";
import { fetchPhotos, openUploadWidget, url } from "./CloudinaryService";

import 'react-upload-image-gallery/dist/style.css'

import "react-datepicker/dist/react-datepicker.css";


function SignUp(props) {

    const [name, setName] = useState("");
    const [forname, setForname] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");


    const [anniversaryDate, setAnniversaryDate] = useState(new Date());
    const [descriptionUser, setDescriptionUser] = useState("");
    const [handisport, setHandisport] = useState([
        {
            name: "Oui",
            isChosen: false,
            bool: true
        },
        {
            name: "Non",
            isChosen: false,
            bool: false
        },
    ]);


// Handisport ou non 
    const handleHandi = (idx) => {
        const copy = [...handisport];
        const oldIdx = copy.findIndex((e) => e.isChosen);
        if (oldIdx != -1) {
            copy[oldIdx].isChosen = !copy[oldIdx].isChosen;
        }
        copy[idx].isChosen = !copy[idx].isChosen;
        setHandisport(copy);
    };

    const generateHandisport = handisport.map((e, idx) => (
        <Button
            onClick={() => handleHandi(idx)}
            key={idx}
            style={
                handisport[idx].isChosen
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

// Choix des sports favoris
    const handlePickFavourite = (idx) => {
        const copy = [...favourite];
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
                        margin: 8,
                        paddingLeft: 3,
                        paddingTop: 3,
                        width: 50,
                        height: 50,
                    }
                    : {
                        borderColor: "transparent",
                        borderWidth: 0,
                        borderRadius: 30,
                        margin: 8,
                        paddingLeft: 3,
                        paddingTop: 3,
                        width: 50,
                        height: 50,
                    }}>
            <img src={e.img} width='40' height='40'
                onClick={() => handlePickFavourite(idx)} key={idx}
            ></img></Button>
    ));

    const [listErrorsSignup, setErrorsSignup] = useState([]);

    const [userExists, setUserExists] = useState(false);

    const [images, setImages] = useState([])

    useEffect(() => {
        fetchPhotos("image", setImages);
    }, [])

    const beginUpload = tag => {
        const uploadOptions = {
            cloudName: "dj7ntrfrj",
            tags: [tag, 'anImage'],
            uploadPreset: "splace"
        };
        openUploadWidget(uploadOptions, (error, photos) => {
            if (!error) {
                console.log(photos);
                if (photos.event === 'success') {
                    setImages([...images, photos.info.public_id])
                }
            } else {
                console.log(error);
            }
        })
    }


    useEffect(() => {
        console.log('voici limage a lactualisation', images)
    }, [images]);

    const [gender, setGender] = useState([
        {
            name: "Femme",
            isChosen: false,
        },
        {
            name: "Homme",
            isChosen: false,
        },
        {
            name: "Autre",
            isChosen: false,
        },
    ]);

    // Choix d'un seul sexe 
    const handleGender = (idx) => {
        const copy = [...gender];
        const oldIdx = copy.findIndex((e) => e.isChosen);
        if (oldIdx != -1) {
            copy[oldIdx].isChosen = !copy[oldIdx].isChosen;
        }
        copy[idx].isChosen = !copy[idx].isChosen;
        setGender(copy);
    };

    const generateGender = gender.map((e, idx) => (
        <Button
            onClick={() => handleGender(idx)}
            key={idx}
            style={
                gender[idx].isChosen
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

    // Afficher l'âge quand la date de naissance est renseignée
    function getAge(birthDate) {
        var birthDate = anniversaryDate
        var today = new Date();
        var birthDate = new Date(birthDate);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
            console.log(age);
        return age
    }

    // Envoi des informations au back pour le Sign-Up 
    var signUpToBack = async () => {

        let genderSelected = ''
        if (gender.find(e => e.isChosen)) {
        genderSelected = gender.find(e => e.isChosen).name}
        
        let handiSelected = ''
        if (handisport.find(e => e.isChosen)) {
        handiSelected = handisport.find(e => e.isChosen).bool}
        
        console.log("envoi user vers le back");
        const data = await fetch(`/users/sign-up`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: `${forname + ' ' + name}`,
                email,
                password,
                favoriteSports: favourite,
                bio: descriptionUser,
                gender: genderSelected,
                handiSport: handiSelected,
                birthday: anniversaryDate,
                country: "fr",
                phoneNumber: "065654343",
                profilePicture: images + '.jpg'
            }),
        });

        const body = await data.json();
        console.log("réponse du fetch signup", body);

        if (body.result == true) {
            props.addToken(body.token);
            console.log("log du token signup", body.token);
            setUserExists(true)


        } else {
            setErrorsSignup(body.error);
        }   
    };
  
    if(userExists === false) {

    return (
        <div className="Login-page"
            style={{ backgroundImage: 'linear-gradient(rgba(255,188,62,1), rgba(255,67,67,1))' }}>
            <img src={Logo} style={{ width: '400px', margin: '10px' }} alt='pic' />

            {/* SIGN-UP */}

            <div className="Sign">
                <Card>
                    <div>
                        <text style={{ fontWeight: 'bold', fontSize: 20 }}>CREER UN COMPTE</text>
                    </div>

                    <div>
                        <Input onChange={(e) => setForname(e.target.value)} className="Login-input" placeholder="Prénom" />
                        <Input onChange={(e) => setName(e.target.value)} className="Login-input" placeholder="Nom" />
                        <text>Genre: </text>
                        {generateGender}
                    </div>

                    <div>
                        <Input onChange={(e) => setEmail(e.target.value)} className="Login-input" placeholder="email" />
                        <Input.Password onChange={(e) => setPassword(e.target.value)} className="Login-input" placeholder="password" />
                        <text style={{ marginLeft: 15 }}> Age: </text>
                        <DatePicker
                            className='react-datepicker'
                            placeholderText={getAge() + " ans"}
                            dateFormat="dd/MM/yyyy "
                            showYearDropdown
                            showMonthDropdown
                            onChange={date => setAnniversaryDate(date)} />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'space-around', flexDirection: 'row', marginBottom: 25 }}>
                        <div>
                            <text style={{ marginLeft: 15 }}>Photo de profil : </text>

                            <CloudinaryContext cloudName="dj7ntrfrj">

                                <button onClick={() => beginUpload()}
                                    style={{ width: 80, height: 80, borderRadius: "50%", marginLeft: 20, padding: 0 }}
                                >
                                    {images.map(i => <Image
                                        key={i}
                                        publicId={i}
                                        fetch-format="auto"
                                        quality="auto"
                                        style={{ width: 74, height: 74, borderRadius: "50%" }}
                                    />)} </button>
                            </CloudinaryContext>
                        </div>
                        <div>
                            <text style={{ marginLeft: 15 }}>Description : </text>
                            <div>
                            <Input style={{ width: 400, height: 100 }} onChange={(e) => setDescriptionUser(e.target.value)}/>
                            </div>
                        </div>

                    </div>

                    <text style={{ marginLeft: 15, marginTop: 25 }}>Sports favoris : </text>
                    <div>
                        {generateSportFavourite}
                    </div>
                    <div style={{ marginLeft: 15, marginTop: 15, marginBottom: 15 }}>
                        <text style={{ marginBottom: 10 }}>Handisport : </text>
                        {generateHandisport}
                        </div>

                    <Button className="Button" onClick={signUpToBack()}>Inscription</Button>

                </Card>
            </div>

        </div>
    );
} else {
        return (<Redirect to='/MapScreen' />)
}
}

function mapDispatchToProps(dispatch) {
    return {
      addToken: function (token) {
        dispatch({ type: "addToken", token });
      },
  
    };
  }
  
  function mapStateToProps(state) {
    return { token: state.token }
  }
  
  export default 
  connect(
      mapStateToProps, 
        mapDispatchToProps)
    (SignUp);
