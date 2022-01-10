import React from 'react';
import axios from 'axios';
import { Bar } from "react-chartjs-2";
import Dropzone from 'react-dropzone';
import ClassificationPopup from './ClassificationPopupBox'
import Cookies from 'js-cookie';
import FooterBox from './FooterBox';
import config from "./config";


export default class ClassificationBox extends React.Component {
    constructor(props) {
        super(props);

        this.createModelButtons = this.createModelButtons.bind(this);
        this.createModelInformationBox = this.createModelInformationBox.bind(this);
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
        this.closeClassificationPopup = this.closeClassificationPopup.bind(this);
        this.showModelDeletionButton = this.showModelDeletionButton.bind(this);

        this.state = {
            totalModels: {},
            standardModels: {},
            customModels: {},
            chosenModel: null,
            selectedFile: null,
            showClassificationPopup: false,
            showNationalityPopup: true,
            showModelDeletionButton: false
        };
    }

    componentDidMount() {
        axios.get(config.API_URL + "my-models", {
            headers: {
                Authorization: "Bearer " + Cookies.get("token"),
                Email: Cookies.get("email")
            }
        }).then((response) => {
            var customModelList = {};
            var standardModelList = {};
            for (let i=0; i<response.data.length; i++) {
                // use the "name" attr. of the object to make it its key
                var modelName = response.data[i].name;
                delete response.data[i].name;
                if (response.data[i].type === 1) {
                    standardModelList[modelName] = response.data[i];
                }
                else if (response.data[i].type === 0) {
                    customModelList[modelName] = response.data[i];
                }
            }

            this.setState({totalModels: {... standardModelList, ...customModelList}})
            this.setState({standardModels: standardModelList});
            this.setState({customModels: customModelList});

        }, (error) => {
            console.log(error);
        });
    }

    componentDidUpdate() {
        this.createModelButtons("standardModelBox");
        this.createModelButtons("customModelBox");
    }

    createModelButtons(parentClass) {
        var parentDiv = document.getElementsByClassName(parentClass)[0];
        [].forEach.call(parentDiv.querySelectorAll(".chooseModelButton"), function(e) {
            e.parentNode.removeChild(e);
        });

        var buttonDiv = parentDiv.getElementsByClassName("modelScrollDiv")[0];

        if (parentClass === "standardModelBox") {
            var modelList = {...this.state.standardModels};
        }
        else if (parentClass === "customModelBox") {
            var modelList = {...this.state.customModels};
        }

        for (let key in modelList) {
            var modelName = key;
            var modelButton = document.createElement("button");
            modelButton.classList.add("chooseModelButton");

            modelButton.innerText = modelName;
            modelButton.addEventListener("click", (e) => {
                this.setState({chosenModel: null});
                this.setState({chosenModel: key});
            }, false);

            buttonDiv.appendChild(modelButton);
        }
    }

    showNationalityPopup() {
        [].forEach.call(document.querySelectorAll(".modelNationalitiesPresentBox"), function(e) {
            e.parentNode.removeChild(e);
        });

        try {
            var dropIcon = document.getElementsByClassName("dropBoxIcon")[0];
            dropIcon.src = "images/close-drop-icon.svg"
        } 
        catch { 
            ;
        }

        var nationalityPresentDiv = document.createElement("div");
        nationalityPresentDiv.classList.add("modelNationalitiesPresentBox");

        this.state.totalModels[this.state.chosenModel].nationalities.forEach(nationality => {
            var nationalityText = document.createElement("h1");
            nationalityText.classList.add("nationalityListText");
            nationalityText.innerText = nationality;
            nationalityPresentDiv.appendChild(nationalityText);
        });

        var bodyElement = document.getElementsByTagName("body")[0];
        bodyElement.appendChild(nationalityPresentDiv);

        var showNationalitiesButton = document.getElementsByClassName("showNationalitiesButton")[0];
        document.addEventListener("mouseup", (e) => {
            if (showNationalitiesButton.contains(e.target)) {
                
                [].forEach.call(document.querySelectorAll(".modelNationalitiesPresentBox"), function(e) {
                    e.parentNode.removeChild(e);
                });

                var dropIcon = document.getElementsByClassName("dropBoxIcon")[0];
                dropIcon.src = "images/drop-icon.svg"
            }
        });
    }

    fileSelectedHandler = files => {
        if (files.length > 1) {
            alert("Too many files! Please upload just one .csv file.");
        }
        else {
            if (files[0].name.split(".").pop() !== "csv") {
                alert("You have to upload a .csv file!");
            }
            else {
                this.setState({selectedFile: files[0], showClassificationPopup: true});
            }
        }
    }

