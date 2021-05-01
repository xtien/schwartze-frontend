/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import axios from "axios";
import {Link} from "react-router-dom";
import './css/bootstrap.css'
import AuthenticationService from "./service/AuthenticationService";
import strings from './strings.js'
import detectBrowserLanguage from "detect-browser-language";

class Text extends Component {

    constructor(props) {
        super(props)

        this.state = {
            entity: props.match.params.entity,
            id: props.match.params.id,
            person: {},
            location: {},
            text: {},
            subject: {}
        }

        strings.setLanguage(detectBrowserLanguage().substring(0,2));

        let postData = {
            location_id: this.state.entity === 'location' ? this.state.id : null,
            person_id: this.state.entity === 'person' ? this.state.id : null,
            letter_id: this.state.entity === 'letter' ? this.state.id : null,
            subject_id: this.state.entity === 'subject' ? this.state.id : null,
            language: strings.getLanguage()
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_text/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    text: response.data.text,
                    location: response.data.location,
                    person: response.data.person,
                    letter: response.data.letter,
                    subject: response.data.subject
                })
            )
    }

    render() {

        const location = this.state.location;
        const person = this.state.person;
        const letter = this.state.letter;
        const subject = this.state.subject;

        let text =
            (location != null) ? location.text : (
                (person != null ? person.text : (
                    (letter != null ? letter.text : (
                        (subject != null) ? subject.text : (
                            ''
                        )))))
            );

        return (
            <div className='textpage ml-5'>
                <div>
                    {this.state.person != null ?
                        <h3><Link className='mb-5'
                                  to={'/get_person_details/' + person.id}> {person.nick_name} {(person.tussenvoegsel != null ? (person.tussenvoegsel + ' ') : '')} {person.last_name}</Link>
                        </h3>
                        : null
                    }</div>
                <div>
                    {this.state.location != null ?
                        <h3><Link to={'/get_location_details/' + location.id}> {location.location_name}</Link></h3>
                        : null
                    }
                </div>
                <div>
                    {this.state.letter != null ?
                        <h3><Link to={'/get_letter_details/' + letter.number + '/0'}> Brief {letter.number}</Link></h3>
                        : null
                    }
                </div>
                <div>
                    {this.state.subject != null ?
                        <div>
                            <h3>     {subject.name}</h3>
                        </div>
                        : null
                    }
                </div>
                <div className='mt-3'>
                    {/* TODO: this needs to change when others than myself get access to data entry */}
                    {(text != null && text.text_string != null) ?
                        <div dangerouslySetInnerHTML={{__html: text.text_string}}/>
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default Text
