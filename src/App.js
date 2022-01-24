import React, { useState } from "react";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";
import ModelSubmissionBox from "./ModelSubmissionPage";
import NavBarBox from "./NavBarBox";
import HomePageBox from './HomePage';
import ClassificationBox from "./ClassificationPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import TermsOfServicePage from "./TermsOfServicePage";
import ApiDocumentationPage from "./ApiDocumentationPage";
import LoginBox from "./LoginBox";
import Cookies from "js-cookie";
import axios from "axios";
import config from "./config";
import FooterBox from "./FooterBox";

export default function App() {
    return (
        <Router>
            <div className="App">
                {window.location.pathname !== "/login" && window.location.pathname !== "/signup" ? 
                    <NavBarBox/>
                : null}

                <Route path="/" exact component={HomePageBox}></Route>
                <Route path="/login" exact component={() => <LoginBox authState="login"/>}></Route>
                <Route path="/signup" exact component={() => <LoginBox authState="signup"/>}></Route>
                <Route path="/model-request" exact component={ModelSubmissionBox}></Route>
                <Route path="/classification" exact component={ClassificationBox}></Route>
                <Route path="/privacy-policy" exact component={PrivacyPolicyPage}></Route>
                <Route path="/terms-of-service" exact component={TermsOfServicePage}></Route>
                <Route path="/api-documentation" exact component={ApiDocumentationPage}></Route>

                {window.location.pathname !== "/login" && window.location.pathname !== "/signup" ? 
                    <FooterBox/>
                : null}

            </div>
        </Router>
    );
}


export function authorizationCheck() {
    axios.get(config.API_URL + "authentication-check", {
        headers: {
            Authorization: "Bearer " + Cookies.get("token"),
            Email: Cookies.get("email")
        }
    }).then((response) => {
        return;
    }, (error) => {
        if (error.response.status === 401) {
            Cookies.remove("email");
            Cookies.remove("token");
        }
        window.location.href = "/login";
    });
}