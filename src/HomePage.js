import React from "react";
import PresentBox from "./PresentBox";
import axios from "axios";
import Cookies from "js-cookie";
import FooterBox from "./FooterBox";
import config from "./config";


export default class HomePageBox extends React.Component {
    constructor(props) {
        super(props);

        this.createPopup = this.createPopup.bind(this);
        this.slideDivsOnScroll = this.slideDivsOnScroll.bind(this);
        
        this.state = {
            showDatasetTable: false,
            showModelTable: false,
            showCustomModelTable: false,
            amountNationalities: 0,
            amountStandardModels: 0,
            amountCustomModels: 0,
            showAboutInfoBox: false,
            showAboutModelInfo: false,
            showAboutDatasetInfo: false
        };
    }

    getDataAmountInformation() {
        // get nationality amount
        axios.get(config.API_URL + "nationalities")
        .then((response) => {
            this.setState({amountNationalities: Object.keys(response.data).length});
        });

        // get standard/default model amount
        axios.get(config.API_URL + "standard-models",  {
        }).then((response) => {
            this.setState({amountStandardModels: Object.keys(response.data).length})
        });
        
        // get custom model amount
        axios.get(config.API_URL + "my-models",  {
            headers: {
                Authorization: "Bearer " + Cookies.get("token"),
                Email: Cookies.get("email")
            }
        }).then((response) => {
            var amountStandardModels_ = 0;
            var amountCustomModels_ = 0;

            for (let i=0; i<response.data.length; i++) {
                if (response.data[i].type === 1) {
                    amountStandardModels_ += 1;
                }
                else if (response.data[i].type === 0) {
                    amountCustomModels_ += 1;
                }
            }

            this.setState({amountCustomModels: amountCustomModels_});
        }, (error) => {
            // not logged in
        });
    }

    createPopup(popupClass) {
        var parentElement = document.getElementsByTagName("body")[0];
        var popupOverlay = document.createElement("div");
        popupOverlay.classList.add("popupOverlay");
        parentElement.appendChild(popupOverlay);

        document.addEventListener("mouseup", (e) => {
            if (popupOverlay.contains(e.target)) {

                [].forEach.call(document.querySelectorAll(".popupOverlay"), function(e) {
                    e.parentNode.removeChild(e);
                });

                [].forEach.call(document.querySelectorAll(popupClass), function(e) {
                    e.parentNode.removeChild(e);
                });
                
                this.setState({showDatasetTable: false});
                this.setState({showModelTable: false});
                this.setState({showCustomModelTable: false});
            }
        });
    }

