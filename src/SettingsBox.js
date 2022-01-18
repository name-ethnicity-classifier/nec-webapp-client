import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ShadowButton from "./ShadowButton";
import config from "./config";
import { Portal } from 'react-portal';


export default class SettingsBox extends React.Component {
    constructor(props) {
        super(props);

        this.submitPasswordChange = this.submitPasswordChange.bind(this);
        
        this.state = {
            showChangePasswordSetting: false,
            showDeleteUserSetting: false,
            password: "",
            newPassword: "",
            newRepeatedPassword: "",
        };
    }

    componentDidMount() {
        this.slideDivsOnScroll()
    }

    slideDivsOnScroll() {
        // code based on yt video: ...
        const sliders = document.querySelectorAll(".slideInRight");

        const slideOptions = {
            threshold: 0.25
        };

        const appearOnMount = new IntersectionObserver(
            function(entries, appearOnMount) {
                entries.forEach(entry => {

                        entry.target.classList.add("appear");
                        appearOnMount.unobserve(entry.target);
                })
            }, slideOptions);

            sliders.forEach(slider => {
                appearOnMount.observe(slider);
            });
    }

    createFieldErrorStyle(className, placeholderErrorText, placeholderActualText) {
        var inputField = document.getElementsByClassName(className)[0];
        inputField.value = "";
        inputField.placeholder = placeholderErrorText;
        inputField.style.borderColor = "red";
        inputField.style.boxShadow = "1px 2px 4px rgba(255, 0, 0, 0.25)";

        inputField.addEventListener("mouseup", function(e) {
            inputField.placeholder = placeholderActualText;
            inputField.style.borderColor = "";
            inputField.style.boxShadow = "";
            inputField.removeEventListener("mouseup", this);
        });
    }

