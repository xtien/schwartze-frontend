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
import AuthenticationService from './service/AuthenticationService';
import {Link} from "react-router-dom";
import _ from "lodash";
import ReactTable from "react-table-6";

class SearchLetters extends Component {

    constructor(props) {
        super(props)

        const params = window.location.href.split('/')
        const search_term = params[4]

        this.state ={
            letters: [{}]
        }

        let postData = {
            search_term: search_term,
         };

        axios.post(process.env.REACT_APP_API_URL + '/search_letters/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    letters: response.data.letters,
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    render() {

        const columns = [{
            id: 'number',
            Header: '',
            accessor: data => {
                const nr = data.number;
                const linkto = '/get_letter_details/' + nr + '/0';
                let result = <Link to={linkto}>{nr}</Link>
                return result;
            },
            width: 50,
            className: 'text-right'
        }, {
            Header: 'sender ',
            id: 'senders',
            accessor: data => {
                let senderList = []
                if (data !=null && data.senders !=null) {
                    senderList = data.senders.map((r) => <span><Link
                        to={`/get_person_details/${r.id}`}>{r.nick_name} {r.tussenvoegsel} {r.last_name} </Link> </span>);
                } else {
                    senderList = '';
                }
                return senderList;
            },
        }, {
            Header: 'location',
            id: 'sender_location',
            accessor: data => {
                let locations = [];
                _.map(data.sender_location, location => {
                    const locationName = location.name;
                    locations.push(locationName);
                });
                const location_content = locations.join(', ');
                const linkTo = '/get_location_details/' + location_content;
                let result = <Link to={linkTo}>{location_content}</Link>
                return result;
            },
        }, {
            Header: 'recipient ',
            id: 'recipients',
            accessor: data => {
                let recipientList = []
                if (data !=null && data.recipients !=null) {
                    recipientList = data.recipients.map((r) => <span><Link
                        to={`/get_person_details/${r.id}`}>{r.nick_name} {r.tussenvoegsel} {r.last_name} </Link> </span>);
                } else {
                    recipientList = '';
                }
                return recipientList;
            },
        }, {
            Header: 'location',
            id: 'recipient_location',
            accessor: data => {
                let locations = [];
                let cell_ids = [];
                _.map(data.recipient_location, location => {
                    locations.push(location.name);
                    cell_ids.push(location.id);
                });
                const location_content = locations.join(', ');
                const id_content = cell_ids;
                const linkTo = '/get_location_details/' + id_content;
                let result = <Link to={linkTo}>{location_content}</Link>
                return result;
            },
        }, {
            Header: 'remarks',
            accessor: 'remarks',
        }, {
            Header: 'date',
            accessor: 'date'
        }]

        return (
            <div className='container'>
                <ReactTable
                    data={this.state.letters}
                    columns={columns}
                />
            </div>
        )
    }

}

export default SearchLetters