    slideDivsOnScroll() {
        // code based on yt video: ...
        const sliders = document.querySelectorAll(".slideInBottom , .slideInTop");

        const slideOptions = {
            threshold: 0.25
        };

        const appearOnScroll = new IntersectionObserver(
            function(entries, appearOnScroll) {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    else {
                        entry.target.classList.add("appear");
                        appearOnScroll.unobserve(entry.target);
                    }
                })
            }, slideOptions);

            sliders.forEach(slider => {
                appearOnScroll.observe(slider)
            });
    }

    componentDidMount() {
        this.slideDivsOnScroll();
        this.getDataAmountInformation();
        this.howItWorksHoverEffects();
    }

    componentDidUpdate() {
        ;
    }

    howItWorksHoverEffects() {
        const classifyExplainationBox = document.getElementsByClassName("howToClassifyBox")[0];
        const inputTableImage = document.getElementsByClassName("inputTableImage")[0];
        const outputTableImage = document.getElementsByClassName("outputTableImage")[0];

        document.addEventListener("mousemove", function checkHover() {
            if (classifyExplainationBox.matches(":hover")) {
                inputTableImage.style.boxShadow = "0px 0px 20px rgba(0, 89, 255, 0.25)";
                outputTableImage.style.boxShadow = "0px 0px 20px rgba(0, 89, 255, 0.25)";
            }
            else {
                inputTableImage.style.boxShadow = null;
                outputTableImage.style.boxShadow = null;           
            }
        });

        const requestExplainationBox = document.getElementsByClassName("howToRequestBox")[0];
        const explainationPoints = document.getElementsByClassName("explainationPoint");

        document.addEventListener("mousemove", function checkHover() {
            if (requestExplainationBox.matches(":hover")) {
                [].forEach.call(explainationPoints, function(explainationPoint) {
                    explainationPoint.style.boxShadow = "0px 0px 12px rgba(0, 89, 255, 0.25)";
                });
            }
            else {
                [].forEach.call(explainationPoints, function(explainationPoint) {
                    explainationPoint.style.boxShadow = null;
                });           
            }
        });
    }

    render() {
        return (
            <div className="homePageBox">

                <div className="startBackground"></div>

                <div id="startBox" className="startBox">
                    {/*<h1 className="startText slideInTop">request a custom classification model by choosing the exact nationalities you need and classify names for free</h1>
                    <h1 className="startSubText slideInTop">to get started you should first check out...</h1>*/}
                    <h1 className="startText slideInTop">costumized name to ethnicity classification - choose just the nationalities you need and we will train your custom model for free.</h1>
                    <h1 className="startSubText slideInTop">to get started, check out...</h1>
                    <button className="startButton slideInTop" onClick={(e) => {
                                e.preventDefault();
                                window.location.href="/#explainationBox";
                    }}>how it works ➞</button>
                    <div className="startButtonShadow slideInTop"></div>
                </div>

                <img alt="github-icon" src="images\undraw_adventure_4hum.svg" className="earthPinIllustration"></img>

                <div className="informationButtonBox">
                    <button className="informationButton" onClick={(e) => {
                                    this.setState({showDatasetTable: true});
                                    this.createPopup("datasetPresentBox");
                    }}>
                        <h1 className="informationButtonText">{this.state.amountNationalities < 10 ? <b>&nbsp;</b> : null}{this.state.amountNationalities}</h1>
                        <h1 className="informationButtonExplaination nationalityAmountExplaination">nationalities to choose from</h1>
                    </button>
                    {/*<div className="shadowBox1"></div>*/}

                    {this.state.showDatasetTable ? 
                                <PresentBox propClassName={"datasetPresentBox"} type={"nationalityData"} boxTitle={"the dataset"} keys={["nationality", "amount"]} searchBar={true}/> 
                    : null}


                    <button className="informationButton" onClick={(e) => {
                                    this.setState({showModelTable: true});
                                    this.createPopup("modelPresentBox");
                    }}>
                        <h1 className="informationButtonText">{this.state.amountStandardModels < 10 ? <b>&nbsp;</b> : null}{this.state.amountStandardModels}</h1>
                        <h1 className="informationButtonExplaination standardModelsExplaination">already trained standard models</h1>
                    </button>
                    {/*<div className="shadowBox2"></div>*/}

                    {this.state.showModelTable ? 
                                <PresentBox propClassName={"modelPresentBox"} type={"modelData"} boxTitle={"standard models"} keys={["model name", "accuracy"]}/>
                    : null}

                    <button className="informationButton" onClick={(e) => {
                                    this.setState({showCustomModelTable: true})
                                    this.createPopup("modelPresentBox");
                    }}>
                        <h1 className="informationButtonText">{this.state.amountCustomModels < 10 ? <b>&nbsp;</b> : null}{this.state.amountCustomModels}</h1>
                        <h1 className="informationButtonExplaination customModelsExplaination">custom models</h1>
                    </button>
                    {/*<div className="shadowBox3"></div>*/}

                    {this.state.showCustomModelTable ? 
                                <PresentBox propClassName={"modelPresentBox"} type={"customModelData"} boxTitle={"custom models"} keys={["model name", "accuracy"]}/>
                    : null}

                </div>

                <div className="aboutSectionBackground"></div>
                <div id="aboutBox" className="aboutBox">
                    <div className="slideBox slideInBottom">
                        <h1 className="aboutSectionTitle">About ...</h1>
                        
                        <div className="aboutMotivationBox aboutSubBox">
                            <h1 className="aboutSubTitle">... our motivation</h1>

                            <h1 className="aboutText">
                                This website has been built as a part of a social science research project that focuses on name-ethnicity classification using machine learning.
                            </h1>

                            <h1 className="aboutText">
                                Why nationality information is important:
                            </h1>

                            <h1 className="aboutText">
                                Interpreting findings in a dataset containing the name and other information about persons but not their nationalities can lead to potential biases
                                and to the fact that existing coherences based on their background are not recognized.
                            </h1>

                            <h1 className="aboutText">
                                Therefore, we want to enable a not-color-blind approach when in comes to research about people in general.
                            </h1>
                        </div>

                        <div className="aboutProjectBox aboutSubBox">
                            <h1 className="aboutSubTitle">... this project</h1>
                            <h1 className="aboutText">
                                Using this website you are able to request models which are trained just on the nationalities you want them to be able to classify.
                                By doing so we can maximize the accuracy.
                            </h1>

                            <h1 className="aboutText">
                                We have made this application because it is not possible for you to train custom models using just our GitHub repository since the dataset is private.
                                We also want to enable people with less technical knowledge the possibility to train custom models.
                                Feel free to check out our GitHub repository to see how we build this project and to classify names using our simple console interface!
                            </h1>
                        </div>

                        <div className="aboutUsBox aboutSubBox">
                            <h1 className="aboutSubTitle">... us</h1>

                            <h1 className="aboutText aboutPadding">
                                <b>Lena Hafner</b> - Phd. student in social economics, Cambridge University
                            </h1>
                            <h1 className="aboutText aboutPadding">
                                <b>Franziska Hafner</b> - BSc. student in politics and computer science, University Of Scottland
                            </h1>

                            <h1 className="aboutText">
                                <b>Theodor Peifer</b> - BSc. student in data science and machine learning, Technical University Ingolstadt
                            </h1>
                        </div>
                        
                    </div>
                    <img alt="github-icon" src="images\undraw_connected_world_wuay.svg" className="analyticsIllustration slideInBottom"></img>
                    <img alt="github-icon" src="images\undraw_celebration_0jvk.svg" className="peopleIllustration slideInBottom"></img>
                </div>

                <div id="explainationBox" className="explainationBox">
                    <div className="slideBox slideInBottom">
                        <h1 className="explainationBoxTitle">how it works</h1>

                        <img alt="github-icon" src="images\undraw_Publish_article_re_3x8h.svg" className="publishIllustration slideInBottom"></img>

                        <div className="whenToUseBox">
                            <h1 className="explainationTitle">When to use this classifier:</h1>
                            <h1 className="explainationText">If you have a name dataset of which you either</h1>
                            <pre className="whenToUsePoints">    . . . already know which nationalities are represented in it, or<br/>    . . . want to detect names of specific ethnicities,</pre>
                            <h1 className="explainationText">then this classifier is for you.</h1>
                            <h1 className="explainationText">
                                In the “create custom model” section you can select just the nationalities you need. We will then train a model on your selected nationalities, in order to maximize accuracy.
                                You can use all your custom and our standard models in the “classify names” section.
                            </h1>
                        </div>

                        <div className="howToClassifyBox">
                            <h1 className="explainationTitle">How to classify names:</h1>

                            <h1 className="explainationText">
                                First, take a look at our already trained models to see if one of them already fits your use case and directly start classifying. 
                                If not, you can request a custom model which will be automatically trained (this can take a few hours).<br/>
                                For every model, we inform you how good it learned each nationality by plotting scores ranging from 0 to 1.
                            </h1>
                            <h1 className="explainationText">To classify names, you have to put them into a .csv file with the following format:</h1>
                            <img alt="names-csv-exp" src="images\input-example-csv.png" className="inputTableImage"></img>
                            <h1 className="explainationText" id="outputTableExlaination">
                                After your file got classified, you will be able to download a new .csv file that looks like this:
                            </h1>
                            <img alt="names-csv-exp" src="images\output-example-csv.png" className="outputTableImage"></img>
                        </div>

                        <div className="howToRequestBox">
                            <h1 className="explainationTitle">How to create a custom model:</h1>

                            <h1 className="explainationText">
                                You can request a custom model which is trained just on the nationalities you need.
                                To do that, go to the “create model” section, choose the nationalities you need, give it a name and hit request!
                                There is also a nationality called "else" which represents every other nationality you haven't chosen (note: by selecting "else" the accuracy of the model will decrease).
                            </h1>
                            <h1 className="explainationText">
                                Here are some things to keep in mind when choosing nationalities:
                            </h1>

                            <h1 className="explainationText explainationPoint">1. You should compare your chosen nationality configuration with those of our already trained "standard models" to estimate how good your model will perform.</h1>
                            <h1 className="explainationText explainationPoint">2. English speaking nationalities have similar names and will therefore be mixed up by the classifier more often than other nationalities.</h1>
                            <h1 className="explainationText explainationPoint">3. The amount of names on which your model will be trained equals n-times the amount of names of the nationality which has the least occurrences in the dataset, where n is the amount of nationalities you have chosen. This ensures that there are an equal amounts of names of every nationality in the dataset. Therefore, try to pick as fewer nationalities with fewer names, i.e    <span>&lt;</span> 2000.</h1>
                            <h1 className="explainationText explainationPoint">4. The more nationalities the worse the classifier will perform (5 nationalities ~ 90% accuracy, 20 nationalities ~ 80% accuracy, 50 nationalities ~ 50% accuracy) 
                            (we will inform you about the amount of names per nationality in the model creation process)</h1>
                        </div>
                    </div>
                </div>
                <FooterBox/>
            </div>
        );
    }
}

