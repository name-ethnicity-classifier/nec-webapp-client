import React from "react";
import PresentBox from "./PresentBox";
import axios from "axios";
import Cookies from "js-cookie";
import FooterBox from "./FooterBox";
import config from "./config";
import ShadowButton from "./ShadowButton";


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
        };
    }

    getDataAmountInformation() {
        // get nationality amount
        axios.get(config.API_URL + "nationalities")
        .then((response) => {
            this.setState({amountNationalities: Object.keys(response.data).length});
        });

        // get standard/default model amount
        axios.get(config.API_URL + "standard-models").then((response) => {
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
                    <h1 className="startText slideInTop">customised name-ethnicity classification:<br/>you choose just the nationalities you need - we train your custom model for free.</h1>
                    <h1 className="startSubText slideInTop">to get started, check out...</h1>
                    <button className="startButton slideInTop" onClick={(e) => {
                                e.preventDefault();
                                window.location.href="/#explainationBox";
                    }}>how it works ➞</button>
                    <div className="startButtonShadow slideInTop"></div>
                </div>

                <img alt="undraw-illustration" src="images\undraw_world_pins.svg" className="earthPinIllustration2"></img>

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

                <div id="aboutBox" className="aboutBox">
                    <div className="slideBox slideInBottom">
                        <h1 className="aboutBoxTitle">About ...</h1>
                        
                        <div className="aboutMotivationBox aboutSubBox">
                            <h1 className="aboutSubTitle">... our motivation</h1>

                            <h1 className="aboutText">
                                Without knowledge about ethnic inequalities we have no basis for combatting them. Therefore, we embrace the recent shift within the social sciences away from a ‘colour-blind’ towards a ‘colour-conscious’ concept of justice.
                            </h1>

                            <h1 className="aboutText">
                                However, trying to adopt this mindset in our research we faced a challenge: Most datasets are relics from the ‘colour-blind’ age. Information about ethnicity? Nowhere to be found. 
                            </h1>

                            <h1 className="aboutText">
                                To infuse the data with ‘colour-consciousness’, we have developed a machine learning tool that can infer ethnicity from names. If you are a like-minded scholar we hope that sharing our tool with you on this website will enable us to collectively open our eyes to the coloured inequalities of our times. 
                            </h1>
                        </div>

                        <div className="aboutProjectBox aboutSubBox">
                            <h1 className="aboutSubTitle">... this project</h1>
                            <h1 className="aboutText">
                                Ethnic inequalities come in many shades. Therefore, research to uncover them needs to be just as versatile.
                            </h1>

                            <h1 className="aboutText">
                                This is why using our name-ethnicity classification tool on this website is not only easy and free - but customised to your research. Choose the nationalities that are relevant in your project and we train your tailor-made machine learning classifier for you.
                            </h1>

                            <h1 className="aboutText">
                                The classifiers are trained on a dataset from the UK government agency CompaniesHouse, which contains roughly 7,3 million names from across the globe. Feel free to check out our GitHub repository to see how we built this tool.
                            </h1>
                        </div>

                        <div className="aboutUsBox aboutSubBox">
                            <h1 className="aboutSubTitle">... us</h1>
 
                            <h1 className="aboutText aboutPadding">
                                <b>Lena Hafner</b> - Phd. Candidate in Politics and International Studies, University of Cambridge
                            </h1>
                            <h1 className="aboutText aboutPadding">
                                <b>Theodor Peifer</b> - BSc. Student in Data Science and Machine Learning, Technical University Ingolstadt
                            </h1>

                            <h1 className="aboutText">
                                <b>Franziska Hafner</b> - MA Student in Computer Science and Public Policy, University of Glasgow
                            </h1>
                        </div>
                        
                    </div>
                    <img alt="undraw-illustration" src="images\undraw_connected_world_wuay.svg" className="analyticsIllustration slideInBottom"></img>
                    <img alt="undraw-illustration" src="images\undraw_celebration_0jvk.svg" className="peopleIllustration slideInBottom"></img>
                </div>

                <div id="explainationBox" className="explainationBox">
                    <div className="slideBox slideInBottom">
                        <h1 className="explainationBoxTitle">How to...</h1>


                        {/*
                        <img alt="github-icon" src="images\undraw_Publish_article_re_3x8h.svg" className="publishIllustration slideInBottom"></img>

                        <div className="whenToUseBox">
                            <h1 className="explainationTitle">... know when to use this classifier:</h1>
                            <h1 className="explainationText">If you have a dataset containing names and you want to</h1>
                            <pre className="whenToUsePoints">    . . . infer information about the distribution of ethnicities within your data<br/>    . . . correlate other variables in your data with ethnicity</pre>
                            <h1 className="explainationText">then this classifier is for you.</h1>
                        </div>*/}

                        <div className="howToClassifyBox">
                            <h1 className="explainationTitle">... classify names:</h1>

                            <h1 className="explainationText">
                                In the ‘classify names’ section you can access our pretrained and your custom models. For every trained model, we display the overall accuracy as well as individual accuracies for the chosen nationalities.
                            </h1>
                            <h1 className="explainationText">To classify names, upload them in a .csv file in the following format:</h1>
                            <img alt="names-csv-exp" src="images\input-example-csv.png" className="inputTableImage"></img>
                            <h1 className="explainationText">
                                After your file has been classified, you will be able to download a new .csv file containing the ethnicity predictions:
                            </h1>
                            <img alt="names-csv-exp" src="images\output-example-csv.png" className="outputTableImage"></img>
                            <img alt="undraw-illustration" src="images\undraw_Publish_article_re_3x8h.svg" className="publishIllustration slideInBottom"></img>

                            <ShadowButton class="getStartedButton" text="get started!" onClickFunction={() => {window.location.href="/classification"}} styles={{
                                width: "180px", height:"50px", color: "rgb(63, 124, 247)", borderWidth: "4px", borderRadius: "5px", fontSize: "17px", fontFamily: "inherit"
                            }}/> 

                        </div>

                        <div className="howToRequestBox">
                            <h1 className="explainationTitle">... create a custom model:</h1>

                            <h1 className="explainationText">
                                In the ‘create custom model’ section you are able to create a model which gets trained on just the nationalities you need (this can take a few hours). 
                                All you have to do is to give the model a descriptive name and select the nationalities you require (including the option ‘else’, which represents all nationalities you didn’t pick). <br/>
                                We will display the number of names your model will be trained on. This will be an equal amount for every chosen nationality – 
                                to assure a minimum of data selection bias.
                            </h1>
                            <h1 className="explainationText">
                                While creating a custom model you should keep in mind, that...
                            </h1>

                            <h1 className="explainationText explainationPoint">... Ethnicity estimation is probabilistic. To assess whether the accuracy is high enough for your use case you can first compare your nationality configuration with those of our pre-trained models. This might help you estimate how good your model will perform.</h1>
                            <h1 className="explainationText explainationPoint">... English speaking nationalities have similar names. Therefore, they will be mixed up by the classifier more often than other nationalities.</h1>
                            <h1 className="explainationText explainationPoint">... machine learning is prone to bias. To keep bias to a minimum, it is important to have an equal amount of training data for all your chosen nationalities. Thus, if you choose a nationality with only few occurrences in our dataset (i.e <span>&lt;</span> 10000.), we reduce the amount of names for other chosen nationalities to be equal to this small nationality. This can lead to lower overall accuracy. You will see the amount of names available for training so you can take this into account when choosing which nationalities to include in your model.</h1>
                            <h1 className="explainationText explainationPoint">... as a general rule: The more nationalities you choose, the lower the overall accuracy. With only five nationalities, accuracy might be as high as 90%. When classifying up to 20 nationalities, this figure might drop to 80%. When classifying 50 or more nationalities, you can’t expect the accuracy to be more than 50%. Depth over breadth might be the way to go.</h1>
                        </div>
                    </div>
                </div>
                <FooterBox/>
            </div>
        );
    }
}

