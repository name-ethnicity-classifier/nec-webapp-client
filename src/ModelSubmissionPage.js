import React from "react";
import axios from "axios";
import PresentBox from "./PresentBox";
import DatasetChoosingBox from "./DatasetChoosingBox";
import Cookies from "js-cookie";
import FooterBox from "./FooterBox";
import ShadowButton from "./ShadowButton";
import config from "./config";


export default class ModelSubmissionBox extends React.Component {
    constructor(props) {
        super(props);

        this.showHelpPopup = this.showHelpPopup.bind(this);
        this.openDatasetSelection = this.openDatasetSelection.bind(this);
        this.handleDatasetState = this.handleDatasetState.bind(this);
        this.gatherDatasetInformation = this.gatherDatasetInformation.bind(this);
        this.changeModelName = this.changeModelName.bind(this);
        this.confirmRequestBox = this.confirmRequestBox.bind(this);
        this.checkModelNameDuplicate = this.checkModelNameDuplicate.bind(this);
        this.checkRequest = this.checkRequest.bind(this);

        this.state = {
            totalUserModels: [],
            editDatasetTitle: "choose",
            showDatasetInfo: false,
            showModelInfo: false,
            showDatasetSelection: false,
            initialNationalities: [],
            initialNationalityGroups: [],
            availableNationalityGroups: [],
            chosenNationalityGroups: [],
            availableNationalities: [],
            chosenNationalities: [],
            datasetType: "nationalities",
            // dataset information states
            modelName: null,
            nationalityAmount: 0,
            namesPerNationality: 0,
            totalNames: 0,
            showConfirmationBox: false
        }
    }

    componentDidMount() {
        axios.get(config.API_URL + "nationalities")
        .then((response) => {
            // convert nationality json object to list
            var nationalityData = response.data["nationalities"];
            var dataList = [];
            for(let key in nationalityData) {
                dataList.push([key, nationalityData[key]]);
            }
            this.setState({availableNationalities: dataList, chosenNationalities: [["else", 1]], initialNationalities: dataList });

            var nationalityGroupData = response.data["nationalityGroups"];
            var dataList = [];
            for(let key in nationalityGroupData) {
                dataList.push([key, nationalityGroupData[key]]);
            }
            this.setState({availableNationalityGroups: dataList, chosenNationalityGroups: [["else", 1]], initialNationalityGroups: dataList });

        }, (err) => {
            ;
        });

        axios.get(config.API_URL + "my-models",  {
            headers: {
                Authorization: "Bearer " + Cookies.get("token"),
                Email: Cookies.get("email")
            }
        }).then((response) => {
            this.setState({totalUserModels: response.data})
        }, (err) => {
            ;
        });
    }

    showHelpPopup(presentType) {
        var bodyElement = document.getElementsByTagName("body")[0];
        var popupOverlay = document.createElement("div");
        popupOverlay.classList.add("popupOverlay");
        bodyElement.appendChild(popupOverlay);
    
        document.addEventListener("mouseup", (e) => {
            if (popupOverlay.contains(e.target)) {
                
                [].forEach.call(document.querySelectorAll(".popupOverlay"), function(e) {
                    e.parentNode.removeChild(e);
                });

                if (presentType !== "both") {
                    [].forEach.call(document.querySelectorAll(presentType + "PresentBox"), function(e) {
                        e.parentNode.removeChild(e);
                    });
                }
                else {
                    [].forEach.call(document.querySelectorAll("datasetPresentBoxBoth modelPresentBoxBoth"), function(e) {
                        e.parentNode.removeChild(e);
                    });
                }

                this.setState({showDatasetInfo: false, showModelInfo: false});
            }
        });
    }

    openDatasetSelection() {
        var bodyElement = document.getElementsByTagName("body")[0];
        var popupOverlay = document.createElement("div");
        popupOverlay.classList.add("popupOverlay");
        bodyElement.appendChild(popupOverlay);

        document.addEventListener("mouseup", (e) => {
            if (popupOverlay.contains(e.target)) {
                
                [].forEach.call(document.querySelectorAll(".popupOverlay"), function(e) {
                    e.parentNode.removeChild(e);
                });

                [].forEach.call(document.querySelectorAll("datasetChoosingBox"), function(e) {
                    e.parentNode.removeChild(e);
                });

                this.setState({showDatasetSelection: false});
            }
        });
    }

