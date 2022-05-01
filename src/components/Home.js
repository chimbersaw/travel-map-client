import React from "react";
import {NavLink} from "react-router-dom";
import "../css/Background.scss";
import styles from "../css/Home.module.scss";
import Sidebar from "./Sidebar.js";
import {health} from "./Ping";

export default class Home extends React.Component {
    render() {
        health().then(ignored => null)
        return (
            <div className="Home">
                <Sidebar/>
                <div id="bg"/>
                <h1 className={styles.header}>Travel map</h1>
                <NavLink className={styles.link} to="/login">
                    <button className={styles.loginBtn}>
                        Login
                    </button>
                </NavLink>
                <NavLink className={styles.link} to="/registration">
                    <button className={styles.registerBtn}>
                        Register
                    </button>
                </NavLink>
            </div>
        );
    }
}
