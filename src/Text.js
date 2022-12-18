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
import language from "./language";
import ReactJsAlert from "reactjs-alert"
class Text extends Component {

    constructor(props) {
        super(props)

        const params = window.location.href.split('/')
        const entity = params[4]
        const id = params[5]

        this.state = {
            entity: entity,
            id: id,
            person: {},
            location: {},
            text: {},
            subject: {},
            showError: false,
            error_message: ''
        }

        language()

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
                    subject: response.data.subject,
                    error_message: response.data.error_text
                })
            )
            .catch(error => {
                console.log(error)
                this.setState({
                    showError: true,
                    error_message: 'text not found'
                })
            });
    }

    render() {

        const location = this.state.location;
        const person = this.state.person;
        const letter = this.state.letter;
        const subject = this.state.subject;
        const back = strings.back;

        let showError = false;
        if(this.state.error_message != null && this.state.error_message != ''){
            showError = true;
        }

        let text =
            (location != null) ? location.text : (
                (person != null ? person.text : (
                    (letter != null ? letter.text : (
                        (subject != null) ? subject.text : (
                            ''
                        )))))
            );

        let link = null;
        let subjectLink = null;
        if (person !== null && person !== {}) {
            link = '/get_person_details/' + person.id;
        }
        if (location != null && location !== {}) {
            link = '/get_location_details/' + location.id;
        }
        if (letter != null && letter !== {}) {
            link = '/get_letter_details/' + letter.number + '/0';
        }
        if(subject !== null && subject !== {}){
            subjectLink = '/topics/';
        }

        return (
            <div className='textpage wide mt-5 ml-5'>
                <div>
                    {this.state.person != null ?
                        <h3><Link className='mb-5'
                                  to={link}> {person.nick_name} {(person.tussenvoegsel != null ? (person.tussenvoegsel + ' ') : '')} {person.last_name}</Link>
                        </h3>
                        : null
                    }</div>
                <div>
                    {this.state.location != null ?
                        <h3><Link to={link}> {location.location_name}</Link></h3>
                        : null
                    }
                </div>
                <div>
                    {this.state.letter != null ?
                        <h3><Link to={link}> Brief {letter.number}</Link></h3>
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
                <div className='mt-5'>{link !=null ? <Link className='mb-5' to={link}><h3>{back}</h3></Link> : null}</div>
                <div className='mt-5'>{subjectLink !=null ? <Link className='mb-5' to={subjectLink}><h3>{back}</h3></Link> : null}</div>
                <ReactJsAlert
                    status={showError}   // true or false
                    type="success"   // success, warning, error, info
                    title={this.state.error_message}
                    button= {strings.ok}// title you want to display
                    Close={() => this.setState({ status: false })}   // callback method for hide
                />

            </div>
        )
    }
}

export default Text