    handleDatasetState(availableNationalityList, chosenNationalityList, currentDatasetType) {
        if (currentDatasetType === "nationalities") {
            this.setState({ availableNationalities: availableNationalityList, chosenNationalities: chosenNationalityList });
        }
        else if (currentDatasetType === "nationality groups") {
            this.setState({ availableNationalityGroups: availableNationalityList, chosenNationalityGroups: chosenNationalityList });
        }
        this.setState({ datasetType: currentDatasetType });
        this.setState({ showDatasetSelection: false });

        [].forEach.call(document.querySelectorAll(".chosenNationalityText"), function(e) {
            e.parentNode.removeChild(e);
        });

        var customDatasetDiv = document.getElementsByClassName("customDatasetPresentBox")[0]; 
        for(let i=0; i<chosenNationalityList.length; i++) {
            var nationalityPresentList = document.createElement("p");
            nationalityPresentList.classList.add("chosenNationalityText");

            nationalityPresentList.innerText = chosenNationalityList[i][0];
            nationalityPresentList.title = chosenNationalityList[i][0] + ": " + chosenNationalityList[i][1];
            customDatasetDiv.appendChild(nationalityPresentList);
        }

        this.gatherDatasetInformation(chosenNationalityList);
    }

    gatherDatasetInformation(chosenNationalityList) {
        var chosenNationalities = [...chosenNationalityList];
        var nationalityAmount = chosenNationalities.length;

        if (nationalityAmount > 1) {
            // dont count the amount of "else"
            var startCompareIdx = 0;
            if (chosenNationalities[startCompareIdx][0] === "else") {
                startCompareIdx = 1;
            }

            var nameMinimum = chosenNationalities[startCompareIdx][1];
            for (let i=1; i<nationalityAmount; i++) {
                if (chosenNationalities[i][0] !== "else" && chosenNationalities[i][1] < nameMinimum) {
                    nameMinimum = chosenNationalities[i][1];
                }
            }
            var totalNames = nationalityAmount * nameMinimum;
            this.setState({nationalityAmount: nationalityAmount, namesPerNationality: nameMinimum, totalNames: totalNames})
        }
    }

    changeModelName(event) {
        if (event.key === "Enter") {
            this.setState({modelName: document.getElementsByClassName("modelNameField")[0].value});
            var inputField = document.getElementsByClassName("modelNameField")[0];
            inputField.placeholder = inputField.value;
            inputField.value = "";
        }
    }

    checkModelNameDuplicate() {
        var modelData = this.state.totalUserModels;
    
        for (let i=0; i<modelData.length; i++) {
            if (this.state.modelName === modelData[i].name) {
                return true;
            }
        }
        return false;
    }

    checkRequest() {
        if (this.state.modelName === null || this.state.modelName.length <= 1 || this.state.modelName.length > 50) {
            var modelNameField = document.getElementsByClassName("modelNameField")[0];
            modelNameField.style.borderColor = "rgb(247, 148, 148)";
            modelNameField.placeholder = "invalid dataset name (min: 2, max: 40)";

            document.addEventListener("mouseup", function handler(e) {
                modelNameField.style.borderColor = "rgb(224, 224, 224)";
                modelNameField.placeholder = "enter your dataset name here...";
                e.currentTarget.removeEventListener(e.type, handler)
            });
        }
        else if (this.checkModelNameDuplicate()) {
            var modelNameField = document.getElementsByClassName("modelNameField")[0];
            modelNameField.style.borderColor = "rgb(247, 148, 148)";
            modelNameField.placeholder = "name already exists!";
    
            document.addEventListener("mouseup", function handler(e) {
                modelNameField.style.borderColor = "rgb(224, 224, 224)";
                modelNameField.placeholder = "enter your dataset name here...";
                e.currentTarget.removeEventListener(e.type, handler)
            });
        }
        else if (this.state.nationalityAmount < 2) {
            var datasetInstructionText = document.getElementsByClassName("datasetInstructionText")[0];
            datasetInstructionText.innerText = "please choose nationalities!"
            datasetInstructionText.style.color = "rgb(218, 134, 134)";
        }
        else {
            this.setState({showConfirmationBox: true});
        }
    }

