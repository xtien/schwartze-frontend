import React, {Component} from 'react'
import axios from "axios";
import {Link} from "react-router-dom";
import './css/bootstrap.css'
import AuthenticationService from "./service/AuthenticationService";

class Text extends Component {

    constructor(props) {
        super(props)

        this.state = {
            entity: props.match.params.entity,
            id: props.match.params.id,
            person: {},
            location: {},
            text: {}
        }

        let postData = {
            location_id: this.state.entity === 'location' ? this.state.id : null,
            person_id: this.state.entity === 'person' ? this.state.id : null,
            letter_id: this.state.entity === 'letter' ? this.state.id : null
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_text/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    text: response.data.text,
                    location: response.data.location,
                    person: response.data.person
                })
            )
    }

    render() {

        const location = this.state.location;
        const person = this.state.person;
        let text = location != null ? location.text : person.text;

        return (
            <div className='textpage ml-5'>
                <div>
                    {this.state.person != null ?
                        <h3><Link className='mb-5'
                                  to={'/get_person_details/' + person.id}> {person.first_name} {person.last_name}</Link>
                        </h3>
                        : null
                    }</div>
                <div>
                    {this.state.location != null ?
                        <h3><Link to={'get_location_details' + location.id}> {location.location_name}</Link></h3>
                        : null
                    }
                </div>
                <div className='mt-3'>
                    {(text != null && text.text_string != null) ?
                        <!-- TODO: this needs to change when others than myself get access to data entry -->
                        <div dangerouslySetInnerHTML={{__html: text.text_string}}/>
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default Text