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

class Locations extends Component {

    constructor() {
        super()

        this.state = {
            resultCode: -1,
            data: ['a', 'b'],
            locations: [{}]
        }

        let postData = {
            requestCode: 0
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_locations/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    locations: response.data.locations
                })
            )
    }

    render() {

        const columns = [{
            accessor: 'id',
            width: 40
        }, {
            id: 'name',
            accessor: data => {
                const id = data.id;
                const name = data.location_name;
                const linkto = '/get_location_details/' + id;
                let result = <Link to={linkto}>{name}</Link>
                return result;
            },
            width: 300,
            className: 'text'
        }, {
             accessor: 'comment'
        }]

        return (
            <div className='container'>
                <ReactTable
                    data={this.state.locations}
                    columns={columns}
                />
            </div>
        )



    }
}

export default Locations
