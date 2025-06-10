import Axios from "axios";
import React from "react";
import "../css/Background.scss";
import formStyle from "../css/Form.module.scss";
import Sidebar from "./Sidebar.jsx";

const PING_PATH = "api/ping";
const AUTH_PING_PATH = "api/user/ping";
const SERVER_PING_URL = import.meta.env.VITE_SERVER_URL + PING_PATH;
const SERVER_AUTH_PING_URL = import.meta.env.VITE_SERVER_URL + AUTH_PING_PATH;

export async function ping() {
    let ping = null;
    await Axios.get(SERVER_PING_URL).then(result => {
        ping = result.data;
    }).catch(error => {
        ping = error;
    });
    return ping;
}

export async function authPing() {
    let authPing = null;
    await Axios.get(SERVER_AUTH_PING_URL, {
        withCredentials: true
    }).then(result => {
        authPing = result.data;
    });
    return authPing;
}

export default class Ping extends React.Component {
    getAuthPing = () => {
        authPing().then(result => {
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

    getPing = () => {
        ping().then(result => {
            alert(result);
        });
    };

    render() {
        return (
            <div className="Ping">
                <Sidebar/>
                <div id="bg"/>
                <div className={formStyle.form}>
                    <button className={formStyle.btn} onClick={this.getPing}>
                        ping
                    </button>
                    <br/><br/>
                    <button className={formStyle.btn} onClick={this.getAuthPing}>
                        auth
                    </button>
                </div>
            </div>
        );
    }
}
