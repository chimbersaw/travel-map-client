import React from "react";
import Sidebar from "./Sidebar.js";
import {Redirect} from "react-router";
import styles from "../css/Profile.module.scss";
import {NavLink} from "react-router-dom";
import {Button, Modal} from "react-bootstrap";
import FriendProfile from "./FriendProfile.js";

const axios = require("axios").default;
const STATS_PATH = "api/user/stats";
const FRIENDS_PATH = "api/user/friends";
const SERVER_STATS_URL = process.env.REACT_APP_SERVER_URL + STATS_PATH;
const SERVER_FRIENDS_LIST_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_PATH;

export async function getFriendsList() {
    let friends = null;
    await axios.get(SERVER_FRIENDS_LIST_URL, {
        withCredentials: true
    }).then(result => {
        friends = result.data;
    });
    return friends;
}

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            waitForServer: true,
            loggedIn: false,
            showExtendedStats: false,
            stats: null,
            friends: null,
            searchText: "",
            showModal: false,
            selectedFriend: null
        };
    }

    getStats = async () => {
        let stats = null;
        await axios.get(SERVER_STATS_URL, {
            withCredentials: true
        }).then(result => {
            stats = result.data;
        });
        return stats;
    };

    updateStatsListVisibility = () => {
        this.setState({
            showExtendedStats: !this.state.showExtendedStats
        });
    };

    handleModalClose = () => this.setState({
        showModal: false
    });

    openModal = friendName => {
        this.setState({
            showModal: true,
            selectedFriend: friendName
        });
    };

    componentDidMount() {
        this.getStats().then(stats => {
            getFriendsList().then(friends => {
                stats.citiesStats.sort((c1, c2) => c1.name.localeCompare(c2.name));
                this.setState({
                    waitForServer: false,
                    loggedIn: true,
                    stats: stats,
                    friends: friends
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
        if (this.state.waitForServer) return <span>Loading profile...</span>;
        if (!this.state.loggedIn) return <Redirect to="/login"/>;

        return (
            <div className="Profile">
                <Sidebar/>
                <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.selectedFriend}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FriendProfile
                            friendName={this.state.selectedFriend}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <span className={styles.line}/>
                <div className={styles.name}>
                    {this.state.stats.username}
                </div>
                <div className={styles.statsHeader}>
                    User stats:
                </div>
                <div className={styles.mainStats}>
                    <div className={styles.box}>
                        Countries visited: {this.state.stats.countriesNumber}
                    </div>
                    <div className={styles.box}>
                        Cities visited: {this.state.stats.totalCitiesNumber}
                    </div>
                    <br/>
                </div>
                <div className={styles.visibilityButton}>
                    <input
                        className={styles.statsBtn}
                        type="submit"
                        value={(this.state.showExtendedStats ? "Hide" : "Show") + " extended stats"}
                        onClick={this.updateStatsListVisibility}
                    />
                </div>
                <div
                    className={styles.statsList}
                    style={{
                        display: this.state.showExtendedStats ? "inline-block" : "none"
                    }}
                >
                    <div className={styles.statsListHeader}>
                        Visited cities stats:
                    </div>
                    {this.state.stats.citiesStats.map(country =>
                        <div className={styles.statsBox}>
                            <div className={styles.longText}>
                                {country.name + ": " + country.citiesNumber}
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.friends}>
                    Friends:
                    <div className={styles.friendList}>
                        {this.state.friends.length === 0 ? "No friends yet" : this.state.friends.map((friend, index) =>
                            <li key={index}>
                                <span style={{cursor: "pointer"}} onClick={() => this.openModal(friend)}>
                                    {friend}
                                </span>
                            </li>
                        )}
                    </div>
                </div>
                <NavLink className={styles.link} to="/friends">
                    <button className={styles.manageFriendList}>
                        Manage friend list
                    </button>
                </NavLink>
            </div>
        );
    }
}
