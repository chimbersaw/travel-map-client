import React from "react";
import "../css/Background.scss";
import formStyle from "../css/Form.module.scss";
import Sidebar from "./Sidebar.js";

const axios = require("axios").default;
const PING_PATH = "api/ping";
const HEALTH_PATH = "health";
const SERVER_PING_URL = process.env.REACT_APP_SERVER_URL + PING_PATH;
const SERVER_HEALTH_URL = process.env.REACT_APP_SERVER_URL + HEALTH_PATH;

export async function health() {
    let health = null;
    await axios.get(SERVER_HEALTH_URL).then(result => {
        health = result.data;
    }).catch(error => {
        health = error;
    });
    return health;
}

export async function ping() {
    let ping = null;
    await axios.get(SERVER_PING_URL, {
        withCredentials: true
    }).then(result => {
        ping = result.data;
    });
    return ping;
}

export default class Ping extends React.Component {
    getPing = () => {
        ping().then(result => {
            alert(result);
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                alert("Not logged in");
            } else {
                console.log("Error occurred!");
                console.log(error);
            }
        });
    };

    getHealth = () => {
        health().then(result => {
            alert(result);
        });
    };

    render() {
        return (
            <div className="Ping">
                <Sidebar/>
                <div id="bg"/>
                <div className={formStyle.form}>
                    <button className={formStyle.btn} onClick={this.getHealth}>
                        health
                    </button>
                    <br/><br/>
                    <button className={formStyle.btn} onClick={this.getPing}>
                        ping
                    </button>
                </div>
            </div>
        );
    }
}