    showFileFormat() {
        [].forEach.call(document.querySelectorAll(".fileFormatBox"), function(e) {
            e.parentNode.removeChild(e);
        });

        // create format explanation box
        var fileFormatBox = document.createElement("div")
        fileFormatBox.classList.add("fileFormatBox");

        // create format explanation title
        var formatTitle = document.createElement("h1");
        formatTitle.classList.add("formatTitle");
        formatTitle.innerText = "How the .csv should look like:";
        fileFormatBox.appendChild(formatTitle);

        // create format explanation paragraphs
        var explanationText = ["- one column named 'names' containing the names",
                               "- name parts are separated by space", 
                               "- lower and upper case doesn't matter", 
                               "- maximum amount of names: 1024",
                               "- only latin letters (a-z , A-Z) and spaces",
                               "- example (left: formatted, right: raw):"]

        explanationText.forEach(text => {
            var pText = document.createElement("p");
            pText.classList.add("formatExplanation");
            pText.innerText = text;
            fileFormatBox.appendChild(pText);
        })

        // create format example image
        var formatImage = document.createElement("img");
        formatImage.classList.add("formatExampleImage");
        formatImage.src = "images/input-example-csv-short.png";
        fileFormatBox.appendChild(formatImage);

        // create format example image
        var formatImageRaw = document.createElement("img");
        formatImageRaw.classList.add("formatExampleImageRaw");
        formatImageRaw.src = "images/raw-input-example-csv.png";
        fileFormatBox.appendChild(formatImageRaw);

        // create pop-up background overlay
        var popupOverlay = document.createElement("div");
        popupOverlay.classList.add("popupOverlay");

        var bodyElement = document.getElementsByTagName("body")[0];
        bodyElement.appendChild(popupOverlay);
        bodyElement.appendChild(fileFormatBox);

        document.addEventListener("mouseup", (e) => {
            if (popupOverlay.contains(e.target)) {
                
                [].forEach.call(document.querySelectorAll(".fileFormatBox"), function(e) {
                    e.parentNode.removeChild(e);
                });

                [].forEach.call(document.querySelectorAll(".popupOverlay"), function(e) {
                    e.parentNode.removeChild(e);
                });
            }
        });
    }

    showModelDeletionButton() {
        if (this.state.showModelDeletionButton) {
            var modelDeletionButton = document.getElementsByClassName("deleteModelButton")[0];
            modelDeletionButton.classList.add("deleteModelButtonClicked");

            var deletionConfirmationText = document.createElement("p");
            deletionConfirmationText.classList.add("deletionConfirmationText");
            deletionConfirmationText.innerText = "You are about to delete this model! Are you sure you want to do that? Click again to confirm, click outside to abort.";
            modelDeletionButton.appendChild(deletionConfirmationText);

            var deleteModelIcon = document.getElementsByClassName("deleteModelIcon")[0];
            deleteModelIcon.classList.add("deleteModelIconClicked");

            document.addEventListener("mouseup", (e) => {
                if (modelDeletionButton.contains(e.target)) {
                    var modelId = this.state.customModels[this.state.chosenModel]["model_id"]

                    axios.post(config.API_URL + "delete-model", { modelId }, {
                        headers: {
                            Authorization: "Bearer " + Cookies.get("token"),
                            Email: Cookies.get("email")
                        },
                    }).then((response) => {
                        setTimeout((e) => {
                            window.location.reload();
                        }, 500);
                    }, (error) => {
                        ;
                    });
                    
                }
                else {
                    modelDeletionButton.classList.remove("deleteModelButtonClicked");

                    var modelDeletionIcon = document.getElementsByClassName("deleteModelIcon")[0];
                    modelDeletionIcon.classList.remove("deleteModelIconClicked");

                    [].forEach.call(document.querySelectorAll(".deletionConfirmationText"), function(e) {
                        e.parentNode.removeChild(e);
                    });
                    this.setState({showModelDeletionButton: false});
                }
            }, { once: true });

        }
        else {
            ;
        } 
    }

