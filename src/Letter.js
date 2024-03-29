/*
 * Copyright (c) 2018 - 2024, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import AuthenticationService from './service/AuthenticationService';
import {Link} from "react-router-dom";
import Util from "./service/Util";
import {Navigate} from "react-router";
import arrow_left from "./images/arrow_left.png";
import arrow_right from "./images/arrow_right.png";
import strings from './strings.js'
import language from "./language";

class Letter extends Component {

    constructor(props) {
        super(props)

        const params = window.location.href.split('/')
        const number = params[4]
        const page = params[5]

        this.state = {
            resultCode: -1,
            data: {},
            lettertext: 'no text',
            letter: {},
            showEdit: false,
            senders: [],
            recipients: [],
            imageData: [],
            sender_locations: [],
            recipient_locations: [],
            edit_letter: false,
            delete_letter: false,
            pageNumber: page
        }
        language()

        this.editLetter = this.editLetter.bind(this);
        this.deleteLetter = this.deleteLetter.bind(this);
        this.editComment = this.editComment.bind(this);
        this.forward = this.forward.bind(this);
        this.back = this.back.bind(this);
        this.letter = this.letter.bind(this);
        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
        this.post = this.post.bind(this);

        this.letter(number)
    }

    toggleEditDone = (letter) => {
        this.setState({
            showEdit: false,
            letter: letter
        })
    }

    editComment(event) {

        let letterNumber = event.target.value;
        const letter = this.state.letter;
        this.setState({
            showEdit: true,
            letter: letter,
            letterNumber: letterNumber
        })
    }

    editLetter(event) {
        this.setState({
            edit_letter: true
        })
    }

    deleteLetter(event) {
        this.setState({
            delete_letter: true
        })
    }

    forward(event) {
        this.next(this.state.letter.number)
    }

    back(event) {
        this.previous(this.state.letter.number)
    }

    letter(number) {
        this.post(process.env.REACT_APP_API_URL + '/get_letter_details/', number)
    }

    next(number) {
        this.post(process.env.REACT_APP_API_URL + '/get_next_letter/', number)
    }

    previous(number) {
        this.post(process.env.REACT_APP_API_URL + '/get_previous_letter/', number)
    }

    post(url, number) {

        const postData = {
            number: number
        };

        axios.post(url,
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.setState({
                        resultCode: response.data.resultCode,
                        lettertext: response.data.lettertext,
                        letter: response.data.letter,
                        senders: response.data.letter.senders,
                        recipients: response.data.letter.recipients,
                        sender_locations: response.data.letter.sender_location,
                        recipient_locations: response.data.letter.recipient_location
                    })
                    this.getLetterImages(response.data.letter.number)
                }
            )
            .catch(error => {
                console.log(error)
            });
    }

    getLetterImages(number) {

        const postData = {
            number: number
        };

        this.setState({
            imageData: []
        })
        axios.post(process.env.REACT_APP_API_URL + '/get_letter_images/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    imageData: response.data.images
                })
            ).catch(error => {
            console.log(error)
        });
    }

    render() {

        const nummer = strings.nummer;
        const from = strings.from;
        const to = strings.to;
        const date = strings.date;
        const search_term = this.state.search_term;
        const search_letters = '/search_letters/' + search_term;
        let pageNumber = this.state.pageNumber;
        if (pageNumber === 'undefined' || pageNumber === 0) {
            pageNumber = Math.floor(this.state.letter.number / 20);
        }

        if (this.state.go_search === true) {
            return <Navigate to={search_letters}/>
        }

        let linkTo = '';
        let linkToEditText = '';

        const letter = this.state.letter;
        const images = this.state.imageData;
        const remarks = this.state.letter.comment;

        const listItems = images.map((d) => (
            <div className='letter_image ml-4 mt-5'><img alt="original letter" src={`data:image/jpeg;base64,${d}`}/>
            </div>));
        const senders = this.state.senders;
        const recipients = this.state.recipients;
        const senderList = senders.map((s) => <span><Link
            to={`/get_person_details/${s.id}`} className='linkStyle'>{s.nick_name} {s.tussenvoegsel} {s.last_name} </Link> </span>);
        const recipientList = recipients.map((r) => <span><Link
            to={`/get_person_details/${r.id}`} className='linkStyle'>{r.nick_name} {r.tussenvoegsel} {r.last_name} </Link> </span>);

        const sender_locations = this.state.sender_locations;
        const senderLocationList = sender_locations.map((s) => <span><Link
            to={`/get_location_details/${s.id}`} className='linkStyle'>{s.location_name} </Link> </span>);
        const recipient_locations = this.state.recipient_locations;
        const recipientLocationList = recipient_locations.map((s) => <span><Link
            to={`/get_location_details/${s.id}`} className='linkStyle'>{s.location_name} </Link> </span>);

        if (letter != null && letter !== {}) {
            linkTo = '/get_text/letter/' + letter.id;
            linkToEditText = '/edit_text/letter/' + letter.id;
        }

        if (this.state.edit_letter === true) {
            return <Navigate to={'/edit_letter/' + letter.number}/>
        }
        if (this.state.delete_letter === true) {
            return <Navigate to={'/delete_letter/' + letter.number}/>
        }

        return (
            <div className='container mt-3'>
                {this.state.showEdit ? null : (

                    <div>
                        <div className="row">
                            <div className='col-sm-1'>
                                <button type="button"
                                        className='btn btn-link'
                                        onClick={this.back}>
                                    <img src={arrow_left} alt="back"/>
                                </button>
                            </div>
                            <div className='col-sm-3'>
                                <div>
                                    {
                                        AuthenticationService.isAdmin() === "true" ?
                                            <button
                                                className="btn btn-outline-success mybutton"
                                                onClick={this.editComment}>
                                                Edit commentaarregel
                                            </button> : null}
                                </div>
                            </div>
                            <div className='col-sm-3'>
                                <div>
                                    {
                                        AuthenticationService.isAdmin() === "true" ?
                                            <button
                                                className="btn btn-outline-warning mybutton ml-2"
                                                onClick={this.editLetter}>
                                                Edit afzender/ontvanger
                                            </button> : null}
                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <div>
                                    {
                                        AuthenticationService.isAdmin() === "true" ?
                                            <button
                                                className="btn btn-outline-warning mybutton ml-2"
                                                onClick={this.deleteLetter}>
                                                Delete brief
                                            </button> : null}
                                </div>
                            </div>
                            <div className='col-sm-1'>
                                <button
                                    className="btn btn-link"
                                    onClick={this.forward}>
                                    <img src={arrow_right} alt="forward"/>
                                </button>
                            </div>
                        </div>

                    </div>
                )}

                <div>
                    {this.state.showEdit ?
                        <div>
                            <div>
                                <CommentForm
                                    letter_number={this.state.letter.number}
                                    text={this.state.letter.remarks}
                                    date={this.state.letter.date}
                                    toggleEditDone={this.toggleEditDone}
                                />
                            </div>
                        </div> : null}
                </div>
                <div className='letter'>
                    <table>
                        <tbody>
                        <tr>
                            <td width="80">
                                <div>
                                    {nummer}
                                </div>
                            </td>
                            <td>
                                <div>
                                    {this.state.letter.number}
                                </div>
                            </td>
                        </tr>
                        {this.state.letter.collectie != null ?
                            <tr>
                                <td width="80">
                                    <div className='mb-3'>
                                        Collectie:
                                    </div>
                                </td>
                                <td colSpan="2">
                                    <div className='mb-3'>
                                        {this.state.letter.collectie.name} </div>
                                </td>
                            </tr>
                            : null
                        }
                        <tr>
                            <td>{from}:</td>
                            <td>{senderList}</td>
                            <td>
                                <div className='ml-3'>{senderLocationList}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>{to}:</td>
                            <td>{recipientList}</td>
                            <td>
                                <div className='ml-3'>{recipientLocationList}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>{date}:</td>
                            <td>{this.state.letter.date}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className='letter'>
                    <div dangerouslySetInnerHTML={{__html: this.state.lettertext}}/>
                </div>
                <div className='textpage mt-5 ml-5'>
                    {letter.text != null && Util.isNotEmpty(letter.text.text_string) ?
                        <div>
                            {/* TODO: this needs to change when others than myself get access to data entry */}
                            <p>
                                <div dangerouslySetInnerHTML={{__html: letter.text.text_string.substr(0, 300)}}/>
                            </p>
                            {letter.text.text_string.length > 300 ?
                                <p>
                                    <Link to={linkTo} className='mt-5 mb-5'> Meer </Link>
                                </p>
                                : null}
                        </div> : null}
                    <div className='remark'>
                        {remarks}
                    </div>

                </div>

                {AuthenticationService.isAdmin() === "true" ?
                    <div className='mb-5 mt-5 ml-5'>
                        <Link to={linkToEditText}>
                            Edit tekst
                        </Link>
                    </div>
                    : null}

                <div className='list_of_letters'>
                    {listItems}
                </div>

            </div>
        )
    }
}

class CommentForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            letter_number: this.props.letter_number,
            text: this.props.text,
            date: this.props.date,
            resultCode: 0,
            editDone: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({text: event.target.value});
    }

    handleDateChange(event) {
        this.setState({date: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            number: this.state.letter_number,
            comment: this.state.text,
            date: this.state.date
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/update_letter_comment/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    letter: response.data.letter,
                    editDone: true
                })
            )
    }

    render() {

        if (this.state.editDone === true) {
            this.setState({
                editDone: false
            })
            this.props.toggleEditDone(this.state.letter);
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="status"></label>
                    <textarea
                        type="text"
                        id="text"
                        value={this.state.text}
                        className="form-control  mb-5"
                        onChange={this.handleChange}/>
                    <label htmlFor="status">Datum</label>
                    <input
                        type="text"
                        id="date"
                        value={this.state.date}
                        className="form-control "
                        onChange={this.handleDateChange}/>
                </div>
                <input
                    type="submit"
                    className="btn btn-outline-success mybutton"
                    value="Submit"
                />
            </form>
        );
    }
}

export default Letter
