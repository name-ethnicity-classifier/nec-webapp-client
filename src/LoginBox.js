import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "./config";


export default class LoginBox extends React.Component {
    constructor(props) {
        super(props);

        this.createLoginBox = this.createLoginBox.bind(this);
        this.createSignupBox = this.createSignupBox.bind(this);
        this.createFieldErrorStyle = this.createFieldErrorStyle.bind(this);
        this.colorChoiceBar = this.colorChoiceBar.bind(this);

        this.state = {
            authState: this.props.authState,
            name: "",
            role: "none",
            loginEmail: "",
            loginPassword: "",
            signupEmail: "",
            signupPassword: "",
            repeatedPassword: "",
            showTermsOfServicePopup: false,
            termsOfServiceConsent: false,
            verificationMessage: null,
        }
    }

    colorChoiceBar(authState) {
        if (authState === "login") {
            document.getElementsByClassName("loginChoiceLine")[0].style.backgroundColor = "rgb(131, 131, 131)";
            document.getElementsByClassName("signupChoiceLine")[0].style.backgroundColor = "rgb(215, 215, 215)";
        }
        else if (authState === "signup") {
            document.getElementsByClassName("signupChoiceLine")[0].style.backgroundColor = "rgb(131, 131, 131)";
            document.getElementsByClassName("loginChoiceLine")[0].style.backgroundColor = "rgb(215, 215, 215)";
        }
    }

    componentDidMount() {
        this.colorChoiceBar(this.state.authState);
    }

    createFieldErrorStyle(className, placeholderErrorText, placeholderActualText, isSelection) {
        var inputField = document.getElementsByClassName(className)[0];
        inputField.style.borderColor = "red";
        inputField.style.boxShadow = "1px 2px 4px rgba(255, 0, 0, 0.25)";
        
        // it this function is called to make the role-selecion field error, don't replace text 
        if (!isSelection) {
            inputField.placeholder = placeholderErrorText;
            inputField.value = "";
        }

        inputField.addEventListener("mouseup", function(e) {
            inputField.placeholder = placeholderActualText;
            inputField.style.borderColor = "";
            inputField.style.boxShadow = "";
            inputField.removeEventListener("mouseup", this);
        });
    }

    createSuccessStyle(className, message) {
        var button = document.getElementsByClassName(className)[0]
        button.style.borderColor = "rgb(0, 218, 189)";
        button.style.color = "rgb(0, 218, 189)";
        button.textContent = message;
    }

    createLoginBox() {
        return (
            <div className="loginSectionBox">

                <label className="emailLabel loginEmailLabel">email</label>
                <input type="text" placeholder="enter your email" value={this.state.loginEmail} onChange={(e) => {
                    this.setState({loginEmail: e.target.value})
                }} className="emailField loginEmailField"/>

                <label className="passwordLabel loginPasswordLabel">password</label>
                <input type="password" placeholder="enter your password" value={this.state.loginPassword} onChange={(e) => {
                    this.setState({loginPassword: e.target.value})
                }} className="passwordField loginPasswordField"/>

                <button className="submitAuthButton loginSubmitButton" onClick={(e) => {
                    if (this.state.loginEmail.length < 3) {
                        this.createFieldErrorStyle("loginEmailField", "please enter a valid email address!", "enter your email");
                        return null;
                    }
                    else if (this.state.loginPassword.length < 10) {
                        this.createFieldErrorStyle("loginPasswordField", "please enter your password!", "enter your password");
                        return null;
                    }

                    var data = {
                        email: this.state.loginEmail,
                        password: this.state.loginPassword
                    }

                    axios.post(config.API_URL + "login", data)
                        .then((response) => {
                            // store user email and token
                            Cookies.set("email", data.email, { expires: 100 });
                            Cookies.set("token", response.data.token, { expires: 100 });

                            this.createSuccessStyle("submitAuthButton", "logged in!");

                            setTimeout((e) => {
                                window.location.href = "/";
                            }, 1500);

                        }, (error) => {
                            if (error.response.data.error === "userNotVerified") {
                                this.setState({verificationMessage: "This account exists but is not verified yet. We sent you a verification mail!"});
                            }
                            else {
                                this.createFieldErrorStyle("loginEmailField", "email or password does not exist!", "enter your email");
                                this.createFieldErrorStyle("loginPasswordField", "email or password does not exist!", "enter your password");
                            }
                        });
                }}>log in</button>

                <div className="authButtonShadow loginShadow"></div>
            </div>
        );
    }

