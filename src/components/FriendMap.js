import React from "react";
import YandexMap from "./YandexMap.js";
import Cities from "./FriendCities.js";
import {Redirect} from "react-router";
import {Button, Modal} from "react-bootstrap";
import Sidebar from "./Sidebar.js";
import styles from "../css/Map.module.scss";

const axios = require("axios").default;
const VISITED_COUNTRIES_PATH = "api/user/friends/countries";
const DESIRED_COUNTRIES_PATH = VISITED_COUNTRIES_PATH + "/desired";
const COMMON_VISITED_COUNTRIES_PATH = VISITED_COUNTRIES_PATH + "/common";
const COMMON_DESIRED_COUNTRIES_PATH = COMMON_VISITED_COUNTRIES_PATH + "/desired";
const SERVER_VISITED_COUNTRIES_URL = process.env.REACT_APP_SERVER_URL + VISITED_COUNTRIES_PATH;
const SERVER_DESIRED_COUNTRIES_URL = process.env.REACT_APP_SERVER_URL + DESIRED_COUNTRIES_PATH;
const SERVER_COMMON_VISITED_COUNTRIES_URL = process.env.REACT_APP_SERVER_URL + COMMON_VISITED_COUNTRIES_PATH;
const SERVER_COMMON_DESIRED_COUNTRIES_URL = process.env.REACT_APP_SERVER_URL + COMMON_DESIRED_COUNTRIES_PATH;

const DEFAULT_OPTIONS = {
    type: "DEFAULT",
    fillColor: "#ffffff",
    fillOpacity: 0.0,
    visited: false
};

const VISITED_OPTIONS = {
    type: "VISITED",
    fillColor: "#fb6c3f",
    fillOpacity: 0.8,
    visited: true
};

const COMMON_VISITED_OPTIONS = {
    type: "COMMON_VISITED",
    fillColor: "#b65def",
    fillOpacity: 0.8,
    visited: true
};

const DESIRED_OPTIONS = {
    type: "DESIRED",
    fillColor: "#90ee90",
    fillOpacity: 0.8,
    visited: false
};

const COMMON_DESIRED_OPTIONS = {
    type: "COMMON_DESIRED",
    fillColor: "#1a50ff",
    fillOpacity: 0.8,
    visited: false
};

const HIGHLIGHT_OPTIONS = {
    type: "HIGHLIGHT",
    fillColor: "#f5ab94",
    fillOpacity: 0.6,
    visited: false
};

export default class CountryClick extends React.Component {
    constructor(props) {
        super(props);

        this.visitedISO = [];
        this.commonVisitedISO = [];
        this.desiredISO = [];
        this.commonDesiredISO = [];
        this.targetCountry = null;
        this.state = {
            friendName: new URL(window.location.href).searchParams.get("friendName"),
            waitForServer: true,
            loggedIn: false,
            showModal: false,
            targetCountryName: "",
            targetCountryVisited: false
        };
    }

    targetVisited = target => {
        return target ? target.options.get("visited") : false;
    };

    targetDesired = target => {
        const type = target.options.get("type");
        return target ? type === "DESIRED" || type === "COMMON_DESIRED" : false;
    };

    targetName = target => {
        return target ? target.properties._data.name : "";
    };

    enterCountry = event => {
        const target = event.get("target");
        if (!this.targetVisited(target) && !this.targetDesired(target)) {
            target.options.set(HIGHLIGHT_OPTIONS);
        }
    };

    leaveCountry = event => {
        const target = event.get("target");
        if (!this.targetVisited(target) && !this.targetDesired(target)) {
            target.options.set(DEFAULT_OPTIONS);
        }
    };

    clickOnCountry = event => {
        this.targetCountry = event.get("target");
        if (this.targetVisited(this.targetCountry)) {
            this.setState({
                showModal: true,
                targetCountryName: this.targetName(this.targetCountry),
                targetCountryVisited: this.targetVisited(this.targetCountry)
            });
        }
    };

