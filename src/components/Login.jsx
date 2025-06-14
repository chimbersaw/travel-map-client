import Axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import React from "react";
import {NavLink} from "react-router";
import "../css/Background.scss";
import formStyle from "../css/Form.module.scss";
import styles from "../css/Registration.module.scss";
import Sidebar from "./Sidebar.jsx";

const LOGIN_PATH = "api/auth/login";
const SERVER_LOGIN_URL = import.meta.env.VITE_SERVER_URL + LOGIN_PATH;

export default class Login extends React.Component {
    defaultFormState = {
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

    login = async () => {
        for (const field in this.state) {
            if (this.state.hasOwnProperty(field)) {
                if (this.state[field] === "") {
                    alert("Please enter your " + field);
                    return;
                }
            }
        }

        await Axios.post(SERVER_LOGIN_URL, {
            username: this.state.username,
            password: this.state.password
        }, {
            withCredentials: true,
        }).then(result => {
            console.log("Ok!");
            console.log(result);
            alert(result.data);
            window.open("/map", "_self");
            this.setState(this.defaultFormState);
        }).catch(error => {
            if (error.response) {
                if (error.response.status === 401) {
                    alert("Username or password is incorrect!");
                } else {
                    console.log("Error occurred!");
                    console.log(error);
                }
            }
        });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.login();
        }
    };

    render() {
        return (
            <div className="Login">
                <Sidebar/>
                <div id="bg"/>
                <div className={formStyle.form}>
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
                        value="Login"
                        onClick={this.login}
                    />
                    <br/>
                    <p className={styles.txt}>
                        Not registered yet?
                    </p>
                    <NavLink className={styles.toLogin} to="/registration">
                        Register
                    </NavLink>
                </div>
            </div>
        );
    }
}
