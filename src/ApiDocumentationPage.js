
import React from "react";
import Cookies from "js-cookie";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { nord, github, CodeBlock } from "react-code-blocks";
import Switch from "react-switch";
import FooterBox from './FooterBox';


export default class ApiDocumentationPage extends React.Component {
    constructor(props) {
        super(props);

        this.apiURL = "https://api.name-to-ethnicity.com";

        this.toggleCodeTheme = this.toggleCodeTheme.bind(this)

        this.state = {
            apiKeyText: null,
            initialApiKeyText: null,
            showApiKey: false,
            toggleApiKeyDisabled: false,
            visibiltyIconPath: "images\\show-icon.svg",
            codetheme: github,
            checked: false        
        }
    }

    componentDidMount() {
        if (Cookies.get("token") === undefined) {
            this.setState({ apiKeyText: "You have to log in in order to get an API token!" });
            this.setState({ showApiKey: true, toggleApiKeyDisabled: true });
        }
        else {
            this.setState({ initialApiKeyText: ("•").repeat(200), apiKeyText: Cookies.get("token") })
        }
    }


    copyTextButton(toCopy, copyMessageClassName) {
        return (
            <div>
                <CopyToClipboard text={toCopy} onCopy={() => {
                    let copiedMessage = document.getElementsByClassName(copyMessageClassName)[0];
                    copiedMessage.style.display = "inline";
                    setTimeout( function() {
                        copiedMessage.style.display = "none";
                    }, 1000);
                }}>
                    <button className="copyKeyButton">
                        <img alt="toggle-visiblity-icon" src="images/copy-icon.svg" className="copyIcon"></img>
                    </button>
                </CopyToClipboard>

                <p className={copyMessageClassName + " copiedMessage"}>copied!</p>
            </div>
        )
    }

    toggleCodeTheme() {
        if (this.state.codetheme === github) {
            this.setState({ codetheme: nord });
            this.setState({ checked: true })
        }
        else {
            this.setState({ codetheme: github });
            this.setState({ checked: false })
        }
    }


    createCodeBlock(code, language) {
        return (
            <CodeBlock
                text={code}
                language={language}
                showLineNumbers={true}
                startingLineNumber={1}
                theme={this.state.codetheme}
                codeBlock={true}
            />
        );
    }

    createRequestTag(tag, color) {
        return (
            <div className="requestTagBox">
                <div style={{borderColor: color}} className="requestTagBorder">
                    <h1 style={{color: color}} className="requestTagText">{tag}</h1>
                </div>
                <div className="requestTagShadow"></div>
            </div>
        )
    }