    confirmRequestBox() {
        [].forEach.call(document.querySelectorAll(".confirmationPopupOverlay"), function(e) {
            e.parentNode.removeChild(e);
        });
        
        var bodyElement = document.getElementsByTagName("body")[0];
        var popupOverlayy = document.createElement("div");
        popupOverlayy.classList.add("confirmationPopupOverlay");
        bodyElement.appendChild(popupOverlayy);

        return (
            <div className="confirmationBox">
                <h1 className="confirmationTitle">Are you sure you want to request a model trained on your chosen <i>{this.state.nationalityAmount}</i> nationalities?</h1>

                <p className="confirmationText">If you click on "request", the model will be automatically trained for you. 
                Please check the "classify names" section in the next few hours to see if it's ready to use!</p>

                <ShadowButton class="confirmRequestButton" text="request" onClickFunction={() => {
                    [].forEach.call(document.querySelectorAll(".confirmationPopupOverlay"), function(e) {
                        e.parentNode.removeChild(e);
                    });
                     
                    this.setState({showConfirmationBox: false});
                    if (this.state.datasetType === "nationalities") {
                        submitModelRequest(this.state.chosenNationalities, this.state.modelName, false);
                    }
                    else {
                        submitModelRequest(this.state.chosenNationalityGroups, this.state.modelName, true);
                    }
                }} styles={{
                    width: "130px", 
                    height:"50px", 
                    color: "rgb(63, 124, 247)", 
                    borderWidth: "4px", 
                    borderRadius: "5px", 
                    fontSize: "21px", 
                    fontFamily: "inherit"
                }}/> 

                <ShadowButton class="cancelRequestButton" text="cancel" onClickFunction={() => {
                    [].forEach.call(document.querySelectorAll(".confirmationPopupOverlay"), function(e) {
                        e.parentNode.removeChild(e);
                    });
                    this.setState({showConfirmationBox: false});
                }} styles={{
                    width: "130px", 
                    height:"50px", 
                    color: "rgb(255, 77, 77)", 
                    borderWidth: "4px", 
                    borderRadius: "5px", 
                    fontSize: "21px", 
                    fontFamily: "inherit"
                }}/> 

            </div>
        )
    }

    render() {

        return (
            <div className="modelSubmissionBox">
                <div className="inner">
                    <h1 className="pageTitle">choose nationalities to request your model:</h1>

                    <div className="helpBox">
                        <h1 className="helpTitle">to help you choose:</h1>
                        <div className="subHelpBox">
                            <p className="helpText">Take a look at all the existing nationalities in the dataset and how many names there are.</p>
                            <p className="helpText">Keep in mind that in the end, the amount of names per nationality in your custom dataset will be equal to the amount of names of the nationality with the fewest names in the dataset.</p>
                            <button className="helpButton" onClick={() => {
                                this.setState({showDatasetInfo: true});
                                this.showHelpPopup("dataset");
                            }}>inspect dataset</button>
                        </div>

                        <div className="subHelpBox">
                            <p className="helpText">Take a look at our already trained models to see what nationality configuration brings which accuracy.</p>
                            <p className="helpText">This will help you estimate how good the model might perform, so you can decide if it will meet your expectations.</p>
                            <button className="helpButton" onClick={() => { 
                                this.setState({showModelInfo: true});
                                this.showHelpPopup("model");
                            }}>inspect models</button>
                        </div>

                        <button className="smallHelpButton" onClick={() => {
                            this.setState({showDatasetInfo: true, showModelInfo: true})
                            this.showHelpPopup("both");
                        }}>inspect both</button>

                        { 
                            this.state.showDatasetInfo && !this.state.showModelInfo ? 
                                <PresentBox propClassName={"datasetPresentBox"} type={"nationalityData"} boxTitle={"the dataset"} keys={["nationality", "amount"]} searchBar={true}/>
                            : null
                        }
                        {
                            this.state.showModelInfo && !this.state.showDatasetInfo ? 
                                <PresentBox propClassName={"modelPresentBox"} type={"modelData"} boxTitle={"model examples"} keys={["model name", "accuracy"]}/>
                            : null
                        }
                        { 
                            this.state.showModelInfo && this.state.showDatasetInfo ? 
                                <div className="bothPresentBox">
                                    <PresentBox propClassName={"datasetPresentBoxBoth"} type={"nationalityData"} boxTitle={"the dataset"} keys={["nationality", "amount"]} searchBar={true}/>
                                    <PresentBox propClassName={"modelPresentBoxBoth"} type={"modelData"} boxTitle={"model examples"} keys={["model name", "accuracy"]}/>
                                </div>
                            : null
                        }
                    </div>

                    <div className="requestModelBox">

                        <div className="modelNameBox">
                            <h1 className="modelNameTitle">model name:</h1>
                            <input type="text" placeholder="give your model a descriptive name..." className="modelNameField" onKeyDown={(event) => 
                                this.changeModelName(event)}>
                            </input>
                        </div>
                            
                        <h1 className="requestModelTitle">request model:</h1>

                        <div className="customDatasetBox">
                            <h1 className="customDatasetTitle">your nationalities:</h1>
                            
                            <button className="editDatasetButton" onClick={() => {
                                this.setState({showDatasetSelection: true});
                                this.openDatasetSelection();
                                this.setState({editDatasetTitle: "change"});
                            }}>{this.state.editDatasetTitle}</button>

                            {
                                this.state.showDatasetSelection ? 
                                    <DatasetChoosingBox datasetStateHandler={this.handleDatasetState}
                                        datasetType={this.state.datasetType}

                                        initialNationalityList={this.state.initialNationalities}
                                        availableNationalityList={this.state.availableNationalities}
                                        chosenNationalityList={this.state.chosenNationalities}

                                        initialNationalityGroupList={this.state.initialNationalityGroups}
                                        availableNationalityGroupList={this.state.availableNationalityGroups}
                                        chosenNationalityGroupList={this.state.chosenNationalityGroups}
                                    />
                                : null
                                
                            }

                            <div className="customDatasetPresentBox">
                                {this.state.chosenNationalities.length === 1 && this.state.chosenNationalityGroups.length === 1 ? <p className="datasetInstructionText">click on "choose" to select nationalities</p> : null}
                            </div>

                        </div>

                        <div className="datasetInformationBox">
                            <h1 className="datasetInformationTitle">dataset information:</h1>
                            <table className="datasetInformationTable">
                                <tbody>
                                    
                                    <tr>
                                        <td className="infoKey">nationality amount:</td>
                                        <td className="infoValue">{this.state.nationalityAmount}</td>
                                    </tr>
                                    <tr>
                                        <td className="infoKey">amount of names per nationality:</td>
                                        <td className="infoValue">{this.state.namesPerNationality}</td>
                                    </tr>
                                    <tr>
                                        <td className="infoKey">total amount of names:</td>
                                        <td className="infoValue">{this.state.totalNames}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <ShadowButton class="requestModelButton" text="request model" onClickFunction={this.checkRequest} styles={{
                            width: "180px", height:"70px", color: "rgb(63, 124, 247)", borderWidth: "4px", borderRadius: "5px", fontSize: "20px", fontFamily: "inherit"
                        }}/> 

                        {this.state.showConfirmationBox ? this.confirmRequestBox() : null}

                    </div>
                </div>
            </div>
        );
    }
}


