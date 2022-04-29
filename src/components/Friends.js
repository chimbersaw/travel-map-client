import React from "react";
import Sidebar from "./Sidebar.js";
import {Redirect} from "react-router";
import styles from "../css/Friends.module.scss";
import {getFriendsList} from "./Profile.js";
import {Button, Modal} from "react-bootstrap";
import FriendProfile from "./FriendProfile.js";

const axios = require("axios").default;
const FRIENDS_PATH = "api/user/friends";
const FRIENDS_REQUEST_PATH = FRIENDS_PATH + "/request";
const FRIENDS_REMOVE_PATH = FRIENDS_PATH + "/remove";
const FRIENDS_REQUEST_SEND_PATH = FRIENDS_REQUEST_PATH + "/send";
const FRIENDS_REQUEST_CANCEL_PATH = FRIENDS_REQUEST_PATH + "/cancel";
const FRIENDS_REQUEST_ACCEPT_PATH = FRIENDS_REQUEST_PATH + "/accept";
const FRIENDS_REQUEST_DECLINE_PATH = FRIENDS_REQUEST_PATH + "/decline";
const SERVER_FRIENDS_REMOVE_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_REMOVE_PATH;
const SERVER_FRIENDS_REQUEST_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_REQUEST_PATH;
const SERVER_FRIENDS_REQUEST_SEND_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_REQUEST_SEND_PATH;
const SERVER_FRIENDS_REQUEST_CANCEL_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_REQUEST_CANCEL_PATH;
const SERVER_FRIENDS_REQUEST_ACCEPT_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_REQUEST_ACCEPT_PATH;
const SERVER_FRIENDS_REQUEST_DECLINE_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_REQUEST_DECLINE_PATH;