    render() {
        return (
            <div className="apiDocumentationBox">
                <div className="inner apiInner">
                    <h1 className="pageTitle apiPageTitle">API documentation</h1>

                    <div className="innerDocumentationBox">

                        <div className="apiDescriptionBox">
                            <p className="apiDescriptionText">With our public API you can classify names automatically and more easily using a simply <a className="postExplanationLink" target="_blank" href="https://en.wikipedia.org/wiki/POST_(HTTP)">POST</a> request.</p>

                            <div className="toggleThemeSwitchBox">
                                <Switch 
                                    className="toggleThemeSwitch" 
                                    offColor="#d2d1ff"
                                    onColor="#d2d1ff"
                                    offHandleColor="#605dff"
                                    onHandleColor="#605dff"
                                    checkedHandleIcon={
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", borderRadius: "50%", fontSize: 20 }}>
                                            <img alt="dark-mode-icon" src="images/dark-mode-icon.svg"></img>
                                        </div>
                                    }
                                    uncheckedHandleIcon={
                                        <div style={{ display: "flex", paddingTop: "11px", paddingLeft: "10px", justifyContent: "center", alignItems: "center", height: "20%", width: "20%", borderRadius: "50%", fontSize: 20 }}>
                                            <img alt="light-mode-icon" src="images/light-mode-icon.svg"></img>
                                        </div>
                                    }
                                    
                                    
                                    uncheckedIcon={null}
                                    checkedIcon={null}
                                    onChange={this.toggleCodeTheme} 
                                    checked={this.state.checked}
                                />
                            </div>
                        </div>

                        <div className="apiDocumentationSection apiKeySection">
                            <h1 className="apiDocumentationSubTitle">Your API token:</h1>
                            <div className="apiSectionBox">
                                {
                                    this.state.showApiKey ? <p className="apiSectionText">{this.state.apiKeyText}</p> 
                                    : <p className="apiKeyHiddenText">{this.state.initialApiKeyText}</p>
                                }
                                <button disabled={this.state.toggleApiKeyDisabled} className="toggleVisibiliyButton" onClick={() => {
                                    this.setState({ showApiKey: !this.state.showApiKey });

                                    if (this.state.visibiltyIconPath.includes("show")) {
                                        this.setState({ visibiltyIconPath: "images\\hide-icon.svg" });
                                    }
                                    else {
                                        this.setState({ visibiltyIconPath: "images\\show-icon.svg" });
                                    }
                                }}>
                                    <img alt="toggle-visiblity-icon" src={this.state.visibiltyIconPath} className="toggleVisibiliyIcon"></img>
                                </button>

                                {this.copyTextButton(this.state.apiKeyText, "apiKeyCopiedMessage")}

                            </div>
                        </div>

                        <div className="apiDocumentationSection baseURLSection">
                            <h1 className="apiDocumentationSubTitle">Base URL:</h1>
                            <div className="apiSectionBox">
                                <p className="apiSectionText">{this.apiURL}</p>
                                {this.copyTextButton(this.apiURL, "apiURLCopiedMessage")}
                            </div>
                        </div>

                        <div className="apiDocumentationSection allHeadersSection">
                            <h1 className="apiDocumentationSubTitle">Headers for all requests:</h1>
                            <div className="headersCodeBlock">
                                {this.createCodeBlock('{\n        "Authorization": "Bearer <your API token>",\n        "Email": "<your email>"\n}', "json")}
                            </div>
                        </div>

                        <div className="apiDocumentationSection endpointsSection">
                            <h1 className="apiDocumentationSubTitle">Endpoints:</h1>
                            
                            <div className="endpointsBox">
                                <div className="apiEndpointSection" id="apiEndpointSection1">
                                    <button className="apiSectionBox apiSectionButton" id="apiSectionButton1" onClick={() => {
                                        document.getElementById("apiEndpointSection1").classList.toggle("openEndpointSection");
                                        document.getElementById("apiSectionButton1").classList.toggle("clickedApiSectionButton");
                                    }}>
                                        <p className="apiEndpointText">/classify-names</p>
                                        {this.createRequestTag("POST", "rgb(96, 93, 255)")}
                                        <img alt="open-endpoint-icon" src="images\drop-icon-dark.svg" className="openEndpointExplanationIcon"></img>
                                    </button>


                                    <div className="endpointExplanationBox">

                                        <div className="endpointExplanationSubBox">
                                            <div className="endpointEplanationTitleBox">
                                                <h1 className="endpointEplanationTitle">description:</h1>
                                            </div>
                                            <div className="endpointDescriptionText">
                                                Using this endpoint, you can classify names in a given list. Additional to the names, you have to provide the name of the model you want to use 
                                                (model names can be found on this webapp and using the <b>/models</b> or <b>/my-models</b> endpoints). 
                                            </div>
                                        </div>
                                        
                                        <div className="endpointExplanationSubBox">
                                            <div className="endpointEplanationTitleBox">
                                                <h1 className="endpointEplanationTitle">body:</h1>
                                            </div>

                                            <div className="codeBlock">
                                                {this.createCodeBlock('{\n        "modelName": "<wanted model name: string>",\n        "names": [\n                "<name: string>",\n                . . . ,\n                "<name: string>"\n        ]\n}\n ', "json")}
                                            </div>
                                        </div>

                                        <div className="endpointExplanationSubBox">
                                            <div className="endpointEplanationTitleBox">
                                                <h1 className="endpointEplanationTitle">response:</h1>
                                            </div>

                                            <div className="codeBlock">
                                                {this.createCodeBlock('{\n        "<name: string>": [\n                "<ethnicity: string>", <confidence: float>\n        ],\n        . . . ,\n        "<name: string>": [\n                "<ethnicity: string>", <confidence: float>\n        ]\n}', "json")}
                                            </div>
                                        </div>

                                        <div className="endpointExplanationSubBox">
                                            <div className="endpointEplanationTitleBox">
                                                <h1 className="endpointEplanationTitle">Python example:</h1>
                                            </div>

                                            <div className="codeBlock">
                                                {this.createCodeBlock('import requests\n\napi_url = "https://api.name-to-ethnicity.com/classify-names"\n\nheaders = {\n        "Authorization": "Bearer <your API token>",\n        "Email": "example@user.com" \n}\n\nbody = {\n        "modelName": "chinese_and_else",\n        "names": ["Theodor Peifer", "Liu Cixin"] \n}\n\nresponse = requests.post(api_url, data=body, headers=headers)\n\nprint(response.json())\n# output:\n # {\n#         "Theodor Peifer": [\n#                 "else", 95.1\n#         ],\n#         "Liu Cixin": [\n#                 "chinese", 98.5\n#         ]\n# }', "python")}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="apiEndpointSection" id="apiEndpointSection2">
                                <button className="apiSectionBox apiSectionButton" id="apiSectionButton2" onClick={() => {
                                        document.getElementById("apiEndpointSection2").classList.toggle("openEndpointSection");
                                        document.getElementById("apiSectionButton2").classList.toggle("clickedApiSectionButton");
                                    }}>
                                        <p className="apiEndpointText">/models</p>
                                        {this.createRequestTag("GET", "rgb(96, 93, 255)")}

                                        <img alt="open-endpoint-icon" src="images\drop-icon-dark.svg" className="openEndpointExplanationIcon"></img>
                                    </button>
                                    <div className="endpointExplanationBox">

                                        <div className="endpointExplanationSubBox">
                                            <div className="endpointEplanationTitleBox">
                                                <h1 className="endpointEplanationTitle">description:</h1>
                                            </div>
                                            <div className="endpointDescriptionText">
                                                This endpoint returns a list of all the, for you, available models with the accuracy they archieved on our test set.
                                                Additionally we provide the nationalities it was trained on, the F1-score of every class, the type (standard or custom model) and the creation date.
                                            </div>
                                        </div>
                                        
                                        <div className="endpointExplanationSubBox">
                                            <div className="endpointEplanationTitleBox">
                                                <h1 className="endpointEplanationTitle">response:</h1>
                                            </div>

                                            <div className="codeBlock">
                                                {this.createCodeBlock('[\n        {\n                "name": "<model name: string>",\n                "accuracy": <accuracy: float>,\n                "nationalities": ["<nationality/ethnicity: string>", . . . , "<nationality/ethnicity: string>"],\n                "scores": [<score: float>, . . . , <score: float>],\n                "type": <model type: 1=standard, 0=custom>,\n                "creationTime": "<date time: string>"\n        },\n        . . . \n]', "json")}
                                            </div>
                                        </div>

                                        <div className="endpointExplanationSubBox">
                                            <div className="endpointEplanationTitleBox">
                                                <h1 className="endpointEplanationTitle">Python example:</h1>
                                            </div>

                                            <div className="codeBlock">
                                                {this.createCodeBlock('import requests\n\napi_url = "https://api.name-to-ethnicity.com/standard-models"\n\nheaders = {\n        "Authorization": "Bearer <your API token>",\n        "Email": "example@user.com" \n}\n\nresponse = requests.get(api_url, headers=headers)\n\nprint(response.json())', "python")}
                                            </div>
                                        </div>

                                    </div>
                                </div>        
                            </div>
                        </div>

                        <div className="apiDocumentationSection responseCodesSection">
                            <h1 className="apiDocumentationSubTitle">Response codes:</h1>
                                <div className="apiSectionBox responseCodeBox">
                                    {this.createRequestTag("200", "rgb(17, 207, 128)")}  
                                    <p className="responseCodeText"><b>OK</b>,&nbsp;&nbsp;everything is looking fine :)</p>
                                </div>
                                <div className="apiSectionBox responseCodeBox">
                                    {this.createRequestTag("401", "rgb(255, 105, 105)")}  
                                    <p className="responseCodeText"><b>authorizationFailed</b>,&nbsp;&nbsp;make sure your email and API token are correct!</p>
                                </div>
                                <div className="apiSectionBox responseCodeBox">
                                    {this.createRequestTag("409", "rgb(255, 105, 105)")}  
                                    <p className="responseCodeText"><b>modelDoesNotExist</b>,&nbsp;&nbsp;does the model name you entered exist?</p>
                                </div>
                                <div className="apiSectionBox responseCodeBox">
                                    {this.createRequestTag("400", "rgb(255, 105, 105)")}  
                                    <p className="responseCodeText"><b>classificationFailed</b>,&nbsp;&nbsp;did you follow the classification instructions correctly?</p>
                                </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