    createModelInformationBox() {
        var chosenModelName = this.state.chosenModel;
        var chosenModelObject = this.state.totalModels[chosenModelName];

        if (chosenModelName === null) {
            return (
                <h1 className="chooseInstruction">choose a model</h1>
            );
        }

        // don't show model information if it wasn't trained yet
        if (chosenModelObject.mode === 1) {
            try {
                // cumpute average F1 score
                var sum = 0;
                chosenModelObject.scores.forEach(score => sum += score);
                var avgScore = sum / chosenModelObject.scores.length;
                var avgScoreXValues = [...Array(chosenModelObject.scores.length)].map((_, i) => avgScore);

                return (
                    <div>
                        <div className="chosenModelInformationBox">
                            <h1 className="chosenModelTitle">chosen model:</h1>

                            <table className="modelInformationTable">
                                <tbody>
                                    <tr>
                                        <td className="modelInfoKey">model name:</td>
                                        <td className="modelInfoValue">{chosenModelName}</td>
                                    </tr>
                                    <tr>
                                        <td className="modelInfoKey">accuracy:</td>
                                        <td className="modelInfoValue">{chosenModelObject.accuracy} %</td>
                                    </tr>
                                    <tr>
                                        <td className="modelInfoKey lastModelInfoKey">nationalities:</td>
                                        <td className="modelInfoValue lastModelInfoValue">

                                            <button className="showNationalitiesButton" onClick={() => { 
                                                this.setState({showNationalityPopup: !this.state.showNationalityPopup});
                                                if (this.state.showNationalityPopup) {
                                                    this.showNationalityPopup();
                                                }
                                            }}>
                                                <p className="nationalityButtonText">{chosenModelObject.nationalities.length}</p>
                                                <img alt="open-dropbox-icon" src="images\drop-icon.svg" className="dropBoxIcon"></img>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="scorePlotBox">
                                <Bar 
                                    height={100} 
                                    width={400} 
                                    data={{
                                        labels: chosenModelObject.nationalities,
                                        datasets: [
                                            {
                                                label: "F1 scores",
                                                data: chosenModelObject.scores,
                                                backgroundColor: "rgba(0, 47, 255, 0.55)",
                                                order: 2
                                            },
                                            {
                                                label: "average F1 score: " + avgScore.toFixed(3),
                                                data: avgScoreXValues,
                                                borderColor: "rgba(60, 247, 200)",
                                                type: "line",
                                                borderWidth: 2,
                                                pointRadius: 1,
                                                fill: false,
                                                order: 1
                                            }
                                        ]
                                    }} 
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true,
                                                    min: 0
                                                }
                                            }],
                                            xAxes: [{
                                                tooltips: {
                                                    callbacks: {
                                                        title: function (tooltipItems, data) {
                                                            return data.labels[tooltipItems[0].index]
                                                        }
                                                    }
                                                }
                                            }]
                                        }
                                    }}
                                />

                                <a className="scoreExplanationLink" href="https://en.wikipedia.org/wiki/F-score" target="_tab" rel="noopener noreferrer">
                                    What's this plot?
                                </a>
                            </div>
                            
                        </div>

                        <div className="uploadBox">
                            <h1 className="uploadBoxTitle">classification:</h1>
                            <h1 className="uploadExplanation">to classify names, put them in a .csv file with 
                                <button className="fileFormatButton" onClick={() => { this.showFileFormat() }}>this</button>
                                format and upload it below.
                            </h1>
                            
                            <Dropzone onDrop={this.fileSelectedHandler}>
                                {({getRootProps, getInputProps}) => (
                                    <div className="fileDropArea" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <h1 className="dropFileInstruction">drop your .csv file here</h1>
                                        <h1 className="selectFileInstruction">or click here to select a file</h1>
                                        <img alt="upload-file-icon" src="images\upload-icon.svg" className="uploadFileIcon"></img>
                                    </div>
                                )}
                            </Dropzone>
                        </div>
                        
                    </div>
                )
            }
            catch { 
                return ( <div></div>)
            }
        }
        else {
            return (
                <div className="tmpModelInformationBox">
                    <h1 className="notReadyMessage">Your model <b>{chosenModelName}</b><br/> is currently being trained. Please come back later!</h1>
                </div>
            )
        }
    }

    closeClassificationPopup() {
        this.setState({showClassificationPopup: false})
    }

    render() {
        return (
            <div className="classificationBox">
                <div className="inner">
                    <h1 className="classificationTitle">classify names</h1>
                    
                    <div className="modelBox">
                        <h1 className="modelBoxTitle">models:</h1>

                        <div className="customModelBox">
                            <h1 className="modelListTitle">your custom models</h1>
                            <div className="modelScrollDiv"></div>
                        </div>

                        <div className="standardModelBox">
                            <h1 className="modelListTitle">our standard models:</h1>
                            <div className="modelScrollDiv"></div>
                        </div>
                    </div>

                    <div className="modelInformationBox">
                        {this.createModelInformationBox()}
                    </div>
                    {
                        this.state.customModels.hasOwnProperty(this.state.chosenModel) ?
                            <button className="deleteModelButton" title="delete model" onClick={() => { 
                                this.setState({showModelDeletionButton: true});                        
                            }}>
                                <img className="deleteModelIcon" alt="trash-icon" src="images/trash-icon.svg"></img>
                            </button>
                    : null}
                    

                    {this.state.showModelDeletionButton ? this.showModelDeletionButton() : null}
                    {this.state.showClassificationPopup ? <ClassificationPopup modelName={this.state.chosenModel} submittedFile={this.state.selectedFile} stopRenderingHandler={this.closeClassificationPopup}/> : null}
                </div>
                <FooterBox/>
            </div>

        );
    }
}


