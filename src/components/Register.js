import React from "react";
import "../css/Background.scss";
import formStyle from "../css/Form.module.scss";
import styles from "../css/Register.module.scss";
import Sidebar from "./Sidebar.js";
import {NavLink} from "react-router-dom";

const axios = require("axios").default;
const REGISTRATION_PATH = "registration";
const SERVER_REGISTRATION_URL = process.env.REACT_APP_SERVER_URL + REGISTRATION_PATH;

export default class Register extends React.Component {
    defaultFormState = {
        email: "",
        username: "",
        password: ""
    };

    constructor(props) {
        super(props);
        this.state = this.defaultFormState;
    }

    handleChange = id => (event) => {
        const next = event.target.value;
        let newState = {};
        newState[id] = next;
        this.setState(newState);
    };

    register = () => {
        for (const field in this.state) {
            if (this.state.hasOwnProperty(field)) {
                if (this.state[field] === "") {
                    alert("Please enter your " + field);
                    return;
                }
            }
        }

        axios.post(SERVER_REGISTRATION_URL, {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        }).then(result => {
            console.log("Ok!");
            console.log(result);
            alert(result.data);
            this.setState(this.defaultFormState);
            window.open("/login", "_self");
        }).catch(error => {
            if (error.response) {
                alert(error.response.data);
            }
        });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.register();
        }
    };

    render() {
        return (
            <div className="Register">
                <Sidebar/>
                <div id="bg"/>
                <div className={formStyle.form}>
                    <input
                        className={formStyle.input}
                        maxLength="100"
                        type="text"
                        placeholder="Enter your email"
                        value={this.state.email}
                        onChange={this.handleChange("email")}
                        onKeyDown={this.handleKeyDown}
                    />
                    <input
                        className={formStyle.input}
                        maxLength="20"
                        type="text"
                        placeholder="Enter your username"
                        value={this.state.username}
                        onChange={this.handleChange("username")}
                        onKeyDown={this.handleKeyDown}
                    />
                    <input
                        className={formStyle.input}
                        maxLength="100"
                        type="password"
                        placeholder="Enter your password"
                        value={this.state.password}
                        onChange={this.handleChange("password")}
                        onKeyDown={this.handleKeyDown}
                    />
                    <input
                        className={formStyle.btn}
                        type="submit"
                        value="Register"
                        onClick={this.register}
                    />
                    <p className={styles.txt}>
                        Already registered?
                    </p>
                    <NavLink className={styles.toLogin} to="/login">
                        Login
                    </NavLink>
                </div>
            </div>
        );
    }
}
