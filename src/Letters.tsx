/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import * as React from 'react'
import {Component} from 'react'
import axios from "axios";
import _ from "lodash";
import {Link} from "react-router-dom";
import ReactTable, {Column} from "react-table-6";
import 'react-table-6/react-table.css';
import AuthenticationService from "./service/AuthenticationService";
import {Navigate} from "react-router";
import strings from './strings.js'
import language from "./language";

class Letters extends Component<any, any> {

    state: { resultCode: number; data: string[]; letters: {}[]; order_by: string; search_term: string; go_search: boolean; page: string; back_to_letters: boolean; number: number; gotoletter: boolean; };

    constructor(props) {
        super(props)

        const params = window.location.href.split('/')
        const page = params[4]

        this.state = {
            resultCode: -1,
            data: ['a', 'b'],
            letters: [{}],
            order_by: 'number',
            search_term: '',
            go_search: false,
            page: page,
            back_to_letters: false,
            number: 0,
            gotoletter: false
        }
        language()

        this.sort = this.sort.bind(this);
        this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.letterbynumber = this.letterbynumber.bind(this);
        this.handleletternumber = this.handleletternumber.bind(this);

        const axiosConfig = AuthenticationService.getAxiosConfig();
        const pData = this.getPostData();

        const url = process.env.REACT_APP_API_URL + (this.state.order_by === 'number' ? '/get_letters/' : '/get_letters_by_date/');

        axios.post(url,
            pData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    letters: response.data.letters,
                    order_by: 'date'
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    getPostData() {
        return {requestCode: 0};
    }

    sort(event) {
        event.preventDefault();

        const postData = {
            requestCode: 0
        };

        let axiosConfig = AuthenticationService.getAxiosConfig();

        const url = process.env.REACT_APP_API_URL + (this.state.order_by === 'date' ? '/get_letters_by_date/' : '/get_letters/');
        const a = this.state.order_by;

        axios.post(url,
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    letters: response.data.letters,
                    order_by: a === 'number' ? 'date' : 'number'
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    handleSearchTermChange(event) {
        this.setState({search_term: event.target.value});
    }

    handleletternumber(event) {
        this.setState({number: event.target.value});
    }

    handleSearchSubmit(event) {
        event.preventDefault();

        this.setState({
            go_search: true
        })

    }

    letterbynumber(event) {
        this.setState({
            number: this.state.number,
            gotoletter: true
        })
    }

    render() {

        const op_nummer = strings.op_nummer;
        const op_datum = strings.op_datum;
        const senderheader = strings.sender;
        const locationheader = strings.location;
        const recipientheader = strings.recipient;
        const dateheader = strings.date;
        const remarksheader = strings.remarks;

        const search_term = this.state.search_term;
        const search_letters = '/search_letters/' + search_term;
        const pagenumber = this.state.page;
        const gotoletter = '/get_letter_details/' + this.state.number + '/0/';

        if (this.state.go_search === true) {
            this.setState({
                go_search: false
            })
            return <Navigate to={search_letters}/>
        }

        if (this.state.gotoletter === true) {
            return <Navigate to={gotoletter}/>
        }

        const columns: Column<any>[] = [{
            id: 'number',
            Header: '',
            accessor: data => {
                const nr = data.number;
                const linkto = '/get_letter_details/' + nr + '/' + pagenumber;
                let result = <Link to={linkto}>
                    <div className='number'>{nr}</div>
                </Link>
                return result;
            },
            width: 50,
            className: 'text-right'
        }, {
            Header: senderheader,
            id: 'senders',
            accessor: data => {
                let senderList = []
                if (data != null && data.senders != null) {
                    senderList = data.senders.map(r => <span key={r.id}><Link
                        to={`/get_person_details/${r.id}`}>{r.nick_name} {r.tussenvoegsel} {r.last_name} </Link> </span>);
                }
                return senderList;
            },
        }, {
            Header: locationheader,
            id: 'sender_location',
            width: 100,
            accessor: data => {
                let locations = [];
                let ids = [];
                _.map(data.sender_location, location => {
                    locations.push(location.location_name);
                    ids.push(location.id);
                });
                const location_content = locations[0];
                const id_content = ids[0];
                const linkTo = '/get_location_details/' + id_content;
                let result = <Link to={linkTo}>{location_content}</Link>
                return result;
            },
        }, {
            Header: recipientheader,
            id: 'recipients',
            accessor: data => {
                let recipientList = []
                if (data != null && data.recipients != null) {
                    recipientList = data.recipients.map(r => <span key={r.id}><Link
                        to={`/get_person_details/${r.id}`}>{r.nick_name} {r.tussenvoegsel} {r.last_name} </Link> </span>);
                }
                return recipientList;
            },
        }, {
            Header: locationheader,
            id: 'recipient_location',
            width: 100,
            accessor: data => {
                let locations = [];
                let ids = [];
                _.map(data.recipient_location, location => {
                    locations.push(location.location_name);
                    ids.push(location.id);
                });
                const location_content = locations[0];
                const id_content = ids[0];
                const linkTo = '/get_location_details/' + id_content;
                let result = <Link to={linkTo}>{location_content}</Link>
                return result;
            },
        }, {
            Header: remarksheader,
            accessor: 'remarks',
        }, {
            Header: dateheader,
            accessor: 'date',
            width: 100
        }]

        return (

            <div className='container'>
                <div className="row">
                    <div className='col-sm-3'>
                        <form onSubmit={this.sort} className='mb-3 mt-3'>
                            <input
                                type="submit"
                                className="btn btn-outline-secondary mybutton"
                                value={this.state.order_by === 'date' ? op_nummer : op_datum}
                            />
                        </form>
                    </div>

                    <div className='col-sm-3'>
                        <form onSubmit={this.letterbynumber} className='mb-3 mt-3'>
                            <input
                                type="input"
                                id="nr"
                                placeholder={strings.naar_nummer}
                                onChange={this.handleletternumber}
                                className="form-control w-50"
                            />
                        </form>
                    </div>

                    <div className='col-sm-6'>
                        <form onSubmit={this.handleSearchSubmit} className='mb-3 mt-3'>
                            <input
                                type="input"
                                id="text"
                                placeholder={strings.search}
                                onChange={this.handleSearchTermChange}
                                className="form-control w-75"
                            />
                        </form>
                    </div>

                </div>
                <div className='container'>
                    <ReactTable
                        data={this.state.letters}
                        columns={columns}
                        // @ts-ignore
                        page={this.state.page}
                        onPageChange={page => this.setState({'page': page})}
                    />
                </div>
            </div>
        )
    }
}

export default Letters
