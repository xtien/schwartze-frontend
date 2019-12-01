import React, {Component} from 'react'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import './css/bootstrap.css'

class Text extends Component {

    constructor(props) {
        super(props)

        this.state = {
            person: {}
        }

        var array;
        var intarray

        if (props.match.params.id != null) {
            array = props.match.params.id.split(',');
            intarray = array.map(Number)
        }

        let postData = {
            id: intarray
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
             }
        };

        axios.post('https://pengo.christine.nl:8443/get_person_text/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    locationText: response.data.location.text,
                    location: response.data.location,
                })
            )
    }

    render() {

        const location = this.state.location;

        return (
            <div className='container'>
                {location}
            </div>
        )
    }
}

export default Text