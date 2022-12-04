/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
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

class CombinePerson extends Component {

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

        this.handleFirstPersonChange = this.handleFirstPersonChange.bind(this);
        this.handleSecondPersonChange = this.handleSecondPersonChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFirstPersonChange(event) {
        this.setState({first_id: event.target.value});
    }

    handleSecondPersonChange(event) {
        this.setState({second_id: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            id1: this.state.first_id,
            id2: this.state.second_id
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/get_combine_person/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    person1: response.data.person1,
                    person2: response.data.person2,
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
                                <label htmlFor="status" class="col-sm-2 col-form-label">Persoon nummer</label>
                                <div className="col-sm-2"><input
                                    type="text"
                                    pattern="[0-9]*"
                                    className="form-control textarea"
                                    id="first_person"
                                    value={this.state.first_id}
                                    onChange={this.handleFirstPersonChange}
                                /></div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="status" class="col-sm-2 col-form-label">Te combineren met</label>
                                <div className="col-sm-2"><input
                                    type="text"
                                    pattern="[0-9]*"
                                    className="form-control textarea"
                                    id="first_person"
                                    value={this.state.second_id}
                                    onChange={this.handleSecondPersonChange}
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
                        <CombinePersonForm
                            person1={this.state.person1}
                            person2={this.state.person2}
                        />
                    ) : null}
            </div>
        )

    }

}

class CombinePersonForm
    extends React
        .Component {

    constructor(props) {
        super(props);

        this.state = {
            person1: this.props.person1,
            person2: this.props.person2,
            redirect: false
        }

        this.combine = this.combine.bind(this);
        this.not = this.not.bind(this);
    }

    combine() {

        let postData = {
            requestCode: 0,
            id1: this.state.person1.id,
            id2: this.state.person2.id
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/put_combine_person/',
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
                <Navigate to={"/get_person_details/" + this.state.person1.id}/>
            )
        }

        const person1 = this.state.person1
        const person2 = this.state.person2

        return (
            <form onSubmit={this.combine}>
                <div className="letter text-black-50">
                    <div>
                        <p>
                            {person1.id} {person1.nick_name} {person1.full_name} {person1.last_name}
                        </p>
                    </div>
                    <div>
                        <p>
                            {person2.id} {person2.nick_name} {person2.full_name} {person2.last_name}
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

export default CombinePerson
