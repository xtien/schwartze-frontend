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
import {Redirect} from "react-router";
import detectBrowserLanguage from 'detect-browser-language'
import strings from './strings.js'

class Letters extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultCode: -1,
            data: ['a', 'b'],
            letters: [{}],
            order_by: 'number',
            search_term: '',
            go_search: false,
            page: props.match.params.page,
            back_to_letters: false,
            number: 0,
            gotoletter: false
        }
        strings.setLanguage(detectBrowserLanguage().substring(0,2));

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

    getPostData(){
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
        const naar_nummer = strings.naar_nummer;
        const search = strings.search;
        const previous = strings.previous;
        const next = strings.next;

        if(this.state.backButtonPressed === true){
            return <Redirect to={'/'}/>
        }

        const search_term = this.state.search_term;
        const search_letters = '/search_letters/' + search_term;
        const pagenumber = this.state.page;
        const gotoletter = '/get_letter_details/' + this.state.number + '/0/';

        if (this.state.go_search === true) {
            this.setState({
                go_search: false
            })
            return <Redirect to={search_letters}/>
        }

        if (this.state.gotoletter === true) {
            return <Redirect to={gotoletter}/>
        }

        const columns = [{
            id: 'number',
            Header: '',
            accessor: data => {
                const nr = data.number;
                const linkto = '/get_letter_details/' + nr + '/' + pagenumber;
                let result = <Link to={linkto}><div className='number'>{nr}</div></Link>
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
                    senderList = data.senders.map(r => <span key={r.id}><Link
                        to={`/get_person_details/${r.id}`}>{r.nick_name} {r.tussenvoegsel} {r.last_name} </Link> </span>);
                } else {
                    senderList = '';
                }
                return senderList;
            },
        }, {
            Header: 'location',
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
            Header: 'recipient ',
            id: 'recipients',
            accessor: data => {
                let recipientList = []
                if (data !=null && data.recipients !=null) {
                    recipientList = data.recipients.map(r => <span key={r.id}><Link
                        to={`/get_person_details/${r.id}`}>{r.nick_name} {r.tussenvoegsel} {r.last_name} </Link> </span>);
                } else {
                    recipientList = '';
                }
                 return recipientList;
            },
        }, {
            Header: 'location',
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
            Header: 'remarks',
            accessor: 'remarks',
        }, {
            Header: 'date',
            accessor: 'date',
            width: 100
        }]

        return (

            <div>
                <table width="100%">
                    <tbody>
                    <tr>
                        <td>
                            <form onSubmit={this.sort} className='ml-5 mb-2'>
                                <input
                                    type="submit"
                                    className="btn btn-outline-secondary mybutton"
                                    value={this.state.order_by === 'date' ? op_nummer : op_datum}
                                />

                            </form>
                        </td>
                        <td align="right">
                            <form onSubmit={this.letterbynumber}>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div className='form-group searchfield mb-2 mr-2'>
                                                <input
                                                    type="text"
                                                    id="nr"
                                                    placeholder={naar_nummer}
                                                    onChange={this.handleletternumber}
                                                    className="form-control textarea"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                            </form>
                        </td>
                        <td align="right">
                            <form onSubmit={this.handleSearchSubmit}>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div className='form-group searchfield mb-2 mr-2'>
                                                <input
                                                    type="text"
                                                    id="text"
                                                    value={this.state.text}
                                                    onChange={this.handleSearchTermChange}
                                                    className="form-control textarea"
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="submit"
                                                className='btn btn-outline-success mybutton mb-2 mr-5'
                                                value={search}
                                            /></td>
                                    </tr>
                                    </tbody>
                                </table>

                            </form>
                        </td>
                      </tr>
                    </tbody>
                </table>

                <div className='container'>
                    <ReactTable
                        data={this.state.letters}
                        columns={columns}
                        page={this.state.page}
                        onPageChange={page => this.setState({'page': page})}
                    />
                </div>
            </div>
        )
    }
}

export default Letters
