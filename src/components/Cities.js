import React from "react";
import styles from "../css/Cities.module.scss";

const axios = require("axios").default;
const CITIES_BY_COUNTRY_PATH = "api/cities";
const VISITED_CITIES_PATH = "api/user/visited_cities";
const SERVER_CITIES_BY_COUNTRY = process.env.REACT_APP_SERVER_URL + CITIES_BY_COUNTRY_PATH;
const SERVER_VISITED_CITIES_URL = process.env.REACT_APP_SERVER_URL + VISITED_CITIES_PATH;
const SortedSet = require("collections/sorted-set");

export default class Cities extends React.Component {
    buttonState = {
        NONE: "",
        VISIT: "Visit city",
        UNVISIT: "Unvisit city"
    };

    constructor(props) {
        super(props);

        this.allCities = null;
        this.visitedCities = null;
        this.selectedCity = null;
        this.iso = null;
        this.state = {
            waitForServer: true,
            currentCities: [],
            currentVisitedCities: [],
            searchText: "",
            visitCityButtonState: this.buttonState.NONE
        };
    }

    getCitiesByCountry = async iso => {
        let cities = [];
        await axios.post(SERVER_CITIES_BY_COUNTRY, {
            iso: iso
        }).then(result => {
            for (let city of result.data) {
                cities.push(city.name);
            }
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
        return cities;
    };

    getVisitedCities = async iso => {
        let visitedCities = [];
        await axios.post(SERVER_VISITED_CITIES_URL, {
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

    visitCityServer = (name, iso) => {
        axios.put(SERVER_VISITED_CITIES_URL, {
            name: name,
            iso: iso
        }, {
            withCredentials: true
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    unvisitCityServer = (name, iso) => {
        axios.delete(SERVER_VISITED_CITIES_URL, {
            data: {
                name: name,
                iso: iso
            },
            withCredentials: true
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    filterCityList = (cityList, prefix, foundButtonState) => {
        let result = [];
        for (const city of cityList) {
            const name = city.toLowerCase();
            if (name.startsWith(prefix)) {
                result.push(city);
                if (name === prefix) {
                    this.selectedCity = city;
                    this.setState({
                        visitCityButtonState: foundButtonState
                    });
                }
            }
        }
        return result;
    };

    filterCurrentCitiesByPrefix = prefix => {
        prefix = prefix.toLowerCase();
        this.setState({
            visitCityButtonState: this.buttonState.NONE
        });

        let nextCurrentCities = prefix === "" ? [] : this.filterCityList(this.allCities, prefix, this.buttonState.VISIT);
        nextCurrentCities = nextCurrentCities.filter(city => !this.visitedCities.has(city));
        let nextCurrentVisitedCities = this.filterCityList(this.visitedCities.slice(), prefix, this.buttonState.UNVISIT);

        this.setState({
            currentCities: nextCurrentCities,
            currentVisitedCities: nextCurrentVisitedCities
        });
    };

    handleSearchbarChange = event => {
        const nextSearchText = event.target.value;

        this.setState({
            searchText: nextSearchText
        });
        this.filterCurrentCitiesByPrefix(nextSearchText);
    };

    selectCityName = cityName => {
        this.setState({
            searchText: cityName
        });
        this.filterCurrentCitiesByPrefix(cityName);
    };

    visitCityButtonClick = () => {
        const city = this.selectedCity;
        if (this.state.visitCityButtonState === this.buttonState.VISIT) {
            this.visitCityServer(city, this.iso);
            this.visitedCities.push(city);
        } else if (this.state.visitCityButtonState === this.buttonState.UNVISIT) {
            this.unvisitCityServer(city, this.iso);
            this.visitedCities.delete(city);
        }
        this.selectCityName("");
    };

    componentDidMount() {
        this.iso = this.props.target.properties._data.iso3166;

        this.getCitiesByCountry(this.iso).then(cities => {
            this.allCities = cities;

            this.getVisitedCities(this.iso).then(visitedCities => {
                this.visitedCities = SortedSet(visitedCities);
                this.filterCurrentCitiesByPrefix("");

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
                <input
                    type="text"
                    placeholder="Search by city"
                    value={this.state.searchText}
                    onChange={this.handleSearchbarChange}
                />
                <button
                    className={styles.visitBtn}
                    style={{
                        display: this.state.visitCityButtonState === this.buttonState.NONE ? "none" : "inline-block"
                    }}
                    onClick={this.visitCityButtonClick}
                >
                    {this.state.visitCityButtonState}
                </button>
                <br/>
                {this.state.currentVisitedCities.length ? "Visited\n" : ""}
                {this.state.currentVisitedCities.map((city, index) =>
                    <li key={index}>
                        <span style={{cursor: "pointer"}} onClick={() => this.selectCityName(city)}>
                            {city}
                        </span>
                    </li>
                )}
                {this.state.currentCities.length ? "Unvisited\n" : ""}
                {this.state.currentCities.map((city, index) =>
                    <li key={index}>
                        <span style={{cursor: "pointer"}} onClick={() => this.selectCityName(city)}>
                            {city}
                        </span>
                    </li>
                )}
            </div>
        );
    }
}
