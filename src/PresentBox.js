import React from "react";
import axios from "axios";
import JsonTable from "./JsonTable";
import Cookies from "js-cookie";
import config from "./config";


export default class PresentBox extends React.Component {
    constructor(props) {
        super(props);
        
        this.embedSearchBar = this.embedSearchBar.bind(this);
        this.state = {
            tableData: []
        }
    }

    componentDidMount() {
        // read json data and init. state list
        var endpoint;
        var headers_ = { headers: {} };
        if (this.props.type === "nationalityData") {
            endpoint = "nationalities";
        }
        else if (this.props.type === "modelData") {
            endpoint = "standard-models";
        }
        else if (this.props.type === "customModelData") {
            endpoint = "models";
            headers_ = 
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                        Email: Cookies.get("email")
                    }
                };
        }

        axios.get(config.API_URL + endpoint, headers_).then((response) => {
            var responseData = response.data;
            if (this.props.type === "customModelData") {
                var responseData = {};
                for (let i=0; i<response.data.length; i++) {
                    if (response.data[i].type === 0) {
                        responseData[response.data[i].name] = response.data[i].accuracy;
                    }
                }
            }
            if (this.props.type === "nationalityData") {
                responseData = responseData["nationalities"];
                console.log(responseData)
            }
            this.setState({tableData: responseData});
        }, (error) => {
            if (error.response.status === 401) {
                Cookies.remove("email");
                Cookies.remove("token");
                window.location.href = "/login";
            }
        });
    }

    embedSearchBar() {
        // create search bar to search for nationalities if wanted
        if(this.props.searchBar) {
            return (
                <div>
                    <img className="searchIcon" alt="search-icon" src="images/search-bar-icon.svg"></img>
                    <input type="text" className="searchBar" placeholder="search nationality" onKeyDown={(event) => search(event, this.state.tableData)}></input>
                </div>
            );
        }
        else {
            return ( <div></div> );
        }
    }

    render() {
        return (
            <div className={this.props.propClassName}>
                <h1 className="presentTitle">{this.props.boxTitle}</h1>
                {this.embedSearchBar()}
                <JsonTable data={this.state.tableData} keys={this.props.keys}/>
            </div>
        );
    }
}


const search = (event, nationalities) => {
    // search for nationality and alert user about the amount if names in the dataset of that nationality
    var wantedNationality = document.getElementsByClassName("searchBar")[0].value;
    if(event.key === "Enter") {
        
        var amount = 0;
        for(let key in nationalities) {
            if(key === wantedNationality) {
                amount = nationalities[key];
                break;
            }
        }
        alert("There are " + amount + " " + wantedNationality + " names in the dataset.");
    }
}