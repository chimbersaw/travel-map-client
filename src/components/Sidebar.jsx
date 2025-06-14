import React from "react";
import {slide as Menu} from "react-burger-menu";
import {NavLink} from "react-router";
import "../css/Sidebar.scss";
import {authPing} from "./Ping.jsx";

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false
        };
    }

    forceReload = path => () => {
        window.open(path, "_self");
    };

    componentDidMount() {
        authPing().then(() => {
            this.setState({
                loggedIn: true
            });
        }).catch(() => {
            this.setState({
                loggedIn: false
            });
        });
    }

    render() {
        return (
            <Menu width={"280px"} disableAutoFocus>
                <NavLink className="menu-item" to="/">Home</NavLink>
                <NavLink
                    style={{
                        display: !this.state.loggedIn ? "block" : "none"
                    }}
                    className="menu-item"
                    to="/registration"
                >
                    Register
                </NavLink>
                <NavLink
                    style={{
                        display: !this.state.loggedIn ? "block" : "none"
                    }}
                    className="menu-item"
                    to="/login"
                >
                    Login
                </NavLink>
                <NavLink className="menu-item" to="/ping">Ping</NavLink>

                <NavLink
                    style={{
                        display: this.state.loggedIn ? "block" : "none"
                    }}
                    className="menu-item"
                    to="/profile"
                >
                    Profile
                </NavLink>
                <NavLink
                    style={{
                        display: this.state.loggedIn ? "block" : "none"
                    }}
                    className="menu-item"
                    to="/friends"
                >
                    Friends
                </NavLink>
                <NavLink
                    style={{
                        display: this.state.loggedIn ? "block" : "none"
                    }}
                    className="menu-item"
                    to="/map"
                    onClick={this.forceReload("/map")} // idk, it crashes otherwise
                >
                    Map
                </NavLink>
                <NavLink
                    style={{
                        display: this.state.loggedIn ? "block" : "none"
                    }}
                    className="menu-item"
                    to="/logout"
                >
                    Logout
                </NavLink>
            </Menu>
        );
    }
}
