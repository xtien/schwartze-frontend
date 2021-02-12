/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import axios from "axios";
import _ from "lodash";
import {Link} from "react-router-dom";
import ReactTable from "react-table";
import AuthenticationService from "./service/AuthenticationService";

class PersonFromLetters extends Component {

    constructor(props) {
        super(props)

        let id;

        this.state = {
            resultCode: -1,
            data: ['a', 'b'],
            letters: [{}]
        }

        if (props.match.params.id != null) {
            id = props.match.params.id;
        }

        let postData = {
            requestCode: 0,
            fromId: id
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_letters_from_person/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    letters: response.data.letters
                })
            )
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
                let cell_ids = [];
                _.map(data.sender_location, location => {
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
            width: 100,
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
            width: 100,
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

export default PersonFromLetters
