/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import {Navigate}  from "react-router-dom";
import AuthenticationService from "./service/AuthenticationService";

class AddPerson extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            nick_name: this.props.nick_name,
            full_name: this.props.full_name,
            tussenvoegsel: this.props.tussenvoegsel,
            last_name: this.props.last_name,
            comment: this.props.comment,
            links: this.props.links,
            person: {}
        };

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleMiddleNameChange = this.handleMiddleNameChange.bind(this);
        this.handleTussenvoegselChange = this.handleTussenvoegselChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleLinksChange = this.handleLinksChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCommentChange(event) {
        this.setState({comment: event.target.value});
    }

    handleFirstNameChange(event) {
        this.setState({nick_name: event.target.value});
    }

    handleMiddleNameChange(event) {
        this.setState({full_name: event.target.value});
    }

    handleTussenvoegselChange(event) {
        this.setState({tussenvoegsel: event.target.value});
    }

    handleLastNameChange(event) {
        this.setState({last_name: event.target.value});
    }

    handleLinksChange(event) {
        this.setState({links: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            person: {
                nick_name: this.state.nick_name,
                full_name: this.state.full_name,
                tussenvoegsel: this.state.tussenvoegsel,
                last_name: this.state.last_name,
                comment: this.state.comment,
                links: this.state.links,
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/add_person/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    editDone: true,
                    id: response.data.person.id
                })
            )
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    }

    render() {

        if (this.state.editDone === true) {
            return (
                <Navigate to={"/get_person_details/" + this.state.id}/>
            )
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <div><p>{this.state.person.nick_name} {this.state.person.last_name}</p></div>
                <div className="form-group">
                    <label htmlFor="status">Nick name</label>
                    <input
                        type="text"
                        className="form-control "
                        id="nick_name"
                        value={this.state.nick_name}
                        onChange={this.handleFirstNameChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">Full first name</label>
                    <input
                        type="text"
                        className="form-control "
                        id="full_name"
                        value={this.state.full_name}
                        onChange={this.handleMiddleNameChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">Tussenvoegsel</label>
                    <input
                        type="text"
                        className="form-control "
                        id="full_name"
                        value={this.state.tussenvoegsel}
                        onChange={this.handleTussenvoegselChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">Last name</label>
                    <input
                        type="text"
                        className="form-control "
                        id="last_name"
                        value={this.state.last_name}
                        onChange={this.handleLastNameChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">Text</label>
                    <input
                        type="text"
                        className="form-control "
                        id="comments"
                        value={this.state.comment}
                        onChange={this.handleCommentChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="header">Links</label>
                    <input
                        type="text"
                        className="form-control "
                        id="links"
                        value={this.state.links}
                        onChange={this.handleLinksChange}
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-outline-success mybutton mt-3"
                    value="Submit"
                />
            </form>
        );
    }
}

export default AddPerson
