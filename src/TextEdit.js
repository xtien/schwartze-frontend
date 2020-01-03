import React, {Component} from 'react'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import './css/bootstrap.css'
import AuthenticationService from "./service/AuthenticationService";

class TextEdit extends Component {

    constructor(props) {
        super(props)

        let s_id = null;
        const pathVars = props.location.pathname.split('/');
        if (pathVars[1] = 'subject') {
            s_id = pathVars[3]
        }

        this.state = {
            person_id: props.location.person_id,
            location_id: props.location.location_id,
            letter_id: props.location.letter_id,
            id: props.match.params.id,
            person: {},
            location: {},
            letter: {},
            subject: {},
            text: {},
            text_string: '',
            cancel: false,
            path: props.location.pathname,
            subject_id: s_id
        }


        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);

        let postData = {
            id: this.state.id,
            location_id: this.state.location_id,
            person_id: this.state.person_id,
            letter_id: this.state.letter_id,
            subject_id: this.state.subject_id
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_text/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    text_string: (response.data.letter != null && response.data.letter.text != null) ? response.data.letter.text.text_string : (
                        (response.data.location != null && response.data.location.text != null) ? response.data.location.text.text_string : (
                            (response.data.person != null && response.data.person.text != null) ? response.data.person.text.text_string : (
                                (response.data.subject != null && response.data.subject.text != null) ? response.data.subject.text.text_string : (
                                    null
                                )
                            )
                        )
                    ),
                    location: response.data.location,
                    person: response.data.person,
                    letter: response.data.letter,
                    subject: response.data.subject
                })
            )
    }

    handleTextChange(event) {
        this.setState({text_string: event.target.value});
    }

    handleCancel(event) {
        event.preventDefault();

        this.setState(
            {cancel: true}
        )
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            location_id: this.state.location_id,
            person_id: this.state.person_id,
            letter_id: this.state.letter_id,
            text_id: this.state.text_id,
            subject_id: this.state.subject_id,
            text_string: this.state.text_string,
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/update_text/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    location: response.data.location,
                    person: response.data.person,
                    letter: response.data.letter,
                    editDone: true
                })
            )
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            })
        ;
    }

    render() {

        const location = this.state.location;
        const person = this.state.person;
        const letter = this.state.letter;
        const redirectTo =
            (letter != null && letter.text != null) ? '/get_letter_details/' + letter.number : (
                (location != null && location.text != null) ? '/get_location_details/' + location.id : (
                    (person != null) ? '/get_person_details/' + person.id : (
                        '/subjects/')));

        if (this.state.editDone === true) {
            return <Redirect to={redirectTo}/>
        }

        return (
            <div className='container'>
                <div>
                    {
                        this.state.cancel ?
                            <Redirect to={redirectTo}/> :
                            <div>

                                <div>
                                    {this.state.person != null ?
                                        <Link
                                            to={'get_person' + person.id}>
                                            <h3> {person.first_name} {person.last_name}</h3></Link>
                                        : null
                                    }</div>
                                <div>
                                    {this.state.location != null ?
                                        <Link to={'get_location' + location.id}><h3> {location.location_name}</h3>
                                        </Link>
                                        : null
                                    }
                                </div>
                                <div>
                                    {this.state.letter != null ?
                                        <Link to={'get_letter_details' + letter.id}><h3> Brief {letter.id}</h3>
                                        </Link>
                                        : null
                                    }
                                </div>
                                <div>
                                    {this.state.subject != null ?
                                        <h3> {this.state.subject.name}</h3>
                                        : null
                                    }
                                </div>
                                <form onSubmit={this.handleSubmit} className='mt-5'>
                                    <div className="form-group">
                        <textarea
                            type="text"
                            className="form-control extratextarea"
                            id="text_string"
                            value={this.state.text_string}
                            onChange={this.handleTextChange}
                        />
                                    </div>
                                    <table className='mt-5'>
                                        <tr>
                                            <td>
                                                <input
                                                    type="submit"
                                                    className="btn btn-outline-success mybutton"
                                                    value="Save"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="button"
                                                    onClick={this.handleCancel}
                                                    className="btn btn-outline-danger mybutton"
                                                    value="Cancel"
                                                />
                                            </td>
                                        </tr>
                                    </table>
                                </form>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default TextEdit