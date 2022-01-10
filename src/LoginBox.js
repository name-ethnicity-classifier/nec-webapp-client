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

                    if (e.target.value == "none") {
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
                        var checkMarkDiv = document.getElementsByClassName("checkMark")[0];
                        checkMarkDiv.classList.add("checkMarkChecked");
                    }
                    else {
                        var checkMarkDiv = document.getElementsByClassName("checkMark")[0];
                        checkMarkDiv.classList.remove("checkMarkChecked");
                    }
                    
                }} className="consentCheckBox"/>
                <div className="checkMark"></div>

                <p className="termsOfServiceDescription">I've read and consent to the</p>
                <button className="termsOfServiceButton" onClick={() => {
                    this.setState({ showTermsOfServicePopup: true });
                }}>terms of service</button>
                <p className="termsOfServiceDescription termsOfServicePeriod">.</p>

                <button className="submitAuthButton signupSubmitButton" onClick={() => {
                    /* potential client side validations:

                    if (this.state.role == "none") {
                        this.createFieldErrorStyle("roleField", null, null, true);
                        return null;
                    }
                    if (this.state.name.length > 40) {
                        this.createFieldErrorStyle("nameField", "please shorten name!", "first and last name");
                        return null;
                    }

                    var latinOnly = true;
                    var matchStr = this.state.name.match(/[a-zA-Z ]+/);
                    if (matchStr == null) {
                        latinOnly = false;
                    }
                    latinOnly = matchStr[0].length == this.state.name.length;
                    if(!latinOnly) {                
                        this.createFieldErrorStyle("nameField", "latin characters only!", "first and last name");
                        return null;
                    }
                    if (this.state.name.length < 3) {
                        this.createFieldErrorStyle("nameField", "please provide full name!", "first and last name");
                        return null;
                    }

                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!re.test(String(this.state.signupEmail).toLowerCase())) {
                        this.createFieldErrorStyle("loginEmailField", "please enter a valid email address!", "example@mail.com");
                        return null;
                    }
                    if (this.state.signupPassword.length < 10 || this.state.signupPassword.length > 63 || !/\d/.test(this.state.signupPassword)) {
                        this.createFieldErrorStyle("signupPasswordField", "minimum of 10 characters, at least 1 number!", "minimum of 10 characters, at least 1 number");
                        return null;
                    }
                    */

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

    showTermsOfServicePopup() {
        return (
            <div className="termsOfServicePopup">
                <button className="closeTermsOfServiceButton" onClick={(e) => {
                    this.setState({ showTermsOfServicePopup: false });
                }}>
                    <img alt="close-terms-of-service-icon" src="images\close-box-icon.svg" className="closeTermsOfServiceImage"></img>
                </button>
                <div className="termsOfServiceTextSection">
                    <p className="termsOfServiceText">
                        <h1 style={{textAlign: "left"}}>Website Terms and Conditions of Use</h1>
                        <h2>1. Terms</h2>
                        <p>By accessing this Website, accessible from https://name-to-ethnicity.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>
                        <h2>2. Use License</h2>
                        <p>Permission is granted to temporarily download one copy of the materials on name-to-ethnicity's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                        <ul>
                            <li>modify or copy the materials;</li>
                            <li>use the materials for any commercial purpose or for any public display;</li>
                            <li>attempt to reverse engineer any software contained on name-to-ethnicity's Website;</li>
                            <li>remove any copyright or other proprietary notations from the materials; or</li>
                            <li>transferring the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>
                        <p>This will let name-to-ethnicity to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format. These Terms of Service has been created with the help of the <a href="https://www.termsofservicegenerator.net">Terms Of Service Generator</a>.</p>
                        <h2>3. Disclaimer</h2>
                        <p>All the materials on name-to-ethnicity's Website are provided "as is". name-to-ethnicity makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, name-to-ethnicity does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>
                        <h2>4. Limitations</h2>
                        <p>name-to-ethnicity or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on name-to-ethnicity's Website, even if name-to-ethnicity or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>
                        <h2>5. Revisions and Errata</h2>
                        <p>The materials appearing on name-to-ethnicity's Website may include technical, typographical, or photographic errors. name-to-ethnicity will not promise that any of the materials in this Website are accurate, complete, or current. name-to-ethnicity may change the materials contained on its Website at any time without notice. name-to-ethnicity does not make any commitment to update the materials.</p>
                        <h2>6. Links</h2>
                        <p>name-to-ethnicity has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by name-to-ethnicity of the site. The use of any linked website is at the user’s own risk.</p>
                        <h2>7. Site Terms of Use Modifications</h2>
                        <p>name-to-ethnicity may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.</p>
                        <h2>8. Your Privacy</h2>
                        <p>Please read our Privacy Policy.</p>
                        <h2>9. Governing Law</h2>
                        <p>Any claim related to name-to-ethnicity's Website shall be governed by the laws of de without regards to its conflict of law provisions.</p>
                    </p>
                </div>
            </div>
        )
    }

    render() {
        return (
                <div className="userLoginBox">

                    { this.state.verificationMessage !== null ? 
                        <div className="verificationMessageBox">
                            <p className="verificationMessage">{this.state.verificationMessage}</p>
                        </div>
                    : null }

                    <div className="authFieldBox">
                        <div className="authTitleBox">
                            <img alt="nec-logo" src="images/nec_final_logo.svg" className="authBoxlogo" onclick="window.location='https://www.facebook.com/'"></img>
                            <h1 className="authTitleText">name-to-ethnicity</h1>
                        </div>

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

