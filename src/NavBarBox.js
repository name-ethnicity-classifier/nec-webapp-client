import React from "react";
import ReactDOM from "react-dom";
import SettingsBox from "./SettingsBox";
import Cookies from "js-cookie";
import axios from "axios";
import config from "./config";


export default class HomeBarBox extends React.Component {
    constructor(props) {
        super(props);

        this.userSection = this.userSection.bind(this);
        this.closeUserSettingsSidebar = this.closeUserSettingsSidebar.bind(this);

        this.state = {
            loggedIn: true,
            redirectLogin: false,
            redirectSignup: false,
            showUserSettingBox: false
        };
    }

    componentDidMount() {
        axios.get(config.API_URL + "authentication-check", {
        headers: {
            Authorization: "Bearer " + Cookies.get("token"),
            Email: Cookies.get("email")
        }
        }).then((response) => {
            ;
        }, (error) => {
            this.setState({loggedIn: false});
        });
    }

    closeUserSettingsSidebar() {
        [].forEach.call(document.querySelectorAll(".sidebarPopupOverlay"), function(e) {
            e.parentNode.removeChild(e);
        });
        [].forEach.call(document.querySelectorAll(".wrapperDiv"), function(e) {
            e.parentNode.removeChild(e);
        });
    }

    showUserSettingSidebar() {
        var bodyElement = document.getElementsByTagName("body")[0];
        var popupOverlay = document.createElement("div");
        popupOverlay.classList.add("sidebarPopupOverlay");
        bodyElement.appendChild(popupOverlay);

        var appElement = document.getElementsByClassName("App")[0];
        var wrapperDiv = document.createElement("div");
        wrapperDiv.classList.add("wrapperDiv");

        ReactDOM.render(<SettingsBox stopRenderingHandler={this.closeUserSettingsSidebar}/>, appElement.appendChild(wrapperDiv));
    }

    userSection() {
        if (this.state.loggedIn === false) {
            return (
                <div className="authBox">
                    <button className="loginButton" onClick={(e) => {
                        e.preventDefault();
                        window.location.href="/login";
                    }}>log in</button>

                    <button className="signupButton"onClick={(e) => {
                        e.preventDefault();
                        window.location.href="/signup";
                    }}>sign up</button>

                    {/*<h1 className="authButtonSeperator">/</h1>*/}
                </div>
            );
        }

        else {
            return (
                <button className="userSettingsButton" onClick={(e) => {
                    this.showUserSettingSidebar()
                }}><img alt="compress-icon" className="userSettingsIcon" src="images/user-settings.svg"></img></button>
            );
        }
    }

    render() {
        return (
            <div className="homeBarBox">

                <div className="homBarActionBox">
                    <button className="homeBoxButton" onClick={(e) => {
                                e.preventDefault();
                                window.location.href="/";
                    }}>
                        <b>names to ethnicity</b>
                        <img alt="nec-logo" src="images/nec_final_logo.svg" className="logo"></img>

                    </button>

                    <div className="navigationBox">

                        <div className="navigationLinkDiv">
                            <button className="navigationButton" onClick={(e) => {
                                e.preventDefault();
                                window.location.href="/#aboutBox";
                            }}>about</button>
                        </div>

                        <div className="navigationLinkDiv">
                            <button className="navigationButton" onClick={(e) => {
                                e.preventDefault();
                                window.location.href="/classification";
                            }}>classify names</button>
                        </div>

                        <div className="navigationLinkDiv">
                            <button className="navigationButton" onClick={(e) => {
                                e.preventDefault();
                                window.location.href="/model-request";
                            }}>create custom model</button>
                        </div>
                        
                        <div className="navigationLinkDiv lastNavigationLinkDiv">
                            {this.userSection()}
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}