    createSignupBox() {
        return (
            <div className="signupSectionBox">

                <label className="nameLabel">full name</label>
                <input type="text" placeholder="first and last name" value={this.state.name} onChange={(e) => {
                    this.setState({name: e.target.value})
                }} className="nameField"/>

                <label className="roleLabel">role</label>
                <select name="role" onChange={(e) => {
                    this.setState({role: e.target.value});
                    var roleField = document.getElementsByClassName("roleField")[0];
                    roleField.classList.add("roleSelected");

                    if (e.target.value === "none") {
                        roleField.classList.remove("roleSelected");
                    }
                }}className="roleField">
                    <option value="none" class="roleOption">select role</option>
                    <option value="researcher" class="roleOption">researcher</option>
                    <option value="student" class="roleOption">student</option>
                    <option value="else" class="roleOption">else</option>
                </select>
                
                <label className="emailLabel signupEmailLabel">email</label>
                <input type="text" placeholder="example@mail.com" value={this.state.signupEmail} onChange={(e) => {
                    this.setState({signupEmail: e.target.value})
                }} className="emailField signupEmailField"/>

                <label className="passwordLabel signupPasswordLabel">password</label>
                <input type="password" placeholder="minimum of 10 characters, at least 1 number" value={this.state.signupPassword} onChange={(e) => {
                    this.setState({signupPassword: e.target.value})
                }} className="passwordField signupPasswordField"/>

                <label className="repeatPasswordLabel">repeat password</label>
                <input type="password" placeholder="minimum of 10 characters, at least 1 number" value={this.state.repeatedPassword} onChange={(e) => {
                    this.setState({repeatedPassword: e.target.value})
                }} className="repeatPasswordField"/>

                <input type="checkbox" onChange={(e) => {
                    this.setState({ termsOfServiceConsent: !this.state.termsOfServiceConsent });
                    if (!this.state.termsOfServiceConsent) {
                        Cookies.set("cookie-consent", true);
                        var checkMarkDiv = document.getElementsByClassName("checkMark")[0];
                        checkMarkDiv.classList.add("checkMarkChecked");
                    }
                    else {
                        Cookies.set("cookie-consent", false);
                        var checkMarkDiv = document.getElementsByClassName("checkMark")[0];
                        checkMarkDiv.classList.remove("checkMarkChecked");
                    }
                    
                }} className="consentCheckBox"/>
                <div className="checkMark"></div>

                <p className="termsOfServiceDescription">
                    I've read and consent to the <a href="/terms-of-service" target="_blank">Terms of Service</a>, <a href="/privacy-policy" target="_blank">Privacy Policy</a>, and the use of necessary <a href="/privacy-policy#cookies" target="_blank">cookies</a>.
                </p>

                <button className="submitAuthButton signupSubmitButton" onClick={() => {
                    if (this.state.signupPassword !== this.state.repeatedPassword) {
                        this.createFieldErrorStyle("repeatPasswordField", "the passwords don't match!", "minimum of 10 characters, at least 1 number");
                        return null;
                    }

                    var data = {
                        name: this.state.name,
                        role: this.state.role,
                        email: this.state.signupEmail,
                        password: this.state.signupPassword,
                        consented: this.state.termsOfServiceConsent
                    }
                    axios.post(config.API_URL + "signup", data)
                        .then((response) => {
                            this.createSuccessStyle("submitAuthButton", "signed in!");
                            this.setState({verificationMessage: "We sent you a verification mail! Please check your email inbox (and the spam folder)."});

                            setTimeout((e) => {
                                window.location.href = "/";
                            }, 5000);

                        }, (error) => {
                            if (error.response.data.error === "invalidSignupNameTooShort") {
                                this.createFieldErrorStyle("nameField", "please enter your name!", "first and last name");
                            }
                            else if (error.response.data.error === "invalidSignupNameTooLong") {
                                this.createFieldErrorStyle("nameField", "please shorten name!", "first and last name");
                            }
                            else if (error.response.data.error === "invalidSignupNameNotLatin") {
                                this.createFieldErrorStyle("nameField", "latin characters only!", "first and last name");
                            }
                            else if (error.response.data.error === "invalidSignupRole") {
                                this.createFieldErrorStyle("roleField", null, null, true);
                            }
                            else if (error.response.data.error === "invalidSignupEmail") {
                                this.createFieldErrorStyle("signupEmailField", "please enter a valid email address!", "example@mail.com");
                            }
                            else if (error.response.data.error === "emailDuplicateExists") {
                                this.createFieldErrorStyle("signupEmailField", "this email does already exist!", "example@mail.com");
                            }
                            else if (error.response.data.error === "invalidSignupPassword") {
                                this.createFieldErrorStyle("signupPasswordField", "minimum of 10 characters, at least 1 number!", "minimum of 10 characters, at least 1 number");
                            }
                            else if (error.response.data.error === "noTermsOfServiceConsent") {
                                this.createFieldErrorStyle("consentCheckBox", "", "", true);
                            }
                            else {
                                ;
                            }
                        });

                }}>sign up</button>
                <div className="authButtonShadow signupShadow"></div>
            </div>
        )
    }

    render() {
        return (
                <div className="userAuthBox">

                    { this.state.verificationMessage !== null ? 
                        <div className="verificationMessageBox">
                            <p className="verificationMessage">{this.state.verificationMessage}</p>
                        </div>
                    : null }

                    <div className="authFieldBox">
                        <a href="/">
                            <div className="authTitleBox">
                                <img alt="nec-logo" src="images/nec_final_logo.svg" className="authBoxlogo"></img>
                                <h1 className="authTitleText">name-to-ethnicity</h1>
                            </div>
                        </a>

                        <button className="authChoiceButton" id="loginChoice" onClick={(e) => {
                            this.setState({verificationMessage: null});
                            this.colorChoiceBar("login");
                            this.setState({authState: "login"});
                            this.setState({ showTermsOfServicePopup: false })
                        }}>log in</button>

                        <button className="authChoiceButton" id="signupChoice" onClick={(e) => {
                            this.setState({verificationMessage: null});
                            this.colorChoiceBar("signup");
                            this.setState({authState: "signup"});
                        }}>sign up</button>

                        <div className="loginChoiceLine" id="chosenAuth"></div>
                        <div className="signupChoiceLine"></div>

                        {
                            this.state.authState === "login" ? this.createLoginBox() :
                            null
                        }
                        {
                            this.state.authState === "signup" ? this.createSignupBox() :
                            null
                        }

                        {
                            this.state.showTermsOfServicePopup ? this.showTermsOfServicePopup() :
                            null
                        }

                    </div>
                </div>
        );
    }
}

