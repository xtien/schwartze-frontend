/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import axios from "axios";
import {Link} from "react-router-dom";
import ReactTable from "react-table";
import AuthenticationService from "./service/AuthenticationService";
import detectBrowserLanguage from 'detect-browser-language'
import strings from './strings.js'

class People extends Component {

    constructor() {
        super()

        this.state = {
            resultCode: -1,
            people: [{}],
            order_by: 'firstname',
            search_term: ''
        }
        strings.setLanguage(detectBrowserLanguage().substring(0, 2));

        this.sort = this.sort.bind(this);

        this.apiCall();
    }

    handleSearchTermChange(event) {
        this.setState({search_term: event.target.value});
    }

    handleSearchSubmit(event) {
        event.preventDefault();

        const postData = {
            search_term: this.state.search_term
        }

        axios.post(process.env.REACT_APP_API_URL + 'search_people',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    people: response.data.people,
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    sort(event) {
        event.preventDefault();
        this.apiCall()
    }

    apiCall() {
        let postData = {
            requestCode: 0
        };

        let axiosConfig = AuthenticationService.getAxiosConfig();

        const url = process.env.REACT_APP_API_URL + (this.state.order_by === 'lastname' ? '/get_people_by_lastname/' : '/get_people/');
        const a = this.state.order_by;

        axios.post(url,
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    people: response.data.people,
                    order_by: a === 'lastname' ? 'firstname' : 'lastname'
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    render() {

        const op_achternaam = strings.op_achternaam;
        const op_voornaam = strings.op_voornaam;
        const search = strings.search;

        const columns = [{
            accessor: 'id',
            width: 40
        }, {
            id: 'name',
            accessor: data => {
                const id = data.id;
                const name = (data.nick_name != null ? data.nick_name : '') + " "
                    + (data.tussenvoegsel != null ? data.tussenvoegsel : '') + " "
                    + (data.last_name != null ? data.last_name : '');
                const linkto = '/get_person_details/' + id;
                let result = <Link to={linkto}>{name}</Link>
                return result;
            },
            width: 300,
            className: 'text'
        }, {
            accessor: 'comment'

        }]

        return (

            <div>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <form onSubmit={this.sort} className='ml-5 mb-2'>
                                <input
                                    type="submit"
                                    className="btn btn-outline-secondary mybutton"
                                    value={this.state.order_by === 'lastname' ? op_voornaam : op_achternaam}
                                />
                            </form>
                        </td>
                        <td>
                            <div className='form-group searchfield mb-2 mr-2'>
                                <form onSubmit={this.handleSearchSubmit}>
                                    <input
                                        type="text"
                                        id="text"
                                        value={this.state.search_term}
                                        onChange={this.handleSearchTermChange}
                                        className="form-control textarea"
                                    />
                                </form>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className='container'>
                    <ReactTable
                        data={this.state.people}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}

export default People
