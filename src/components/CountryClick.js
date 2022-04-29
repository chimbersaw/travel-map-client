import React from "react";
import YandexMap from "./YandexMap.js";
import Cities from "./Cities.js";
import {Redirect} from "react-router";
import {Button, Modal} from "react-bootstrap";
import Sidebar from "./Sidebar.js";
import styles from "../css/CountryClick.module.scss";
import mapStyle from "../css/Map.module.scss";

const axios = require("axios").default;
const API_PATH = "api/user";
const VISITED_COUNTRIES_PATH = API_PATH + "/visited_countries";
const DESIRED_COUNTRIES_PATH = API_PATH + "/desired_countries";
const SERVER_VISITED_COUNTRIES_URL = process.env.REACT_APP_SERVER_URL + VISITED_COUNTRIES_PATH;
const SERVER_DESIRED_COUNTRIES_PATH_URL = process.env.REACT_APP_SERVER_URL + DESIRED_COUNTRIES_PATH;

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

const DESIRED_OPTIONS = {
    type: "DESIRED",
    fillColor: "#90ee90",
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
        this.desiredISO = [];
        this.targetCountry = null;
        this.state = {
            waitForServer: true,
            loggedIn: false,
            showModal: false,
            targetCountryName: "",
            targetCountryVisited: false,
            targetCountryDesired: false
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

    targetIso = target => {
        return target ? target.properties._data.iso3166 : "";
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

    visitServer = iso => {
        axios.put(SERVER_VISITED_COUNTRIES_URL, {
            iso: iso
        }, {
            withCredentials: true
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    unvisitServer = iso => {
        axios.delete(SERVER_VISITED_COUNTRIES_URL, {
            data: {
                iso: iso
            },
            withCredentials: true
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    desireServer = iso => {
        axios.put(SERVER_DESIRED_COUNTRIES_PATH_URL, {
            iso: iso
        }, {
            withCredentials: true
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    undesireServer = iso => {
        axios.delete(SERVER_DESIRED_COUNTRIES_PATH_URL, {
            data: {
                iso: iso
            },
            withCredentials: true
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    visitTargetCountry = target => {
        const iso = this.targetIso(target);

        if (this.targetVisited(target)) {
            this.unvisitServer(iso);
            target.options.set(DEFAULT_OPTIONS);
        } else {
            this.visitServer(iso);
            target.options.set(VISITED_OPTIONS);
            this.setState({
                targetCountryDesired: false
            });
        }

        this.setState(prevState => ({
            targetCountryVisited: !prevState.targetCountryVisited
        }));
    };

    desireTargetCountry = target => {
        if (this.targetVisited(target)) return;
        const iso = this.targetIso(target);

        if (this.targetDesired(target)) {
            this.undesireServer(iso);
            target.options.set(DEFAULT_OPTIONS);
        } else {
            this.desireServer(iso);
            target.options.set(DESIRED_OPTIONS);
        }

        this.setState(prevState => ({
            targetCountryDesired: !prevState.targetCountryDesired
        }));
    };

    clickOnCountry = event => {
        this.targetCountry = event.get("target");
        this.setState({
            showModal: true,
            targetCountryName: this.targetName(this.targetCountry),
            targetCountryVisited: this.targetVisited(this.targetCountry),
            targetCountryDesired: this.targetDesired(this.targetCountry)
        });
    };

    async getVisitedCountries() {
        let visitedCountries = null;
        await axios.get(SERVER_VISITED_COUNTRIES_URL, {
            withCredentials: true
        }).then(result => {
            visitedCountries = result.data;
        });
        return visitedCountries;
    };

    async getDesiredCountries() {
        let desiredCountries = null;
        await axios.get(SERVER_DESIRED_COUNTRIES_PATH_URL, {
            withCredentials: true
        }).then(result => {
            desiredCountries = result.data;
        });
        return desiredCountries;
    }

    handleModalClose = () => this.setState({
        showModal: false
    });

    componentDidMount() {
        this.getVisitedCountries().then(visitedCountries => {
            this.getDesiredCountries().then(desiredCountries => {
                for (const country of visitedCountries) {
                    this.visitedISO.push(country.iso);
                }
                for (const country of desiredCountries) {
                    this.desiredISO.push(country.iso);
                }
                this.setState({
                    waitForServer: false,
                    loggedIn: true
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
                        <button
                            className={
                                this.state.targetCountryVisited ? styles.visitCenteredBtn : styles.visitBtn
                            }
                            onClick={() => this.visitTargetCountry(this.targetCountry)}

                        >
                            {this.state.targetCountryVisited ? "Unvisit" : "Visit"}
                        </button>
                        <button
                            className={styles.desireBtn}
                            onClick={() => this.desireTargetCountry(this.targetCountry)}
                            style={{
                                display: this.state.targetCountryVisited ? "none" : "block"
                            }}
                        >
                            {this.state.targetCountryDesired ? "Undesire" : "Desire"}
                        </button>
                        <div className={styles.cities}>
                            {this.state.targetCountryVisited ? <Cities target={this.targetCountry}/> : null}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className={mapStyle.legend}>
                    Visited countries: <div className={mapStyle.boxVisited}/><br/>
                    Desired countries: <div className={mapStyle.boxDesired}/>
                </div>
                <YandexMap
                    enterCountry={this.enterCountry}
                    leaveCountry={this.leaveCountry}
                    clickOnCountry={this.clickOnCountry}
                    visitedISO={this.visitedISO}
                    desiredISO={this.desiredISO}
                    defaultOptions={DEFAULT_OPTIONS}
                    visitedOptions={VISITED_OPTIONS}
                    desiredOptions={DESIRED_OPTIONS}
                />
            </div>
        );
    }
}
