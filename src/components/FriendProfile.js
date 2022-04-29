import React from "react";
import styles from "../css/FriendProfile.module.scss";

const axios = require("axios").default;
const FRIENDS_STATS_PATH = "api/user/friends/stats";
const SERVER_FRIEND_STATS_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_STATS_PATH;

export default class FriendProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            waitForServer: true,
            showExtendedStats: false,
            stats: null
        };
    }

    getStats = async friendName => {
        let stats = null;
        await axios.post(SERVER_FRIEND_STATS_URL, {
            friendName: friendName
        }, {
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

    redirectToFriendMap = () => {
        window.open("/friends/map?friendName=" + this.props.friendName, "_self");
    };

    componentDidMount() {
        this.getStats(this.props.friendName).then(stats => {
            this.setState({
                waitForServer: false,
                stats: stats
            });
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                this.setState({
                    waitForServer: false
                });
            } else {
                console.log("Error occurred!");
                console.log(error);
            }
        });
    }

    render() {
        if (this.state.waitForServer) return <span>Loading friend profile...</span>;

        return (
            <div className={styles.FriendProfile}>
                Countries visited: {this.state.stats.countriesNumber}
                <br/>
                Cities visited: {this.state.stats.totalCitiesNumber}
                <br/>
                Common countries visited: {this.state.stats.commonCountries}
                <br/>
                Common cities visited: {this.state.stats.totalCommonCities}
                <button
                    className={styles.showMapBtn}
                    onClick={this.redirectToFriendMap}
                >
                    Show map
                </button>
                <button
                    className={styles.friendStatsBtn}
                    onClick={this.updateStatsListVisibility}
                >
                    {(this.state.showExtendedStats ? "Hide" : "Show") + " extended stats"}
                </button>
                <br/>
                <div
                    className={styles.friendStatsList}
                    style={{
                        display: this.state.showExtendedStats ? "inline-block" : "none"
                    }}
                >
                    Visited cities stats:
                    {this.state.stats.citiesStats.map((country, index) =>
                        <div key={index} className={styles.friendStatsBox}>
                            <div className={styles.longText}>
                                {country.name + ": " + country.citiesNumber}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