    submitPasswordChange() {
        if (this.state.password.length < 10) {
            this.createFieldErrorStyle("oldPasswordField", "please enter your password!", "please enter your password");
            return null;
        }
        else if (this.state.newPassword.length < 10 || !/\d/.test(this.state.newPassword)) {
            this.createFieldErrorStyle("newPasswordField", "min 10 characters, at least 1 number!", "min 10 characters, at least 1 number");
            return null;
        }
        else if (this.state.newPassword !== this.state.newRepeatedPassword) {
            this.createFieldErrorStyle("newRepeatedPasswordField", "this doesn't match your password!", "min 10 characters, at least 1 number");
            return null;
        }
        else {
            var data = {
                email: Cookies.get("email"),
                password: this.state.password,
                newPassword: this.state.newPassword
            }

            axios.post(config.API_URL + "change-password", data,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                        Email: Cookies.get("email")
                    }
                }
            ).then((response) => {
                var submitButton = document.getElementsByClassName("s-button-submitNewPasswordButton")[0];
                submitButton.textContent = "changed!";
                submitButton.disabled = true;
                setTimeout(() => {
                    this.setState({showChangePasswordSetting: false});
                }, 2000)

            }, (error) => {
                this.createFieldErrorStyle("oldPasswordField", "wrong password!", "please enter your password");
            });
        }
    }

    changePasswordPopup() {
        return (
            <Portal node={document && document.getElementById("root")}>
                <div className="settingPopup">
                    <h1 className="settingPopupTitle">change password</h1>
                    
                    <label className="authLabel oldPasswordLabel">password</label>
                    <input type="password" placeholder="enter your password" value={this.state.password} onChange={(e) => {
                        this.setState({password: e.target.value})
                    }} className="authField oldPasswordField"/>

                    <label className="authLabel newPasswordLabel">new password</label>
                    <input type="password" placeholder="min 10 characters, at least 1 number" value={this.state.newPassword} onChange={(e) => {
                        this.setState({newPassword: e.target.value})
                    }} className="authField newPasswordField"/>

                    <label className="authLabel newRepeatedPasswordLabel">repeat new password</label>
                    <input type="password" placeholder="min 10 characters, at least 1 number" value={this.state.newRepeatedPassword} onChange={(e) => {
                        this.setState({newRepeatedPassword: e.target.value})
                    }} className="authField newRepeatedPasswordField"/>

                    <ShadowButton class="submitNewPasswordButton" text="change" onClickFunction={this.submitPasswordChange} styles={{
                        width: "120px",
                        height: "47px",
                        fontSize: "21px",
                        fontFamily: "inherit",
                        color: "rgb(63, 124, 247)",
                        borderRadius: "5px",
                        borderWidth: "4px",
                        opacity: ".15"
                    }}/>
                </div>
            </Portal>
        );
    }

    submitUserDeletion() {
        if (this.state.password.length < 10) {
            this.createFieldErrorStyle("confirmationPasswordField", "please enter your password!", "please enter your password");
            return null;
        }
        else {
            var data = {
                email: Cookies.get("email"),
                password: this.state.password,
            };

            axios.post(config.API_URL + "delete-user", 
                data,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                        Email: Cookies.get("email")
                    }
                }
            ).then((response) => {
                var confirmButton = document.getElementsByClassName("s-button-confirmDeletionButton")[0];
                confirmButton.textContent = "deleted";
                confirmButton.disabled = true;
                setTimeout(() => {
                    this.setState({showDeleteUserSetting: false});
                    Cookies.remove("email");
                    Cookies.remove("token");
                    window.location.href = "/";
                }, 2000)

            }, (error) => {
                this.createFieldErrorStyle("confirmationPasswordField", "wrong password!", "please enter your password");
            });
        }
    }

    deleteUserPopup() {
        return (
            <Portal node={document && document.getElementById("root")}>
                <div className="settingPopup">
                    <h1 className="settingPopupTitle">delete user</h1>

                    <label className="authLabel confirmationPasswordLabel">confirm with your password</label>
                    <input type="password" placeholder="enter your password" value={this.state.password} onChange={(e) => {
                        this.setState({password: e.target.value})
                    }} className="authField confirmationPasswordField"/>

                    <b><p className="confirmDeletionText">Are you sure you want to delete your account?</p></b>
                    
                    <ShadowButton class="confirmDeletionButton" text="yes" onClickFunction={() => {
                        this.submitUserDeletion();
                    }} styles={{
                        width: "130px", 
                        height:"50px", 
                        color: "rgb(255, 77, 77)", 
                        borderWidth: "4px", 
                        borderRadius: "5px", 
                        fontSize: "21px", 
                        fontFamily: "inherit"
                    }}/> 

                    <button className="cancelDeletionButton" onClick={() => {
                        this.setState({showDeleteUserSetting: false});
                    }}>cancel</button>
                </div>
            </Portal>
        );
    }

    unmount() {
        try {
            var settingPopup = document.getElementsByClassName("settingPopup")[0]
            document.getElementById("root").removeChild(settingPopup)
        }
        catch {
            ;
        }

        this.props.stopRenderingHandler();
    }

    render() {
        return (
            <div className="settingsBox">
                <button className="closeSettingsButton" onClick={() => {
                    this.unmount();
                }}><img alt="close-icon" className="closeIcon" src="images/maximize-icon.svg"></img></button>

                <div className="userSettingsBox">
                    <h1 className="settingsTitle">user settings</h1>

                    <div className="currentAccountBox" id="firstBox">
                        <b><p className="currentAccountLabel">logged in as:</p></b>
                        <p className="currentAccountEmail">{Cookies.get("email")}</p>
                    </div>


                    {/*<button className="settingButton" id="firstBox" onClick={() => {
                        this.setState({showChangePasswordSetting: true, showDeleteUserSetting: false});
                    }}>
                        <img alt="email-icon" className="settingsIcon" src="images/password-icon.svg"></img>
                        <b><pre className="settingText">               change password</pre></b>
                    </button>*/}

                    <button className="settingButton" onClick={() => {
                        this.setState({showChangePasswordSetting: false, showDeleteUserSetting: true});
                    }}>
                        <img alt="email-icon" className="settingsIcon" src="images/delete-account-icon.svg"></img>
                        <b><pre className="settingText">               delete your account</pre></b>
                    </button>

                    <button className="settingButton" onClick={() => {
                        Cookies.remove("email");
                        Cookies.remove("token");
                        window.location.href = "/";
                    }}>
                        <img alt="email-icon" className="settingsIcon" src="images/logout-icon.svg"></img>
                        <b><pre className="settingText">               log out</pre></b>
                    </button>

                    {this.state.showChangePasswordSetting ? this.changePasswordPopup() : null}
                    {this.state.showDeleteUserSetting ? this.deleteUserPopup() : null}

                </div>

                <div className="legalBox">
                    <h1 className="settingsTitle">legal</h1>

                    <div className="informationSection" id="firstBox">
                        <b><p className="informationSectionTitle">privacy policy:</p></b>
                        <a className="informationSectionText" id="linkText" href="/privacy-policy">here</a>
                    </div>

                    <div className="informationSection">
                        <b><p className="informationSectionTitle">terms of service:</p></b>
                        <a className="informationSectionText" id="linkText" href="/terms-of-service">here</a>
                    </div>
                </div>

                <div className="contactBox">
                    <h1 className="settingsTitle">contact</h1>

                    <div className="informationSection" id="firstBox">
                        <b><p className="informationSectionTitle">creator:</p></b>
                        <p className="informationSectionText">Theodor Peifer</p>
                    </div>

                    <div className="informationSection">
                        <b><p className="informationSectionTitle">email:</p></b>
                        <p className="informationSectionText">teddypeifer@gmail.com</p>                    
                    </div>

                    <div className="informationSection">
                        <b><p className="informationSectionTitle">source code:</p></b>
                        <a className="informationSectionText" id="linkText" href="https://github.com/hollowcodes/nec-webapp">on Github</a>
                    </div>

                    <div className="contactInquirySection">
                        <b><p className="informationSectionTitle">Please contact us if you ...</p></b>
                        <p className="contactInquiryText">... have any questions or problems.</p>
                        <p className="contactInquiryText">... found a bug.</p>
                        <p className="contactInquiryText">... have suggestions for improvement.</p>
                        <p className="contactInquiryText">... want to contribute to this project.</p>
                    </div>

                </div>

            </div>
        );
    }
}
