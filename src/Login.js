/*
 * Copyright (c) 2018 - 2024, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React from 'react'
import './App.css'
import './css/bootstrap.css'
import AuthenticationService from './service/AuthenticationService';
import {Navigate} from "react-router";

class Login extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            auth: false,
        }

        this.handleLinkSubmit = this.handleLinkSubmit.bind(this);
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handlePwChange = this.handlePwChange.bind(this);
    }

    handleLinkSubmit(event) {
        event.preventDefault();

        const username = this.state.username
        const password = this.state.password
        const self = this

        AuthenticationService
            .executeLogin(username, password)
            .then(response => {
                AuthenticationService.registerSuccessfulLogin(username, password);
                AuthenticationService.setAuthorities(response.data.authorities);
                self.setState({
                    auth: true
                })


            })
            .catch(error => {
                console.log(error)
            });
    }

    handleUserNameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePwChange(event) {
        this.setState({password: event.target.value});
    }

    render() {

        if (this.state.auth === true) {
            /*  toggle is used to render App.js to make the Admin menu option show  */

            return (
                <Navigate to={"/get_letters/0"}/>
            )
        }

        return (
            <div>
                <form onSubmit={this.handleLinkSubmit}>
                    <div className="row mt-5">
                        <div className='col-sm-2 mb-2'>
                            <label htmlFor="status">User name</label>
                        </div>

                        <div className='col-sm-3 mb-2'>

                            <input
                                type="text"
                                className="form-control  ml-5"
                                id="username"
                                value={this.state.username}
                                onChange={this.handleUserNameChange}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-sm-2 mb-2'>
                            <label htmlFor="status">Password</label></div>

                        <div className='col-sm-3 mb-2'>
                            <input
                                type="password"
                                className="form-control  ml-5"
                                id="password"
                                value={this.state.password}
                                onChange={this.handlePwChange}
                            />
                        </div>
                    </div>
                    <input
                        type="submit"
                        className="btn btn-outline-success mybutton mt-5"
                        value="Submit"
                    />
                </form>
            </div>
        );
    }
}

export default Login
