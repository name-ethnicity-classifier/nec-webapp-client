import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "./config";


export default class ClassificationPopup extends React.Component {
    constructor(props) {
        super(props);

        this.handlePopupoverlay = this.handlePopupoverlay.bind(this);

        this.state = {
            showClassifyButton: true,
            showLoadingScreen: true,
            showDownloadButton: false,
            outputFileContent: null
        };
    }

    postFile() {
        this.setState({showClassifyButton: false, showLoadingScreen: true});

        var formData = new FormData();
        formData.append("file", this.props.submittedFile)

        axios.post(config.API_URL + "classify-names", formData, {
            headers: {
                Authorization: "Bearer " + Cookies.get("token"),
                Email: Cookies.get("email"),
                Model: this.props.modelName
            }
        }).then((response) => {
            if (response.status === 200) {
                this.setState({outputFileContent: response.data});
                this.setState({showLoadingScreen: false, showDownloadButton: true});
            }
        }, (error) => {
            if (error.response.data.error === "wrongFileExtension") {
                alert("You have to upload a .csv file!");
            }
            else if (error.response.status === 401) {
                alert("Authentication expired. Please re-login!");
                Cookies.remove("email");
                Cookies.remove("token");
                window.location.href = "/login";
            }
            else if (error.response.status === 400) {
                var classificationTitle = document.getElementsByClassName("classificationProcessTitle")[0];
                classificationTitle.innerText = "classification failed!";

                var statusImage = document.getElementsByClassName("loadingGif")[0];
                statusImage.src = "images/failed.svg";

                setTimeout(() => {
                    this.unmount();
                }, 3000);
            }
        });
    }

    renderClassifyButton() {
        var classificationPopup = document.getElementsByClassName("classificationPopup")[0];
        var classificationTitleBox = document.getElementsByClassName("classificationTitleBox")[0];

        // create title
        var classificationTitle = document.createElement("h1");
        classificationTitle.classList.add("classificationProcessTitle");
        classificationTitle.classList.add("tmpClass");
        classificationTitle.innerText = "file name: " + this.props.submittedFile.name;
        classificationTitleBox.appendChild(classificationTitle);

        // create classification button
        var classifyButton = document.createElement("button");
        classifyButton.classList.add("classifyButton");
        classifyButton.classList.add("tmpClass");

        classifyButton.innerText = "classify";
        classifyButton.addEventListener("click", (e) => {
            this.postFile();
        }, false);
        classificationPopup.appendChild(classifyButton);

        // create classification shadow box
        var buttonShadow = document.createElement("div");
        buttonShadow.classList.add("buttonShadowBox");
        buttonShadow.classList.add("tmpClass");
        classificationPopup.appendChild(buttonShadow);
    }

    renderLoadingScreen() {
        var classificationPopup = document.getElementsByClassName("classificationPopup")[0];
        var classificationTitleBox = document.getElementsByClassName("classificationTitleBox")[0];

        // create title
        var classificationTitle = document.createElement("h1");
        classificationTitle.classList.add("classificationProcessTitle");
        classificationTitle.classList.add("tmpClass");
        classificationTitle.innerText = "classifying...";
        classificationTitleBox.appendChild(classificationTitle);

        // add loading GIF
        var loadingGif = document.createElement("img");
        loadingGif.classList.add("loadingGif");
        loadingGif.classList.add("tmpClass");
        loadingGif.src = "images/loading.gif";
        classificationPopup.appendChild(loadingGif);
    }

    renderDownloadButton() {
        var classificationPopup = document.getElementsByClassName("classificationPopup")[0];
        var classificationTitleBox = document.getElementsByClassName("classificationTitleBox")[0];

        // create title
        var classificationTitle = document.createElement("h1");
        classificationTitle.classList.add("classificationProcessTitle");
        classificationTitle.innerText = "classified!";
        classificationTitleBox.appendChild(classificationTitle);

        // create classification button
        var downloadButton = document.createElement("button");
        downloadButton.classList.add("downloadButton");
        downloadButton.innerText = "download";
        downloadButton.addEventListener("click", (e) => {
            downloadButton.classList.add("clicked");

            var pom = document.createElement("a");
            var blob = new Blob([this.state.outputFileContent], {type: "text/csv;charset=utf-8;"});
            var url = URL.createObjectURL(blob);
            pom.href = url;
            pom.setAttribute("download", "ethnicities.csv");
            pom.click();

            setTimeout(() => {
                this.unmount();
            }, 1500);

        }, false);
        classificationPopup.appendChild(downloadButton);

        // create classification shadow box
        var buttonShadow = document.createElement("div");
        buttonShadow.classList.add("buttonShadowBox");
        buttonShadow.classList.add("tmpClass");
        classificationPopup.appendChild(buttonShadow);
    }

    handlePopupoverlay(mode) {
        [].forEach.call(document.querySelectorAll(".popupOverlay"), function(e) {
            e.parentNode.removeChild(e);
        });

        if (mode === "remove") {
            return ;
        }

        var popupOverlay = document.createElement("div");
        popupOverlay.classList.add("popupOverlay");

        var bodyElement = document.getElementsByTagName("body")[0];
        bodyElement.appendChild(popupOverlay);
    }

    componentDidMount() {
        this.handleClassificationPopup();
    }

    componentDidUpdate() {
        this.handleClassificationPopup();
    }

    unmount() {
        this.handlePopupoverlay("remove");
        this.props.stopRenderingHandler();
    }

    handleClassificationPopup() {
        [].forEach.call(document.querySelectorAll(".tmpClass"), function(e) {
            e.parentNode.removeChild(e);
        });

        if (this.state.showClassifyButton) {
            this.renderClassifyButton();
        }
        else if (this.state.showLoadingScreen) {
            this.renderLoadingScreen();
        }
        else if (this.state.showDownloadButton) {
            this.renderDownloadButton();
        }
    }

    render() {
        this.handlePopupoverlay("show");

        return (
            <div className="classificationPopup">
                <div className="classificationTitleBox"></div>

                <button className="cancelClassificationButton" onClick={() => {
                    this.unmount();
                }}>cancel</button>
            </div>
        );
    }
}
