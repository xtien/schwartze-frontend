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
import arrow_right from "./images/arrow_right.png";
import three_arrow_right from "./images/three_arrow_right.png";
import three_arrow_left from "./images/three_arrow_left.png";
import arrow_left from "./images/arrow_left.png";

class Page extends Component {

    constructor(props) {
        super(props)

        this.state = {
            text: '',
            chapter: props.match.params.chapter,
            page: props.match.params.page
        }

        this.post = this.post.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.nextChapter = this.nextChapter.bind(this);
        this.previousChapter = this.previousChapter.bind(this);

        this.post(props.match.params.chapter, props.match.params.page)
    }

    next() {
        let nextpage = parseInt(this.state.page) + 1;
        this.setState({
            page: nextpage
        })
        this.post(this.state.chapter, nextpage)
    }

    previous() {
        let previous = Math.max(parseInt(this.state.page) - 1, 1);
        this.setState({
            page: previous
        })
        this.post(this.state.chapter, previous)
    }

    nextChapter() {
        let nextchapter = parseInt(this.state.chapter) + 1
        this.setState({
            chapter: nextchapter,
            page: 1
        })
        this.post(nextchapter, this.state.page)
    }

    previousChapter() {
        let previouschapter = Math.max(parseInt(this.state.chapter) - 1, 1)
        this.setState({
            chapter: previouschapter,
            page: 1
        })
        this.post(previouschapter, this.state.page)
    }

    post(chapter, page) {

        const postData = {
            chapter: chapter,
            page: page,
            language: 'nl'
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_page_page/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.setState({
                        text: response.data.text,
                    })
                    this.getLetterImages(response.data.letter.number)
                }
            )
            .catch(error => {
                console.log(error)
            });
    }

    render() {

        return (
            <div>
                <table width='100%'>
                    <tr>
                        <td>
                            <button type="button"
                                    className='btn btn-link'
                                    onClick={this.previousChapter}>
                                <img src={three_arrow_left} alt="back"/>
                            </button>
                        </td>
                        <td>
                            <button type="button"
                                    className='btn btn-link'
                                    onClick={this.previous}>
                                <img src={arrow_left} alt="back"/>
                            </button>
                        </td>
                        <td>
                            <p className='page_header'>Chapter {this.state.chapter} &nbsp; &nbsp; &nbsp; page {this.state.page} </p>
                        </td>
                        <td>
                            <button type="button"
                                    className='btn btn-link'
                                    onClick={this.next}>
                                <img src={arrow_right} alt="back"/>
                            </button>
                        </td>
                        <td>
                            <button type="button"
                                    className='btn btn-link'
                                    onClick={this.nextChapter}>
                                <img src={three_arrow_right} alt="back"/>
                            </button>
                        </td>
                    </tr>
                </table>
                <p className='page_text'> {this.state.text}  </p>
            </div>
        )
    }
}

export default Page
