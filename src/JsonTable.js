import React from "react";


export default class JsonTable extends React.Component {
    constructor(props) {
        super(props);
        
        this.sortList = this.sortList.bind(this);
        this.jsonToList = this.jsonToList.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getRowsData = this.getRowsData.bind(this);
        
        this.dataList = [];

        this.state = {
            sortAscending: true
        }

    }

    sortList = function() {
        // sort nationalities by their amount of names in the dataset
        this.dataList = this.dataList.sort(function(a, b) {
            return a[1] - b[1];
        });

        // reverse sort order (more to less) if wanted
        if (this.state.sortAscending === true) {
            this.dataList = this.dataList.reverse();
        }

    }

    jsonToList = function() {
        // convert json object to list
        for(let key in this.props.data) {
            this.dataList.push([key, this.props.data[key]]);
        }
    }

    getHeader = function() {
        // create (two) headers for the table
        return this.props.keys.map( (key, index) => {
            return <th key={key}>{key}</th>
        })
    }

    getRowsData = function() {
        // get data, sort and create a table of the data pairs
        this.dataList = [];
        this.jsonToList();
        this.sortList();

        return this.dataList.map( (row, index) => {
            return <tr key={index}><RenderRow key={index} data={row} keys={this.props.keys}/></tr>
        })
    }

    render() {
        return (
            <div className="scrollDiv">

                <input type="image" title="sort" alt="toggle-sort" src="images/sort-toggle-icon.svg" className="sortButton" onClick={() => {
                    var tmpSortAscending = !this.state.sortAscending;
                    this.setState({sortAscending: tmpSortAscending})
                }}></input>

                <table className="jsonTable">
                    <thead>
                        <tr>{this.getHeader()}</tr>
                    </thead>
                    <tbody>
                        {this.getRowsData()}
                    </tbody>
                </table>
            </div>
        );
    }

}

const RenderRow = (props) => {
    // render rows of the table
    return props.keys.map( (key, index) => {
        return <td className="tdJsonTable" key={props.data[index]}>{props.data[index]}</td>
    })
}

