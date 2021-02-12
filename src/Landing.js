/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import './css/bootstrap.css'
import axios from "axios";
import AuthenticationService from "./service/AuthenticationService";
import {Link} from "react-router-dom";

class Landing extends Component {

    // https://medium.com/@thejasonfile/basic-intro-to-react-router-v4-a08ae1ba5c42

    constructor() {
        super()

        this.state = {
            home_text: '',
            blog_text: ''
        }

        let postData = {
            type: 'text',
            text_id: 'home',
            language: 'nl'
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_page_text/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    home_text: response.data.text,
                })
            )
            .catch(error => {
                console.log(error)
            });

        let pData = {
            text_type: 'text',
            text_id: 'blog',
            language: 'nl'
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_page_text/',
            pData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    blog_text: response.data.text,
                })
            )
            .catch(error => {
                console.log(error)
            });

    }

    render() {

        const home_text = this.state.home_text;
        const blog_text = this.state.blog_text;

        return (

            <div className='container'>
                <div className='photo'>
                    <img alt="briefkaart lizzy" src="https://www.lizzyansingh.nl/pics/32-1.jpg"
                    />
                </div>
                <div className='textpage mt-5 ml-5'>
                    {/* TODO: this needs to change when others than myself get access to data entry */}

                    <div dangerouslySetInnerHTML={{__html: home_text}}/>
                </div>
                <div className='textpage mt-5 ml-5'>
                    <div>
                        {/* TODO: this needs to change when others than myself get access to data entry */}
                        <div dangerouslySetInnerHTML={{__html: blog_text}}/>
                    </div>
                </div>
                <div className='textpage mt-5 ml-5'>
                    <Link to='/get_page/1/1'>pages</Link>
                </div>
            </div>
        )
    }
}

export default Landing