export default class Friends extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            waitForServer: true,
            loggedIn: false,
            friendsList: null,
            myFriendRequests: null,
            friendRequestsToMe: null,
            searchText: "",
            showModal: false,
            selectedFriend: null
        };
    }

    sendFriendRequest = async username => {
        let response = null;
        await axios.post(SERVER_FRIENDS_REQUEST_SEND_URL, {
            friendName: username
        }, {
            withCredentials: true
        }).then(result => {
            response = result;
        });
        return response;
    };

    removeFriend = async username => {
        let response = null;
        await axios.post(SERVER_FRIENDS_REMOVE_URL, {
            friendName: username
        }, {
            withCredentials: true
        }).then(result => {
            response = result;
        });
        return response;
    };

    cancelFriendRequest = async username => {
        let response = null;
        await axios.post(SERVER_FRIENDS_REQUEST_CANCEL_URL, {
            friendName: username
        }, {
            withCredentials: true
        }).then(result => {
            response = result;
        });
        return response;
    };

    acceptFriendRequest = async username => {
        let response = null;
        await axios.post(SERVER_FRIENDS_REQUEST_ACCEPT_URL, {
            friendName: username
        }, {
            withCredentials: true
        }).then(result => {
            response = result;
        });
        return response;
    };

    declineFriendRequest = async username => {
        let response = null;
        await axios.post(SERVER_FRIENDS_REQUEST_DECLINE_URL, {
            friendName: username
        }, {
            withCredentials: true
        }).then(result => {
            response = result;
        });
        return response;
    };

    getFriendRequests = async myRequests => {
        let requestsList = null;
        await axios.post(SERVER_FRIENDS_REQUEST_URL, {
            myRequests: myRequests
        }, {
            withCredentials: true
        }).then(result => {
            requestsList = result.data;
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
        return requestsList;
    };

    getMyFriendRequests = async () => {
        return this.getFriendRequests(true);
    };

    getFriendRequestsToMe = async () => {
        return this.getFriendRequests(false);
    };

    handleSearchbarChange = event => {
        const nextSearchText = event.target.value;

        this.setState({
            searchText: nextSearchText
        });
    };

    handleError = error => {
        if (error.response && error.response.data) {
            alert(error.response.data);
        } else {
            console.log("Error occurred!");
            console.log(error);
        }
    };

    updateLists = () => {
        getFriendsList().then(friendsList => {
            this.getMyFriendRequests().then(myFriendRequests => {
                this.getFriendRequestsToMe().then(friendRequestsToMe => {
                    this.setState({
                        friends: friendsList,
                        myFriendRequests: myFriendRequests,
                        friendRequestsToMe: friendRequestsToMe
                    });
                });
            });
        });
    };

    addFriend = username => {
        if (username === "") {
            alert("Please enter friend username");
            return;
        }

        this.sendFriendRequest(username).then(() => {
            this.updateLists();
        }).catch(error => {
            this.handleError(error);
        });
        this.setState({
            searchText: ""
        });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.addFriend(this.state.searchText);
        }
    };

    handleModalClose = () => this.setState({
        showModal: false
    });

    handleFriendDelete = () => {
        this.removeFriend(this.state.selectedFriend).then(() => {
            this.updateLists();
        }).catch(error => {
            this.handleError(error);
        });
        this.handleModalClose();
    };

    handleCancelMyRequest = friendName => {
        this.cancelFriendRequest(friendName).then(() => {
            this.updateLists();
        }).catch(error => {
            this.handleError(error);
        });
    };

    handleAcceptRequest = friendName => {
        this.acceptFriendRequest(friendName).then(() => {
            this.updateLists();
        }).catch(error => {
            this.handleError(error);
        });
    };

    handleDeclineRequest = friendName => {
        this.declineFriendRequest(friendName).then(() => {
            this.updateLists();
        }).catch(error => {
            this.handleError(error);
        });
    };

    openModal = friendName => {
        this.setState({
            showModal: true,
            selectedFriend: friendName
        });
    };

    componentDidMount() {
        getFriendsList().then(friendsList => {
            this.getMyFriendRequests().then(myFriendRequests => {
                this.getFriendRequestsToMe().then(friendRequestsToMe => {
                    this.setState({
                        waitForServer: false,
                        loggedIn: true,
                        friends: friendsList,
                        myFriendRequests: myFriendRequests,
                        friendRequestsToMe: friendRequestsToMe
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
        if (this.state.waitForServer) return <span>Loading profile...</span>;
        if (!this.state.loggedIn) return <Redirect to="/login"/>;

        return (
            <div className="Friends">
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
                        <Button variant="danger" onClick={this.handleFriendDelete}>
                            Delete from friends
                        </Button>
                        <Button variant="secondary" onClick={this.handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className={styles.friends}>
                    <div className={styles.col1}>
                        Friends:
                        <ul
                            className={styles.friendList}
                            style={{
                                "padding-left": this.state.friends.length === 0 ? "0" : "1.5vw"
                            }}
                        >
                            {this.state.friends.length === 0 ? "No friends yet" : this.state.friends.map((friend, index) =>
                                <li key={index}>
                                    <span style={{cursor: "pointer"}} onClick={() => this.openModal(friend)}>
                                        {friend}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className={styles.col2}>
                        Add friend:
                        <input
                            className={styles.searchBar}
                            type="text"
                            placeholder="Search by username"
                            value={this.state.searchText}
                            onChange={this.handleSearchbarChange}
                            onKeyDown={this.handleKeyDown}
                        />
                        <button
                            className={styles.addFriendBtn}
                            onClick={() => this.addFriend(this.state.searchText)}
                        >
                            Add friend
                        </button>
                    </div>
                    <div className={styles.col3}>
                        My Requests:
                        <ul
                            className={styles.friendList}
                            style={{
                                "padding-left": this.state.myFriendRequests.length === 0 ? "0" : "1.5vw"
                            }}
                        >
                            {this.state.myFriendRequests.length === 0 ? "No requests yet" : this.state.myFriendRequests.map((friend, index) =>
                                <li key={index}>
                                    {friend}&nbsp;
                                    <span
                                        className={styles.declineRequestBtn}
                                        onClick={() => this.handleCancelMyRequest(friend)}
                                    >
                                        <i className="fa fa-ban" aria-hidden="true"/>
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className={styles.col4}>
                        Requests to me:
                        <ul
                            className={styles.friendList}
                            style={{
                                "padding-left": this.state.friendRequestsToMe.length === 0 ? "0" : "1.5vw"
                            }}
                        >
                            {this.state.friendRequestsToMe.length === 0 ? "No requests yet" : this.state.friendRequestsToMe.map((friend, index) =>
                                <li key={index}>
                                    {friend}&nbsp;
                                    <span
                                        className={styles.acceptRequestBtn}
                                        onClick={() => this.handleAcceptRequest(friend)}
                                    >
                                        <i className="fa fa-check" aria-hidden="true"/>
                                    </span>
                                    &nbsp;
                                    <span
                                        className={styles.declineRequestBtn}
                                        onClick={() => this.handleDeclineRequest(friend)}
                                    >
                                       <i className="fa fa-ban" aria-hidden="true"/>
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
