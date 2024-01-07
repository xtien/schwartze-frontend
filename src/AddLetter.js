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
import {Navigate}  from "react-router-dom";
import AuthenticationService from "./service/AuthenticationService";

class AddLetter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            number: '',
            collectie: '',
            date: ''
        };

        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.handleCollectieChange = this.handleCollectieChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    handleDateChange(event) {
        this.setState({date: event.target.value});
    }

    handleNumberChange(event) {
        this.setState({number: event.target.value});
    }

    handleCollectieChange(event) {
        this.setState({collectie: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            letter: {
                number: this.state.number,
                collectie: {
                    id: parseInt(this.state.collectie)
                },
                 date: this.state.date,
            }
        };

        axios.post(process.env.REACT_APP_API_URL  + '/admin/add_letter/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    editDone: true,
                    number: response.data.letter.number
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
                <Navigate to={"/get_letter_details/" + this.state.number + '/0'}/>
            )
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group mt-3">
                    <label htmlFor="status">Nummer</label>
                    <input
                        type="text"
                        className="form-control"
                        id="number"
                        value={this.state.number}
                        onChange={this.handleNumberChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">Collectie</label>
                    <input
                        type="number"
                        className="form-control"
                        id="collectie"
                        value={this.state.collectie}
                        onChange={this.handleCollectieChange}
                    />
                </div>
                 <div className="form-group mt-3">
                    <label htmlFor="header">Datum</label>
                    <input
                        type="text"
                        className="form-control"
                        id="links"
                        value={this.state.date}
                        onChange={this.handleDateChange}
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

export default AddLetter
