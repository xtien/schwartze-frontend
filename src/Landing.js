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
import detectBrowserLanguage from 'detect-browser-language'
import strings from './strings.js'

class Landing extends Component {

    // https://medium.com/@thejasonfile/basic-intro-to-react-router-v4-a08ae1ba5c42

    constructor() {
        super()

        const languages = ['nl', 'en'];
        let lang = detectBrowserLanguage().substring(0, 2);
        if (!languages.includes(lang)) {
            lang = 'nl'
        }
        strings.setLanguage(lang);

        this.state = {
            home_text: '',
            blog_text: '',
            page: {},
            chapterNumber: '0',
            pageNumber: '0',
            refMap: {
                person: '/get_person_details/',
                location: '/get_location/',
                letter: '/get_letter_details/',
                subject: '/get_text/subject/'
            },
            language: lang
        }
        this.add_reference = this.add_reference.bind(this);
        this.renderReference = this.renderReference.bind(this);
        this.delete_link = this.delete_link.bind(this);

        const postData = {
            type: 'text',
            text_id: 'home',
            language: this.state.language
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

        const pData = {
            type: 'text',
            text_id: 'blog',
            language: this.state.language
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

        const ppData = {
            page_number: this.state.pageNumber,
            chapter_number: this.state.chapterNumber,
            language: this.state.language
        };
        axios.post(process.env.REACT_APP_API_URL + '/get_page_references/',
            ppData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    page: response.data.page,
                })
            )
            .catch(error => {
                console.log(error)
            });

    }

    delete_link(reference_id) {

        const postData = {
            reference: {
                id: reference_id
            },
            page_number: this.state.pageNumber,
            chapter_number: this.state.chapterNumber
        }
        axios.post(process.env.REACT_APP_API_URL + '/admin/remove_page_reference/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.setState({
                        page: response.data.page,
                    })
                }
            )
            .catch(error => {
                console.log(error)
            });
    }

    setPage = (page) => {
        this.setState({
            showLinkEdit: false,
            page: page
        })
    }

    add_reference(event) {
        event.preventDefault();
        this.setState({
            showLinkEdit: true
        })
    }

    toggleEditDone = (page) => {
        this.setState({
            showLinkEdit: false,
        })
        this.get_page(this.state.pageNumber, this.state.chapterNumber)
    }

    toggleEditDone = () => {
        this.setState({
            showLinkEdit: false,
        })
    }

    renderReference(reference) {
        const delete_link = this.delete_link;

        switch (reference.type) {
            case 'link':
                return <div>
                    <a href={reference.key}>{reference.description}</a>
                </div>
            case 'PERSON':
                return (<div className='mb-2'>
                    <Link to={this.state.refMap.person + reference.key}>{reference.description}</Link>
                    {AuthenticationService.isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id)
                                }}> del
                        </button> : ''}
                </div>)
            case 'LOCATION':
                return (<div className='mb-2'>
                    <Link to={this.state.refMap.location + reference.key}>{reference.description}</Link>
                    {AuthenticationService.isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id)
                                }}> del
                        </button> : ''}
                </div>)
            case 'LETTER':
                return (<div className='mb-2'>
                    <Link to={this.state.refMap.letter + reference.key + '/0'}>{reference.description}</Link>
                    {AuthenticationService.isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id)
                                }}> del
                        </button> : ''}
                </div>)
            case 'SUBJECT':
                return (<div className='mb-2'>
                    <Link to={this.state.refMap.subject + reference.key}>{reference.description}</Link>
                    {AuthenticationService.isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id)
                                }}> del
                        </button> : ''}
                </div>)
            case 'LINK':
                return (<div className='mb-2'>
                    <a href={reference.key} target="_blank" rel="noopener noreferrer">{reference.description}</a>
                    {AuthenticationService.isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id)
                                }}> del
                        </button> : ''}
                </div>)
        }
    }

    render() {

        const home_text = this.state.home_text;
        const blog_text = this.state.blog_text;

        const page = this.state.page;
        let references = [];
        const renderReference = this.renderReference;
        const add_reference = this.add_reference;

        if (page != null && page.references != null) {
            references = page.references.map(function (reference, i) {
                return (
                    <div key={i}>
                        <table width="100%">
                            <tbody>
                            <tr>
                                <td>
                                    {renderReference(reference)}
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
                <div id="sidebar-wrapper">
                    <ul className="sidebar-nav">
                        <ul className="sidebar-nav pt-3 pl-3">
                            <Link to='/get_page/1/1'>{strings.pages}</Link>
                        </ul>
                        <li className="sidebar-brand"></li>
                        <div id='linkContainer' className='ml-3'>
                            {references}
                        </div>
                        <div>
                            {
                                AuthenticationService.isAdmin() === "true" ?
                                    <button type="button"
                                            className='btn btn-link mt-5 pl-3'
                                            onClick={add_reference}>
                                        Add reference
                                    </button> : null
                            }
                        </div>
                    </ul>
                </div>

                <div>
                    {this.state.showLinkEdit ? (
                            <EditReferenceForm
                                pageNumber={this.state.pageNumber}
                                chapterNumber={this.state.chapterNumber}
                                key=''
                                reference_description=''
                                reference_type=''
                                setPage={this.setPage}
                                toggleEditDone={this.toggleEditDone}
                            />
                        )
                        :
                        <p className='page_text'> {this.state.text}  </p>
                    }
                </div>

                <div className='container'>
                    <div className='photo'>
                        <img alt="briefkaart lizzy" src="https://www.lizzyansingh.nl/pics/32-1.jpg"
                        />
                    </div>
                    <div className='textpage mt-5'>
                        {/* TODO: this needs to change when others than myself get access to data entry */}

                        <div dangerouslySetInnerHTML={{__html: home_text}}/>
                    </div>
                    <div className='textpage mt-5 '>
                        <div>
                            {/* TODO: this needs to change when others than myself get access to data entry */}
                            <div dangerouslySetInnerHTML={{__html: blog_text}}/>
                        </div>
                    </div>
                </div>
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
            page_number: this.state.pageNumber,
            chapter_number: this.state.chapterNumber,
            reference: {
                key: this.state.key,
                type: this.state.type.toUpperCase(),
                description: this.state.description
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/add_page_reference/',
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
            this.setState({
                editDone: false
            })
            this.props.toggleEditDone(this.state.page);
        }
        if (this.state.cancel === true) {
            this.setState({
                editDone: false
            })
            this.props.toggleEditDone();
        }


        return (
            <div className='add_reference'>
                <h5 className='mb-5'> Add page reference</h5>

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <table width="60%" className='mt-2'>
                            <tbody>
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
                            </tbody>
                        </table>

                        <table width="60%" className='mt-2'>
                            <tbody>
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
                            </tbody>
                        </table>

                        <table width="60%" className='mt-2'>
                            <tbody>
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
                            </tbody>
                        </table>

                    </div>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <input
                                    type="submit"
                                    className="btn btn-outline-success mybutton mt-5 ml-5 mb-5"
                                    value="Submit"
                                /></td>
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


export default Landing
