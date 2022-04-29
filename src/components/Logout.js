import React from "react";
import "../css/Background.scss";
import formStyle from "../css/Form.module.scss";
import Sidebar from "./Sidebar.js";

const axios = require("axios").default;
const LOGOUT_PATH = "logout";
const SERVER_LOGOUT_URL = process.env.REACT_APP_SERVER_URL + LOGOUT_PATH;

export default class Logout extends React.Component {
    logout = () => {
        axios.get(SERVER_LOGOUT_URL, {
            withCredentials: true
        }).then(result => {
            console.log("Ok!");
            console.log(result);
            alert(result.data);
            window.open("/", "_self");
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    render() {
        return (
            <div className="Logout">
                <Sidebar/>
                <div id="bg"/>
                <div className={formStyle.form}>
                    <button
                        className={formStyle.btn}
                        onClick={this.logout}
                    >logout
                    </button>
                    <br/><br/>
                </div>
            </div>
        );
    }
}
