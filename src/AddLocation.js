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

class AddLocation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            locationName: '',
            comment: '',
            location: {}
        };

        this.handleLocationNameChange = this.handleLocationNameChange.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCommentChange(event) {
        this.setState({comment: event.target.value});
    }

    handleLocationNameChange(event) {
        this.setState({location_name: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            location: {
                location_name: this.state.location_name,
                text: this.state.text,
                last_name: this.state.last_name,
                comment: this.state.comment,
                links: this.state.links,
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/add_location/',
            postData,
            AuthenticationService.getAxiosConfig(),
        )
            .then(response =>
                this.setState({
                    editDone: true,
                    id: response.data.location.id
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
                <Navigate to={"/get_location_details/" + this.state.id}/>
            )
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group mt-3">
                    <label htmlFor="status">Location</label>
                    <input
                        type="text"
                        className="form-control "
                        id="nick_name"
                        value={this.state.location_name}
                        onChange={this.handleLocationNameChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">Text</label>
                    <textarea
                        type="text"
                        className="form-control "
                        id="comments"
                        value={this.state.comment}
                        onChange={this.handleCommentChange}
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


export default AddLocation
