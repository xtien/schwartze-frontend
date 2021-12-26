/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import './css/bootstrap.css'
import AuthenticationService from "./service/AuthenticationService";
import {Redirect} from "react-router-dom";
import axios from "axios";

class Admin extends Component {

    constructor(props) {
        super(props)

        this.state = {
            addLetter: false,
            addPerson: false,
            addLocation: false,
            logout: false,
            indexing: false,
            refreshMe: props.match.params.refreshMe
        }

        this.add_location = this.add_location.bind(this);
        this.add_person = this.add_person.bind(this);
        this.add_letter = this.add_letter.bind(this);
        this.logout = this.logout.bind(this);
        this.index_letters = this.index_letters.bind(this);
    }

    add_person() {
        this.setState(
            {
                addPerson: true
            })
    }

    add_location() {
        this.setState(
            {
                addLocation: true
            })
    }

    add_letter() {
        this.setState(
            {
                addLetter: true
            })
    }

    index_letters() {

        this.setState(
            {
                indexing: true
            })

        let postData = {};

        let axiosConfig = AuthenticationService.getAxiosConfig();

        const url = process.env.REACT_APP_API_URL + '/admin/index_files/';

        axios.post(url,
            postData,
            axiosConfig
        )
            .then(response => {
                    this.setState({
                        indexing: false
                    })
                }
            )
            .catch(error => {
                console.log(error)
                this.setState({
                    indexing: false
                })
            });
    }

    logout() {

        AuthenticationService.logout()

        this.setState({
            logout: true
        })

        let postData = {
            request_code: 0
        };

        let axiosConfig = AuthenticationService.getAxiosConfig();

        const url = process.env.REACT_APP_API_URL + '/user/signout';

        axios.post(url,
            postData,
            axiosConfig
        )
            .then(response => {
                    this.setState({
                        logout: true
                    })
                }
            )
            .catch(error => {
                console.log(error)
            });
    }

    render() {

        const indexing = this.state.indexing;

        if (this.state.logout === true) {
            return (
                <Redirect to={"/"}/>
            )
        }
        if (this.state.addPerson === true) {
            return (
                <Redirect to={"/add_person/" + this.state.id}/>
            )
        }

        if (this.state.addLocation === true) {
            return (
                <Redirect to={"/add_location/" + this.state.id}/>
            )
        }

        if (this.state.addLetter === true) {
            return (
                <Redirect to={"/add_letter/" + this.state.id}/>
            )
        }

        return (
            <div>
                <div className='container letter'>
                    {
                        AuthenticationService.isAdmin() === "true" ?
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <form onSubmit={this.add_person} className='mt-5'>
                                            <input
                                                type="submit"
                                                className="btn btn-outline-success mybutton"
                                                value="Persoon toevoegen"
                                            />

                                        </form>
                                    </td>
                                    <td>
                                        <form onSubmit={this.add_letter} className='mt-5'>
                                            <input
                                                type="submit"
                                                className="btn btn-outline-success mybutton"
                                                value="Brief toevoegen"
                                            />

                                        </form>
                                    </td>
                                    <td>
                                        <form onSubmit={this.add_location} className='mt-5'>
                                            <input
                                                type="submit"
                                                className="btn btn-outline-success mybutton"
                                                value="Locatie toevoegen"
                                            />

                                        </form>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-outline-success mt-5"
                                            onClick={this.index_letters}>
                                            Index letters
                                        </button>
                                    </td>
                                    <td>
                                        <form onSubmit={this.logout} className='mt-5'>
                                            <input
                                                type="submit"
                                                className="btn btn-outline-success mybutton"
                                                value="Logout"
                                            />

                                        </form>
                                    </td>
                                </tr>

                                </tbody>
                            </table>
                            : null}
                </div>
                <div>{indexing === true ? <div className='mt-5'>Indexing....</div> : null}</div>
            </div>

        )
    }
}

export default Admin
