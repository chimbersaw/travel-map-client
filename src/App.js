import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home.js";
import Error from "./components/Error.js";
import CountryClick from "./components/CountryClick.js";
import Profile from "./components/Profile.js";
import Friends from "./components/Friends.js";
import FriendMap from "./components/FriendMap.js";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import Ping from "./components/Ping.js";
import Logout from "./components/Logout.js";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Switch>
                        <Route path="/" component={Home} exact/>
                        <Route path="/map" component={CountryClick} exact/>
                        <Route path="/profile" component={Profile} exact/>
                        <Route path="/friends" component={Friends} exact/>
                        <Route path="/friends/map" component={FriendMap} exact/>
                        <Route path="/registration" component={Register}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/ping" component={Ping}/>
                        <Route path="/logout" component={Logout}/>
                        <Route component={Error}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
