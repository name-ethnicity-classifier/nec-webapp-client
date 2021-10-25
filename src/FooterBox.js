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
                <h1 className="footerTitle">name ethnicity classifier</h1>

                <div className="footerLinks">
                    <a href="https://github.com/name-ethnicity-classifier" className="sponsorButton">
                        <img alt="sponsor-icon" src="images/sponsor-icon.png"></img>
                    </a>
                    <a href="https://github.com/name-ethnicity-classifier" className="githubButton">
                        <img alt="github-icon" src="images/github-icon.png"></img>
                    </a>

                    <p className="authorParagraph">created by Theodor Peifer</p>
                    <p className="copyRightParagraph">© copyright 2021 Theodor Peifer</p>
                </div>
            </footer>
        );
    }
}