    async getVisitedCountries() {
        let visitedCountries = null;
        await axios.post(SERVER_VISITED_COUNTRIES_URL, {
            friendName: this.state.friendName
        }, {
            withCredentials: true
        }).catch(() => {
            window.open("/friends", "_self");
        }).then(result => {
            visitedCountries = result.data;
        });
        return visitedCountries;
    };

    async getCommonVisitedCountries() {
        let commonVisitedCountries = null;
        await axios.post(SERVER_COMMON_VISITED_COUNTRIES_URL, {
            friendName: this.state.friendName
        }, {
            withCredentials: true
        }).catch(() => {
            window.open("/friends", "_self");
        }).then(result => {
            commonVisitedCountries = result.data;
        });
        return commonVisitedCountries;
    };

    async getDesiredCountries() {
        let desiredCountries = null;
        await axios.post(SERVER_DESIRED_COUNTRIES_URL, {
            friendName: this.state.friendName
        }, {
            withCredentials: true
        }).catch(() => {
            window.open("/friends", "_self");
        }).then(result => {
            desiredCountries = result.data;
        });
        return desiredCountries;
    }

    async getCommonDesiredCountries() {
        let commonDesiredCountries = null;
        await axios.post(SERVER_COMMON_DESIRED_COUNTRIES_URL, {
            friendName: this.state.friendName
        }, {
            withCredentials: true
        }).catch(() => {
            window.open("/friends", "_self");
        }).then(result => {
            commonDesiredCountries = result.data;
        });
        return commonDesiredCountries;
    }

    handleModalClose = () => this.setState({
        showModal: false
    });

    componentDidMount() {
        this.getVisitedCountries().then(visitedCountries => {
            this.getCommonVisitedCountries().then(commonVisitedCountries => {
                this.getDesiredCountries().then(desiredCountries => {
                    this.getCommonDesiredCountries().then(commonDesiredCountries => {
                        for (const country of visitedCountries) {
                            this.visitedISO.push(country.iso);
                        }
                        for (const country of commonVisitedCountries) {
                            this.commonVisitedISO.push(country.iso);
                        }
                        for (const country of desiredCountries) {
                            this.desiredISO.push(country.iso);
                        }
                        for (const country of commonDesiredCountries) {
                            this.commonDesiredISO.push(country.iso);
                        }
                        this.setState({
                            waitForServer: false,
                            loggedIn: true
                        });
                    });
                });
            });
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                this.setState({
                    waitForServer: false,
                    loggedIn: false
                });
            } else {
                console.log("Error occurred!");
                console.log(error);
            }
        });
    }

    render() {
        if (this.state.waitForServer) return <span>Loading map...</span>;
        if (!this.state.loggedIn) return <Redirect to="/login"/>;

        return (
            <div className="Map">
                <Sidebar/>
                <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.targetCountryName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.targetCountryVisited ?
                            <Cities
                                target={this.targetCountry}
                                friendName={this.state.friendName}
                            /> : null}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className={styles.bigLegend}>
                    Common visited: <div className={styles.boxCommonVisited}/><br/>
                    Other visited: <div className={styles.boxVisited}/><br/>
                    Common desired: <div className={styles.boxCommonDesired}/><br/>
                    Other desired: <div className={styles.boxDesired}/>
                </div>
                <YandexMap
                    enterCountry={this.enterCountry}
                    leaveCountry={this.leaveCountry}
                    clickOnCountry={this.clickOnCountry}
                    visitedISO={this.visitedISO}
                    commonVisitedISO={this.commonVisitedISO}
                    desiredISO={this.desiredISO}
                    commonDesiredISO={this.commonDesiredISO}
                    defaultOptions={DEFAULT_OPTIONS}
                    visitedOptions={VISITED_OPTIONS}
                    commonVisitedOptions={COMMON_VISITED_OPTIONS}
                    desiredOptions={DESIRED_OPTIONS}
                    commonDesiredOptions={COMMON_DESIRED_OPTIONS}
                />
            </div>
        );
    }
}
