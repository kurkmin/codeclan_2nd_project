import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from "styled-components";

import Footer from "../components/elements/Footer";
import Header from "../components/elements/Header";
import Homepage from "./Homepage";
import SolarSystemContainer from "./SolarSystemContainer";
import StatisticsContainer from "./StatisticsContainer";
import QuizContainer from "./QuizContainer";

const MainContainer = () => {

    const [planets, setPlanets] = useState([
        { name: 'mercury' },
        { name: 'venus' },
        { name: 'earth' },
        { name: 'mars' },
        { name: 'jupiter' },
        { name: 'saturn' },
        { name: 'uranus' },
        { name: 'neptune' }
    ])



    const [planetObjects, setPlanetObjects] = useState([]);
    const [planet, setPlanet] = useState([]);


    const frenchAPI = 'https://api.le-systeme-solaire.net/rest/bodies/'
    const nasaImages = 'https://images-api.nasa.gov/search?description='

    const getFrenchPlanets = async () => {
        
        const promises = planets.map(planet => {
            return fetch(frenchAPI + planet.name)
            .then(res => res.json())
            .then(updatedPlanet => {
                fetch(nasaImages + updatedPlanet.englishName)
                .then(res => res.json())
                .then(data => {
                    updatedPlanet.imageOne = data.collection.items[8];
                    // updatedPlanet.description = data.collection.items;
                })
                return updatedPlanet;
            })       
        })
        const newPlanets = await Promise.all(promises);
        setPlanetObjects(newPlanets);
    }

    useEffect(() => {
        getFrenchPlanets()
    }, [])

    const getSelectedPlanet = (id) => {
        const selectedPlanet = planetObjects[id];
        setPlanet(selectedPlanet);
    }

    // users api imported from local database 

    const [users, setUsers] = useState([])
    const [user, setUser] = useState(users[0])

    const getUsers = () => {
        fetch("http://localhost:9000/api/users")
            .then(res => res.json())
            .then(data => setUsers(data))
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="wrapper">
            <Router>
                {
                    window.location.pathname !== '/' ? <Header users={users} /> : null
                }
                <Routes>
                    <Route
                        path="/"
                        element={<Homepage />}
                    />
                    <Route
                        path="/explore"
                        element={<SolarSystemContainer planets={planetObjects} planet={planet} getSelectedPlanet={getSelectedPlanet} user={user}/>}
                    />
                    <Route
                        path="/quizzes"
                        element={<QuizContainer planets={planetObjects} planet={planet} getSelectedPlanet={getSelectedPlanet} />}
                    />
                    <Route
                        path="/statistics"
                        element={<StatisticsContainer planets={planetObjects} users={users}/>}
                    />
                    {/* 404 route */}
                </Routes>
                {
                    window.location.pathname!=='/' ? <Footer users={users} /> : null
                }
            </Router>
        </div>
    )
}


export default MainContainer;