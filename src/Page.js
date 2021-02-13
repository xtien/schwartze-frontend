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
import {Link, Redirect} from "react-router-dom";
import {Container, Row, Col} from 'reactstrap';

class Page extends Component {

    constructor(props) {
        super(props)

        this.state = {
            text: '',
            chapter: props.match.params.chapter,
            page: props.match.params.page,
            refMap: {
                person: '/get_person_details/',
                location: '/get_location/',
                letter: '/get_letter_details/',
                subject: '/get_text/subject/'
            }
        }

        this.post = this.post.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.nextChapter = this.nextChapter.bind(this);
        this.previousChapter = this.previousChapter.bind(this);
        this.delete_link = this.delete_link.bind(this);
        this.add_reference = this.add_reference.bind(this);

        this.post(props.match.params.chapter, props.match.params.page)
    }

    setPage = (page) => {
        this.setState({
            showLinkEdit: false,
            page: page
        })
    }

    delete_link(reference_id) {

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

    add_reference(event) {
        event.preventDefault();
        this.setState({
            showLinkEdit: true
        })
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

    renderReference(reference) {
        switch (reference.type) {
            case 'link':
                return <div>
                    <a href={reference.key}>{reference.description}</a>
                </div>
            case 'person':
                return (<div>
                    <Link to={this.state.refMap.person + reference.key}>{reference.description}</Link>
                    <button type="button" className='btn btn-link' onClick={this.delete_link(reference.id)}> del
                    </button>
                </div>)
            case 'location':
                return (<div>
                    <Link to={this.state.refMap.location + reference.key}>{reference.description}</Link>
                    <button type="button" className='btn btn-link' onClick={this.delete_link(reference.id)}> del
                    </button>
                </div>)
            case 'letter':
                return (<div>
                    <Link to={this.state.refMap.letter + reference.key}>{reference.description}</Link>
                </div>)
            case 'subject':
                return (<div>
                    <Link to={this.state.refMap.subject + reference.key}>{reference.description}</Link>
                </div>)
        }
    }

    render() {

        const page = this.state.page;
        let references = [];

        if (page != null && page.references != null) {
            references = page.references.map(function (reference, i) {
                return (
                    <div key={i}>
                        <table width="100%">
                            <tbody>
                            <tr>
                                <td>
                                    {this.renderReference(reference)}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                )
            })
        }

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

                <div>
                    {this.state.showLinkEdit ? (
                            <EditReferenceForm
                                pageNumber={this.state.pageNumber}
                                chapterNumber={this.state.chapterNumber}
                                key=''
                                reference_description=''
                                reference_type=''
                                setPage={this.setPage}
                            />
                        )
                        : ''}
                </div>

                <Container>
                    <Row>
                        <Col>
                            <div id='linkContainer'>
                                <h3 className='mt-5'>Links</h3>
                                {references}
                            </div>
                        </Col>
                        <Col>
                            <button type="button"
                                    className='btn btn-link'
                                    onClick={this.add_reference}>
                                Add reference
                            </button>

                        </Col>
                    </Row>
                </Container>


            </div>
        )
    }
}

class EditReferenceForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chapterNumber: this.props.chapterNumber,
            pageNumber: this.props.pageNumber,
            description: '',
            type: '',
            key: '',
        };
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleKeyChange = this.handleKeyChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleDescriptionChange(event) {
        this.setState({description: event.target.value});
    }

    handleTypeChange(event) {
        this.setState({type: event.target.value});
    }

    handleKeyChange(event) {
        this.setState({key: event.target.value});
    }

    handleCancel(event) {
        event.preventDefault();

        this.setState(
            {cancel: true}
        )
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            pageNumber: this.state.pageNumber,
            chapterNumber: this.state.chapterNumber,
            description: this.state.description,
            key: this.state.key,
            type: this.state.type,
            language: 'nl'
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/add_reference/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.props.setPage(response.data.page)
                }
            )

    }

    render() {

        const redirectTo = '/get_page/' + this.state.id;

        if (this.state.editDone === true) {
            return <Redirect to={redirectTo}/>
        }


        return (
            <div>
                <h5 className='mb-5'> Add page reference</h5>

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <table width="60%" className='mt-2'>
                            <tr>
                                <td width="150px"><label htmlFor="status">Description</label></td>
                                <td><input
                                    type="text"
                                    className="form-control textarea"
                                    id="description"
                                    value={this.state.description}
                                    onChange={this.handleDescriptionChange}
                                /></td>
                            </tr>
                        </table>

                        <table width="60%" className='mt-2'>
                            <tr>
                                <td width="150px"><label htmlFor="status">Type</label></td>
                                <td><input
                                    type="text"
                                    className="form-control textarea"
                                    id="description"
                                    value={this.state.type}
                                    onChange={this.handleTypeChange}
                                /></td>
                            </tr>
                        </table>

                        <table width="60%" className='mt-2'>
                            <tr>
                                <td width="150px"><label htmlFor="status">Key</label></td>
                                <td><input
                                    type="text"
                                    className="form-control textarea"
                                    id="description"
                                    value={this.state.key}
                                    onChange={this.handleKeyChange}
                                /></td>
                            </tr>
                        </table>

                    </div>
                    <table>
                        <tbody>
                        <tr>
                            <td></td>
                            <input
                                type="submit"
                                className="btn btn-outline-success mybutton mt-5 ml-5 mb-5"
                                value="Submit"
                            />
                            <td>
                                <input
                                    type="button"
                                    onClick={this.handleCancel}
                                    className="btn btn-outline-danger mybutton mt-5 ml-5 mb-5"
                                    value="Cancel"
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        )
    }
}

export default Page
