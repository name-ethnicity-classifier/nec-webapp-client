import React from "react";



export default class FooterBox extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
        };
    }

    render() {
        return (
            <footer className="footer">
                <img alt="nec-logo" src="images/nec_final_logo_white.svg" className="footerBoxlogo"></img>
                <h1 className="footerTitle">name-to-ethnicity</h1>

                <div className="footerLinkDiv">
                    <button className="footerLinkButton smallerFooterButton" onClick={() => {
                        window.open(
                            "https://github.com/name-ethnicity-classifier",
                            "_blank"
                        );
                    }}>
                        <img alt="githubIcon" className="footerLinkIcon" src="images/github-icon.png"></img>
                        <p className="footerLinkText">Github</p>
                    </button>

                    <button className="footerLinkButton" onClick={() => {
                        window.open(
                            "/privacy-policy"
                        );
                    }}>
                        <img alt="privacyPolicyIcon" className="footerLinkIcon" src="images/privacy-policy-icon.svg"></img>
                        <p className="footerLinkText">privacy &#8211; policy</p>
                    </button>

                    <button className="footerLinkButton smallerFooterButton" onClick={() => {
                        window.open(
                            "https://github.com/name-ethnicity-classifier",
                            "_blank"
                        );
                    }}>
                        <img alt="sponsorIcon" className="footerLinkIcon" src="images/sponsor-icon.svg"></img>
                        <p className="footerLinkText">sponsor</p>
                    </button>

                    <button className="footerLinkButton" onClick={() => {
                        window.open(
                            "/terms-of-service"
                        );
                    }}>
                        <img alt="termsOfServiceIcon" className="footerLinkIcon" src="images/terms-of-service-icon.svg"></img>
                        <p className="footerLinkText">terms of service</p>
                    </button>
                </div>
                <p className="copyRightText">© copyright 2022, Theodor Peifer (teddypeifer@gmail.com)</p>
                
                <div className="goTopBackground">
                    <button className="goTopButton" onClick={() => {
                        window.location.href="/#";
                    }}>
                        <img alt="goTopIcon" className="goUpIcon" src="images/arrow-up-icon.svg"></img>
                    </button>
                </div>

            </footer>
        );
    }
}



