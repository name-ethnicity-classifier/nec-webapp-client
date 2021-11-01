import React from "react";
import ReactDOM from 'react-dom';


export default class ShadowButton extends React.Component {
    constructor(props) {
        super(props);

        this.callClickFunction = this.callClickFunction.bind(this);
        this.triggerClick = this.triggerClick.bind(this);

        this.state = {
            posLeft: null,
            posTop: null,
        };

        this.class_ = this.props.class;
        this.buttonClass = "s-button-" + this.class_;
        this.text = this.props.text;

        this.customStyles = {
            width: this.props.styles.width,
            height: this.props.styles.height,
            color: this.props.styles.color,
            borderWidthAsInt: this.stringStyleToInt(this.props.styles.borderWidth || "6px"),
            borderRadius: this.props.styles.borderRadius || "10px",
            fontFamily: this.props.styles.fontFamily || "Arial",
            fontSize: this.props.styles.fontSize || "20px",
            opacity: this.props.styles.opacity || ".125",
            zIndex: this.props.styles.zIndex || 1
        }

        this.buttonStyles = {
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0)",
            outline: "none",
            border: `solid ${this.customStyles.borderWidthAsInt}px ${this.customStyles.color}`,
            borderRadius: this.customStyles.borderRadius,
            color: this.customStyles.color,
            width: this.customStyles.width,
            height: this.customStyles.height,
            fontFamily: this.customStyles.fontFamily,
            fontSize: this.customStyles.fontSize,
            zIndex: this.customStyles.zIndex + 1,
            transition: "all .035s ease-out",
        };

        this.shadowStyles = {
            position: "absolute",
            backgroundColor: `rgba(0, 0, 0, ${this.customStyles.opacity})`,
            borderRadius: this.customStyles.borderRadius,
            left: (this.state.posLeft + 2 * this.customStyles.borderWidthAsInt) + "px",
            top: (this.state.posTop + 2 * this.customStyles.borderWidthAsInt) + "px",
            width: (this.stringStyleToInt(this.customStyles.width) - this.customStyles.borderWidthAsInt / 2) + "px",
            height: (this.stringStyleToInt(this.customStyles.height) - this.customStyles.borderWidthAsInt / 2) + "px",
            zIndex: this.customStyles.zIndex,
            transition: "all .035s ease-out"
        }
    }

    stringStyleToInt(style) {
        return parseInt(style.split("px")[0]);
    }

    triggerClick() {
        try {
            let button = document.getElementsByClassName(this.buttonClass)[0];
            let borderWidth = this.customStyles.borderWidthAsInt;

            button.addEventListener("mousedown", function handler() {
                button.style.marginLeft = 2 * borderWidth + "px";
                button.style.marginTop = 2 * borderWidth + "px";
            });
        }
        catch {
            // button not rendered yet
        }
    }

    callClickFunction() {
        let button = document.getElementsByClassName(this.buttonClass)[0];
        button.style.marginLeft = "0px";
        button.style.marginTop = "0px";
        this.props.onClickFunction();
    }

    componentDidMount() {
        var rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
        this.setState({posLeft: rect.left, posTop: rect.top});
        this.triggerClick();
    }

    render() {
        return (
            <div className={this.class_}>
                <button className={this.buttonClass} style={this.buttonStyles} onClick={() => this.callClickFunction()}>
                    <b>{this.text}</b>
                </button>

                <div className="s-shadow" style={this.shadowStyles}></div>
            </div>
        )
    }
}