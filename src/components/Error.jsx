import React from "react";
import "../css/Background.scss";
import styles from "../css/Home.module.scss";
import Sidebar from "./Sidebar.jsx";

export default class Error extends React.Component {
    render() {
        return (
            <div className="Error">
                <Sidebar/>
                <div id="bg"/>
                <h1 className={styles.centered}>
                    Error: Page does not exist!
                </h1>
            </div>
        );
    }
}
