import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Error from "./components/Error.js";
import FriendMap from "./components/FriendMap.js";
import Friends from "./components/Friends.js";
import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Logout from "./components/Logout.js";
import Map from "./components/Map.js";
import Ping from "./components/Ping.js";
import Profile from "./components/Profile.js";
import Registration from "./components/Registration.js";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>} exact/>
                    <Route path="/map" element={<Map/>} exact/>
                    <Route path="/profile" element={<Profile/>} exact/>
                    <Route path="/friends" element={<Friends/>} exact/>
                    <Route path="/friends/map" element={<FriendMap/>} exact/>
                    <Route path="/registration" element={<Registration/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/ping" element={<Ping/>}/>
                    <Route path="/logout" element={<Logout/>}/>
                    <Route component={Error}/>
                </Routes>
            </BrowserRouter>
        );
    }
}
