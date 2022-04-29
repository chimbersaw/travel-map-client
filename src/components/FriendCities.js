import React from "react";

const axios = require("axios").default;
const VISITED_CITIES_PATH = "api/user/friends/cities";
const COMMON_VISITED_CITIES_PATH = "api/user/friends/cities/common";
const SERVER_VISITED_CITIES_URL = process.env.REACT_APP_SERVER_URL + VISITED_CITIES_PATH;
const SERVER_COMMON_VISITED_CITIES_URL = process.env.REACT_APP_SERVER_URL + COMMON_VISITED_CITIES_PATH;
const SortedSet = require("collections/sorted-set");

export default class Cities extends React.Component {

    constructor(props) {
        super(props);

        this.allCities = null;
        this.visitedCities = null;
        this.commonVisitedCities = null;
        this.iso = null;
        this.friendName = null;
        this.state = {
            waitForServer: true,
            searchText: ""
        };
    }

    getVisitedCities = async (iso, friendName) => {
        let visitedCities = [];
        await axios.post(SERVER_VISITED_CITIES_URL, {
            friendName: friendName,
            iso: iso
        }, {
            withCredentials: true
        }).then(result => {
            for (let city of result.data) {
                visitedCities.push(city.name);
            }
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
        return visitedCities;
    };

    getCommonVisitedCities = async (iso, friendName) => {
        let visitedCities = [];
        await axios.post(SERVER_COMMON_VISITED_CITIES_URL, {
            friendName: friendName,
            iso: iso
        }, {
            withCredentials: true
        }).then(result => {
            for (let city of result.data) {
                visitedCities.push(city.name);
            }
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
        return visitedCities;
    };

    componentDidMount() {
        this.iso = this.props.target.properties._data.iso3166;
        this.friendName = this.props.friendName;

        this.getVisitedCities(this.iso, this.friendName).then(visitedCities => {
            this.getCommonVisitedCities(this.iso, this.friendName).then(commonVisitedCities => {
                this.commonVisitedCities = SortedSet(commonVisitedCities);
                this.visitedCities = SortedSet(visitedCities);
                this.commonVisitedCities.forEach(city => this.visitedCities.remove(city));

                this.setState({
                    waitForServer: false
                });
            });
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
    }

    render() {
        if (this.state.waitForServer) return <div className="Cities">Loading...</div>;

        return (
            <div className="Cities">
                {this.commonVisitedCities.length ? "Common cities" : "No common cities"}
                {this.commonVisitedCities.map((city, index) =>
                    <li key={index}>
                        {city}
                    </li>
                )}
                <br/>
                {this.visitedCities.length ? "Other visited cities" : "No other visited cities"}
                {this.visitedCities.map((city, index) =>
                    <li key={index}>
                        {city}
                    </li>
                )}
            </div>
        );
    }
}
