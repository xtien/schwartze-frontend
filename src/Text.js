import React, {Component} from 'react'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import './css/bootstrap.css'

class Text extends Component {

    constructor(props) {
        super(props)

        this.state = {
            person_id: props.match.params.person_id,
            location_id: props.match.params.location_id,
            id: props.match.params.id,
            person: {},
            location: {},
            text: {}
        }

        let postData = {
            id: this.state.id,
            location_id: this.state.location_id,
            person_id: this.state.person_id,

        };
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post('https://pengo.christine.nl:8443/get_text/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    text: response.data.location.text,
                    location: response.data.location,
                    person: response.data.person
                })
            )
    }

    render() {

        const location = this.state.location;
        const person = this.state.person;
        let text = location.text != null ? location.text : person.text;

        return (
            <div className='container'>
                <div>
                    {this.state.person != null ?
                        <Link
                            to={'get_person' + person.id}> {person.first_name} {person.last_name}</Link>
                        : null
                    }</div>
                <div>
                    {this.state.location != null ?
                        <Link to={'get_location' + location.id}> {location.location_name}</Link>
                        : null
                    }
                </div>
                <div>
                    {(text != null && text.text_string != null) ?
                        <div>
                            {text.text_string}
                        </div>
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default Text