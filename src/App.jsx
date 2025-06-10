import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router";
import Error from "./components/Error.jsx";
import FriendMap from "./components/FriendMap.jsx";
import Friends from "./components/Friends.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import Map from "./components/Map.jsx";
import Ping from "./components/Ping.jsx";
import Profile from "./components/Profile.jsx";
import Registration from "./components/Registration.jsx";

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
