import React from "react";


export default class DatasetChoosingBox extends React.Component {
    constructor(props) {
        super(props);
        
        this.selectNationalityButtons = this.selectNationalityButtons.bind(this);
        this.createButtonDiv = this.createButtonDiv.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.refAvailableNationalities = React.createRef();
        this.refChosenNationalities = React.createRef();

        this.state = {
            availableNationalityList: [],
            chosenNationalityList: [],
            chosenDatasetType: this.props.datasetType,
        }
    }

    createButtonDiv(selectionState) {
        // get the state list of the assiciated "selectionState"
        if(selectionState === "available") {
            var jsonData = [...this.state.availableNationalityList];
        }
        else if(selectionState === "chosen") {
            var jsonData = [...this.state.chosenNationalityList];
        }

        // create new div for the buttons
        var buttonDiv = document.createElement("div");
        for(let i=0; i<jsonData.length; i++) {
            var key = jsonData[i][0];
            var val = jsonData[i][1];

            // create new button, assign class and text
            var buttonElement = document.createElement("button");
            buttonElement.innerHTML = key;
            buttonElement.classList.add("nationalityButton");
            buttonElement.title = key + ": " + val;
            
            // create button click handler
            buttonElement.addEventListener("click", (e) => {
                // when clicked, remove from selected state list and append to open state list
                // open state list means the list in which the nationality button is currently not in
                if(selectionState === "available") {
                    // selected: availabe, open: chosen
                    var tmpSelectionStateData = [...this.state.availableNationalityList];
                    var selectedValue = tmpSelectionStateData[i];
                    tmpSelectionStateData.splice(i, 1);
                    this.setState({availableNationalityList: tmpSelectionStateData});

                    var tmpOpenStateData = [...this.state.chosenNationalityList];
                    tmpOpenStateData.push(selectedValue);
                    this.setState({chosenNationalityList: tmpOpenStateData});
                }
                else if(selectionState === "chosen") {
                    // selected: chosen, open: availabe
                    var tmpChosenStateData = [...this.state.chosenNationalityList];
                    var selectedValue = tmpChosenStateData[i];
                    tmpChosenStateData.splice(i, 1);
                    this.setState({chosenNationalityList: tmpChosenStateData});

                    var tmpOpenStateData = [...this.state.availableNationalityList];
                    tmpOpenStateData.push(selectedValue);
                    this.setState({availableNationalityList: tmpOpenStateData});
                }
            }, false);

            // add button to button div
            buttonDiv.appendChild(buttonElement);
        }
        return buttonDiv;
    }

    selectNationalityButtons() {
        // clear button divs when a selection has been made 
        this.refAvailableNationalities.current.innerHTML = "";
        this.refChosenNationalities.current.innerHTML = "";

        // create new div with buttons when a selection has been made 
        var availableButtonDiv = this.createButtonDiv("available");
        var chosenButtonDiv = this.createButtonDiv("chosen");

        // append new buttons to the associated div
        this.refAvailableNationalities.current.appendChild(availableButtonDiv);
        this.refChosenNationalities.current.appendChild(chosenButtonDiv);
    }

    componentDidMount() {
        this.setState({ chosenDatasetType: this.props.datasetType });

        var datasetTypeSelection = document.getElementsByClassName("datasetChoosingField")[0];
        datasetTypeSelection.value = this.state.chosenDatasetType;

        var datasetChoosingField = document.getElementsByClassName("datasetChoosingField")[0];
        if (this.props.datasetType == "nationalities") { 
            datasetChoosingField.style.width = "220px";
            this.setState({ availableNationalityList: this.props.availableNationalityList, chosenNationalityList: this.props.chosenNationalityList });
        }
        else { 
            datasetChoosingField.style.width = "305px";
            this.setState({ availableNationalityList: this.props.availableNationalityGroupList, chosenNationalityList: this.props.chosenNationalityGroupList });
        }
    }

    componentDidUpdate() {
        // create new buttons when updated by user selection
        this.selectNationalityButtons();
    }

    handleSubmit(chosenNationalities) {
        if(chosenNationalities.length < 2) {
            var submitBox = document.getElementsByClassName("submitNationalitiesBox")[0];
    
            // try to remove an earlier error message element if it exists
            try {
                [].forEach.call(document.querySelectorAll(".errorMessageBox"), function(e) {
                    e.parentNode.removeChild(e);
                });
            }
            catch {
                ;
            }
    
            // create div for the error message
            var errorMessageDiv = document.createElement("div");
            errorMessageDiv.classList.add("errorMessageBox");
    
            // create h1 tag for the error message tag
            var errorMessage = document.createElement("h1");
            errorMessage.classList.add("errorMessage");
            errorMessage.innerText = "You must choose at least two nationalities or one nationality + else!";
    
            // compose h1, div and parent div
            errorMessageDiv.appendChild(errorMessage)
            submitBox.appendChild(errorMessageDiv);
    
            // hide error message div if user clicks anywhere else
            document.addEventListener("mouseup", function(e) {
                if (!errorMessageDiv.contains(e.target)) {
                    errorMessageDiv.style.display = "none";
                }
            });
            
        }
        else {
            this.props.datasetStateHandler(this.state.availableNationalityList, this.state.chosenNationalityList, this.state.chosenDatasetType);
            [].forEach.call(document.querySelectorAll(".popupOverlay"), function(e) {
                e.parentNode.removeChild(e);
            });
        }
    }

    render() {
        return (
            <div className="dataChoosingBox">

                <h1 className="dataChoosingTitle">choose</h1>
                <select name="datasetType" onChange={(e) => {

                    const datasetChoosingField = document.getElementsByClassName("datasetChoosingField")[0];
                    if (this.state.chosenDatasetType == "nationalities") { 
                        datasetChoosingField.style.width = "305px";
                    }
                    else { 
                        datasetChoosingField.style.width = "220px";
                    }
                    this.setState({chosenDatasetType: e.target.value});

                    if (this.state.chosenDatasetType !== "nationalities") {
                        this.setState({ availableNationalityList: this.props.initialNationalityList, chosenNationalityList: [["else", 1]] });
                    }
                    else {
                        this.setState({ availableNationalityList: this.props.initialNationalityGroupList, chosenNationalityList: [["else", 1]] });
                    }

                }}className="datasetChoosingField">
                    <option value="nationalities" className="datasetTypeOption">nationalities</option>
                    <option value="nationality groups" className="datasetTypeOption">nationality groups</option>
                </select>

                <div className="availableNationalities">
                    <h1 className="availableTitle">available:</h1>

                    <h1 className="selectionCounter">{this.state.availableNationalityList.length}</h1>
                    <div className="availableScrollDiv" ref={this.refAvailableNationalities}></div>
                </div>

                <div className="chosenNationalities">
                    <h1 className="chosenTitle">chosen:</h1>

                    <h1 className="selectionCounter">{this.state.chosenNationalityList.length}</h1>
                    <div className="chosenScrollDiv" ref={this.refChosenNationalities}></div>
                </div>

                <div className="submitNationalitiesBox">
                    <button className="submitNationalitiesButton" onClick={() => {
                        this.handleSubmit(this.state.chosenNationalityList);
                }}>submit</button>
                </div>
            </div>
        );
    }
}
