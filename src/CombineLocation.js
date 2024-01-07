/*
 * Copyright (c) 2018 - 2024, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import './App.css'
import './css/bootstrap.css'
import axios from "axios";
import {Navigate}  from "react-router-dom";
import AuthenticationService from "./service/AuthenticationService";

class CombineLocation extends Component {

    constructor(props) {
        super(props)

        const params = window.location.href.split('/')
        const id = params[4]

        this.state = {
            resultCode: -1,
            data: {},
            showConfirm: false,
            first_id: id,
            second_id: 0
        }

        this.handleFirstLocationChange = this.handleFirstLocationChange.bind(this);
        this.handleSecondLocationChange = this.handleSecondLocationChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFirstLocationChange(event) {
        this.setState({first_id: event.target.value});
    }

    handleSecondLocationChange(event) {
        this.setState({second_id: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            id1: this.state.first_id,
            id2: this.state.second_id
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/get_combine_location/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    location1: response.data.location1,
                    location2: response.data.location2,
                    showConfirm: true
                })
            );
    }

    render() {

        return (
            <div>
                {
                    this.state.showConfirm ? null : (
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group row">
                                <label htmlFor="status" class="col-sm-2 col-form-label">Locatie nummer</label>
                                <div className="col-sm-2"><input
                                    type="text"
                                    pattern="[0-9]*"
                                    className="form-control "
                                    id="first_person"
                                    value={this.state.first_id}
                                    onChange={this.handleFirstLocationChange}
                                /></div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="status" class="col-sm-2 col-form-label">Te combineren met</label>
                                <div className="col-sm-2"><input
                                    type="text"
                                    pattern="[0-9]*"
                                    className="form-control "
                                    id="first_person"
                                    value={this.state.second_id}
                                    onChange={this.handleSecondLocationChange}
                                /></div>
                            </div>
                            <input
                                type="submit"
                                className="btn btn-outline-success mybutton"
                                value="Combineer"
                            />
                        </form>)
                }
                {
                    this.state.showConfirm ? (
                        <CombineLocationForm
                            location1={this.state.location1}
                            location2={this.state.location2}
                        />
                    ) : null}
            </div>
        )

    }

}

class CombineLocationForm
    extends React
        .Component {

    constructor(props) {
        super(props);

        this.state = {
            location1: this.props.location1,
            location2: this.props.location2,
            redirect: false
        }

        this.combine = this.combine.bind(this);
        this.not = this.not.bind(this);
    }

    combine() {

        let postData = {
            requestCode: 0,
            id1: this.state.location1.id,
            id2: this.state.location2.id
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/put_combine_location/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.setState({
                        redirect: true
                    })
                }
            )

    }

    not() {
        this.setState({redirect: true})
    }

    render() {

        if (this.state.redirect) {
            return (
                <Navigate to={"/get_location_details/" + this.state.location1.id}/>
            )
        }

        const location1 = this.state.location1
        const location2 = this.state.location2

        return (
            <form onSubmit={this.combine}>
                <div className="letter text-black-50">
                    <div>
                        <p>
                            {location1.id} {location1.name}
                        </p>
                    </div>
                    <div>
                        <p>
                            {location2.id} {location2.name}
                        </p>
                    </div>
                </div>
                <input
                    className="btn btn-outline-success mybutton mt-5"
                    onClick={this.combine}
                    value="Combineren">
                </input>
                <input
                    className="btn btn-outline-danger mybutton mt-5"
                    onClick={this.not}
                    value="Niet doen">
                </input>
            </form>

        )
    }
}

export default CombineLocation
