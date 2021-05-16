/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import './css/bootstrap.css'
import AuthenticationService from "./service/AuthenticationService";
import strings from './strings.js'
import detectBrowserLanguage from "detect-browser-language";

class TextEdit extends Component {

    constructor(props) {
        super(props)

        this.state = {
            person_id: props.location.person_id,
            location_id: props.location.location_id,
            letter_id: props.location.letter_id,
            subject_id: props.location.subject_id,
            id: props.match.params.id,
            person: {},
            location: {},
            letter: {},
            subject: {},
            text: {},
            text_string: '',
            title_string: '',
            cancel: false,
            path: props.location.pathname,
        }

        strings.setLanguage(detectBrowserLanguage().substring(0,2));

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);

        let postData = {
            id: this.state.id,
            location_id: this.state.location_id,
            person_id: this.state.person_id,
            letter_id: this.state.letter_id,
            subject_id: this.state.subject_id,
            language: strings.getLanguage()
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
                    subject: response.data.subject,
                    title_string: (response.data.subject != null) ? response.data.subject.name : ''
                })
            )
    }

    handleTextChange(event) {
        this.setState({text_string: event.target.value});
    }

    handleTitleChange(event) {
        this.setState({title_string: event.target.value});
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
            title_string: this.state.title_string,
            language: strings.getLanguage()
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
        const subject = this.state.subject;
        const redirectTo =
            (letter != null) ? ('/get_letter_details/' + letter.number + '/0') : (
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
                                            to={'/get_person_details/' + person.id}>
                                            <h3> {person.nick_name} {(person.tussenvoegsel != null ? (person.tussenvoegsel + ' ') : '')} {person.last_name}</h3></Link>
                                        : null
                                    }</div>
                                <div>
                                    {this.state.location != null ?
                                        <Link to={'/get_location_details/' + location.id}><h3> {location.location_name}</h3>
                                        </Link>
                                        : null
                                    }
                                </div>
                                <div>
                                    {this.state.letter != null ?
                                        <Link to={'/get_letter_details/' + letter.number + '/0'}><h3> Brief {letter.number}</h3>
                                        </Link>
                                        : null
                                    }
                                </div>
                                <div>
                                    {this.state.subject != null ?
                                        <Link to={'/get_text/subject/' + subject.id}><h3> {this.state.subject.name}</h3>
                                        </Link>
                                        : null
                                    }
                                </div>
                                <form onSubmit={this.handleSubmit} className='mt-5'>
                                    <div className="form-group">
                                        <div>
                                            {this.state.subject != null ?
                                                <div><textarea
                                                    type="text"
                                                    rows="1"
                                                    id="title_string"
                                                    value={this.state.title_string}
                                                    onChange={this.handleTitleChange}
                                                />
                                                    </div>
                                                : null
                                            }
                                        </div>
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
