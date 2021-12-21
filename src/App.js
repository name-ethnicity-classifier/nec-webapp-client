import React, { useState } from "react";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";
import ModelSubmissionBox from "./ModelSubmissionPage";
import NavBarBox from "./NavBarBox";
import HomePageBox from './HomePage';
import ClassificationBox from "./ClassificationPage";
import PrivacyPolicyPage from "./PrivacyPolicy";
import LoginBox from "./LoginBox";
import Cookies from "js-cookie";
import axios from "axios";
import config from "./config";


export default function App() {

    const [loggedIn, setLogIn] = useState(false);

    function requireAuth() {
        axios.get(config.API_URL + "authentication-check", {
        headers: {
            Authorization: "Bearer " + Cookies.get("token"),
            Email: Cookies.get("email")
        }}).then((response) => {
            setLogIn(true);
        }, (error) => {
            if (error.response.status === 401) {
                Cookies.remove("email");
                Cookies.remove("token");
                window.location.href = "/login";
            }
        });
    }

    return (
        <Router>
            <div className="App">
                {window.location.pathname !== "/login" && window.location.pathname !== "/signup" ? 
                    <NavBarBox/>
                : null}

                <Route path="/" exact component={HomePageBox}></Route>

                <Route path="/login" exact component={() => <LoginBox authState="login"/>}></Route>
                <Route path="/signup" exact component={() => <LoginBox authState="signup"/>}></Route>

                <Route path="/model-request" exact render={() => {
                    requireAuth();
                    if (loggedIn) { 
                        return ( <ModelSubmissionBox/> ); 
                    }
                    else { 
                        <Redirect to="/login"/> 
                    } 
                }}></Route>

                <Route path="/classification" exact render={() => {
                    requireAuth();
                    if (loggedIn) { 
                        return ( <ClassificationBox/> ); 
                    }
                    else { 
                        <Redirect to="/login"/> 
                    } 
                }}></Route>

                <Route path="/privacy-policy" exact component={PrivacyPolicyPage}></Route>

            </div>
        </Router>
    );
}