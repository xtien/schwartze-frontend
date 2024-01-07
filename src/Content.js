/*
 * Copyright (c) 2018 - 2024, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */
import React, {Component} from 'react'
import strings from "./strings";
import axios from "axios";
import AuthenticationService from "./service/AuthenticationService";
import {Link} from "react-router-dom";
import Cookies from "universal-cookie";
import language from "./language";

class Content extends Component {

    constructor(props) {
        super(props)

        const lang = language()

        this.state = {
            contentList: [],
        }

        const postData = {
            language: lang
        };

        const url = process.env.REACT_APP_API_URL + '/get_content/'

        axios.post(url,
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.setState({
                        contentList: response.data.content,
                    });
                    const cookies = new Cookies();
                    cookies.remove('pageNumber', {path: '/'});
                    cookies.remove('chapterNumber', {path: '/'});
                }
            )
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const items = this.state.contentList.map(function (item) {
            const linkTo = '/get_page/' + item.chapter_number + '/' + item.page_number
            return <div><Link to={linkTo}>{item.chapter_number}. {item.chapter_title}</Link></div>
        });

        return (
            <div className='container letter'>
                <h3>{strings.content}</h3>
                <div className='mt-3 ml-3'>
                    {items}
                </div>
            </div>
        )
    }
}

export default Content