function createSuccessStyle(className, message) {
    var button = document.getElementsByClassName(className)[0];
    button.style.borderColor = "rgb(0, 218, 189)";
    button.style.color = "rgb(0, 218, 189)";
    button.textContent = message;
    button.disabled = true;
}


function submitModelRequest(chosenNationalities, modelName, isGroupLevel) {
    var nationalityString = chosenNationalities.map(
        function(nationality) {
            return nationality[0];
        }
    ).join('", "');
    nationalityString = '{"' + nationalityString + '"}';

    // TODO: add submission to API server
    var modelInformation = {
        "name": modelName,
        "description": "-",
        "nationalities": nationalityString,
        "isGroupLevel": isGroupLevel
    };

    axios.post(config.API_URL + "create-model", 
        modelInformation, 
        {
            headers: {
                Authorization: "Bearer " + Cookies.get("token"),
                Email: Cookies.get("email")
            }
        }
    ).then((response) => {
        createSuccessStyle("s-button-requestModelButton", "model requested!");
        
        setTimeout((e) => {
            window.location.reload();
        }, 2000);

    }, (error) => {
        if (error.response.data.error === "tooManyModelCreations") {
            alert("You are requesting too many models! In order to prevent spam, please wait 2 minutes before requesting again. Thank you!");
        }
        else if (error.response.status === 401) {
            alert("Authentication expired. Please re-login!");
            Cookies.remove("email");
            Cookies.remove("token");
            window.location.href = "/login";
        }
        
    });
}


/*
old request confirmation button:

<button className="confirmRequestButton" onClick={() => {
    [].forEach.call(document.querySelectorAll(".confirmationPopupOverlay"), function(e) {
        e.parentNode.removeChild(e);
    });
        
    this.setState({showConfirmationBox: false});
    if (this.state.datasetType === "nationalities") {
        submitModelRequest(this.state.chosenNationalities, this.state.modelName);
    }
    else {
        console.log(this.state.chosenNationalityGroups)
        this.setState({ chosenNationalityGroups: this.state.chosenNationalityGroups.push(["areNationalityGroups", 0]) })
        console.log(this.state.chosenNationalityGroups)
        submitModelRequest(this.state.chosenNationalityGroups, this.state.modelName);
    }
}}>request</button>
*/
