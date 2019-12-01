import React, {Component} from 'react'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import './css/bootstrap.css'
import ReactTable from "react-table";

class Location extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultCode: -1,
            data: {},
            locationText: '',
            location: {},
            showEdit: false,
        }

        var array;
        var intarray

        if (props.match.params.id != null) {
            array = props.match.params.id.split(',');
            intarray = array.map(Number)
        }

        let postData = {
            id: this.state.location.id
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post('https://pengo.christine.nl:8443/get_location/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    location_text: response.data.location.location_text,
                    location_name: response.data.location.location_name,
                    location_comment: response.data.location.location_comment,
                    links: response.data.location.links
                })
            )
    }

    render() {

        const location = this.state.location;

        const columns = [{
            id: 'link_name',
            Header: '',
            accessor: data => {
                return data.link_name;
            },
            width: 50
        }, {
            id: 'link_url',
            Header: '',
            accessor: data => {
                return data.link_url;
            },
            width: 600
        }
        ]

        return (
            <div className='container'>
                <h3>{location.location_name}</h3>
                <p>{location.comment}</p>
                <p>{location.description}</p>

                <ReactTable
                    data={this.state.location.links}
                    columns={columns}
                />

            </div>
        )
    }
}

export default Location