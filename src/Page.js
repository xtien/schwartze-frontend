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
import {Link} from "react-router-dom";
import strings from "./strings";
import Cookies from 'universal-cookie';
import language from './language'

class Page extends Component {

    constructor(props) {
        super(props)

        const lang = language()

        const params = window.location.href.split('/')
        const chapterNumber = params[4]
        const pageNumber = params[5]

        this.state = {
            text: '',
            page: {},
            chapterNumber: chapterNumber,
            pageNumber: pageNumber,
            refMap: {
                person: '/get_person_details/',
                location: '/get_location/',
                letter: '/get_letter_details/',
                subject: '/get_text/subject/'
            },
            language: lang,
            current_language: lang,
            showPictureUrlEdit: false
        }

        this.get_page = this.get_page.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.nextChapter = this.nextChapter.bind(this);
        this.previousChapter = this.previousChapter.bind(this);
        this.delete_link = this.delete_link.bind(this);
        this.add_reference = this.add_reference.bind(this);
        this.renderReference = this.renderReference.bind(this);
        this.switch = this.switch.bind(this);
        this.post = this.post.bind(this);
        this.edit_picture = this.edit_picture.bind(this);

        this.get_page(chapterNumber, pageNumber)
    }

    setPage = (page) => {
        this.setState({
            showLinkEdit: false,
            page: page
        })
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
                        text: response.data.text,
                        page: response.data.page,
                    })
                }
            )
            .catch(error => {
                console.log(error)
            });
    }

    next() {
        this.post('/get_next_page/', this.state.chapterNumber, this.state.pageNumber)
    }

    previous() {
        this.post('/get_previous_page/', this.state.chapterNumber, this.state.pageNumber)
    }

    nextChapter() {
        this.post('/get_next_chapter/', this.state.chapterNumber, this.state.pageNumber)
    }

    previousChapter() {
        this.post('/get_previous_chapter/', this.state.chapterNumber, this.state.pageNumber)
    }

    add_reference(event) {
        event.preventDefault();
        this.setState({
            showLinkEdit: true
        })
    }

    get_page(chapterNumber, pageNumber) {
        this.post('/get_page_page/', chapterNumber, pageNumber);
    }

    post(url) {

        const cookies = new Cookies();
        const p = cookies.get('pageNumber');
        const c = cookies.get('chapterNumber');
        let pageNr, chapterNr;
        if (p != null && p !== 'undefined' && c != null && c !== 'undefined') {
            pageNr = p;
            chapterNr = c;
        } else {
            pageNr = this.state.pageNumber;
            chapterNr = this.state.chapterNumber;
        }

        const
            postData = {
                chapter: chapterNr,
                page: pageNr,
                language: this.state.language
            };

        axios.post(process.env.REACT_APP_API_URL + url,
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.setState({
                        text: response.data.text,
                        page: response.data.page,
                        pageNumber: response.data.page.page_number,
                        chapterNumber: response.data.page.chapter_number,
                        chapterTitle: response.data.page.chapter_title,
                        current_language: this.state.language
                    });
                    const cookies = new Cookies();
                    cookies.set('pageNumber', response.data.page.page_number, {path: '/'});
                    cookies.set('chapterNumber', response.data.page.chapter_number, {path: '/'});

                }
            )
            .catch(error => {
                console.log(error)
            });
    }

    switch(event) {

        event.preventDefault();

        const postData = {
            chapter: this.state.chapterNumber,
            page: this.state.pageNumber,
            language: this.state.current_language
        };

        axios.post(process.env.REACT_APP_API_URL + '/switch_page_text/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.setState({
                        text: response.data.text,
                        current_language: response.data.language
                    });

                }
            )
            .catch(error => {
                console.log(error)
            });

    }

    toggleEditDoneParam = (page) => {
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

    togglePictureDone = () => {
        this.setState({
            showPictureUrlEdit: false,
        })
    }

    edit_picture() {
        this.setState({
            showPictureUrlEdit: true
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
                    <Link to={this.state.refMap.person + reference.key} className='linkStyle'>{reference.description}</Link>
                    {AuthenticationService.isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id)
                                }}> del
                        </button> : ''}
                </div>)
            case 'LOCATION':
                return (<div className='mb-2'>
                    <Link to={this.state.refMap.location + reference.key} className='linkStyle'>{reference.description}</Link>
                    {AuthenticationService.isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id)
                                }}> del
                        </button> : ''}
                </div>)
            case 'LETTER':
                return (<div className='mb-2'>
                    <Link to={this.state.refMap.letter + reference.key + '/0'} className='linkStyle'>{reference.description}</Link>
                    {AuthenticationService.isAdmin() === "true" ?
                        <button type="button" className='btn btn-link mb-1'
                                onClick={() => {
                                    delete_link(reference.id)
                                }}> del
                        </button> : ''}
                </div>)
            case 'SUBJECT':
                return (<div className='mb-2'>
                    <Link to={this.state.refMap.subject + reference.key} className='linkStyle'>{reference.description}</Link>
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
            default:
                return null
        }
    }

    render() {

        const otherLanguage = this.state.current_language === 'nl' ? 'en' : 'nl';
        const otherLanguageDisplay = otherLanguage.toLocaleUpperCase();

        const page = this.state.page;
        let references = [];
        const renderReference = this.renderReference;
        const add_reference = this.add_reference;
        const edit_picture = this.edit_picture;

        let picture_url = this.state.page.picture_url;
        const picture_caption = this.state.page.picture_caption;
        if (picture_url === 'undefined') {
            picture_url = null;
        }
        if (picture_url != null && !picture_url.startsWith('https://')) {
            picture_url = "https://" + picture_url;
        }

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
            <div className='container'>
                <table width='100%'>
                    <tbody>
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
                            <p className='page_header'>{strings.chapter} {this.state.chapterNumber} &nbsp; &nbsp; &nbsp; {strings.page} {this.state.pageNumber} </p>
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
                    </tbody>
                </table>

                <div className="float-container">
                    <div className="float-child-left">
                        <div className="row align-items-start">
                            <div id="sidebar-wrapper" >
                                <ul className="sidebar-nav">
                                    <li className="sidebar-brand"></li>
                                    <div id='linkContainer' className='ml-3'>
                                        {references}
                                    </div>
                                    <div className='ml-3 mt-5'>
                                        <Link to='/get_content/' className='linkStyle'>{strings.content}</Link>
                                    </div>
                                    <div className="row align-items-end mt-5">
                                        <div className='sidebar-picture'>
                                            <div><img src={picture_url} width="200" alt=""/></div>
                                            <div className='picture-caption'>{picture_caption}</div>
                                        </div>
                                        <div>
                                            {
                                                AuthenticationService.isAdmin() === "true" ?
                                                    <div>
                                                        <button type="button"
                                                                className='btn btn-link mt-5'
                                                                onClick={add_reference}>
                                                            Add reference
                                                        </button>
                                                        <button type="button"
                                                                className='btn btn-link mt-5'
                                                                onClick={edit_picture}>
                                                            edit picture
                                                        </button>
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="float-child-right">
                        <div>
                            {this.state.showPictureUrlEdit ? (

                                <EditPictureUrlEditForm
                                    page={this.state.page}
                                    setPage={this.setPage}
                                    togglePictureDone={this.togglePictureDone}
                                />

                            ) : null
                            }

                            {this.state.showLinkEdit ? (
                                    <EditReferenceForm
                                        pageNumber={this.state.pageNumber}
                                        chapterNumber={this.state.chapterNumber}
                                        key=''
                                        reference_description=''
                                        reference_type=''
                                        setPage={this.setPage}
                                        toggleEditDone={this.toggleEditDone}
                                        toggleEditDoneParam={this.toggleEditDoneParam}
                                    />
                                )
                                : <div>

                                    <div className='chapter_title'>
                                        {this.state.pageNumber === '1' ? this.state.chapterTitle : null}
                                    </div>


                                    <div className='page_text' dangerouslySetInnerHTML={{__html: this.state.text}}/>
                                </div>
                            }
                        </div>
                        <div>
                            <p className='page_text'>
                                <button type="button"
                                        className='btn btn-link'
                                        onClick={this.switch}>
                                    {otherLanguageDisplay}
                                </button>

                            </p>
                        </div>

                    </div>
                </div>


            </div>
        )
    }
}

class EditPictureUrlEditForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: this.props.page,
            picture_url: this.props.page.picture_url,
            picture_caption: this.props.page.picture_caption
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.handleCaptionChange = this.handleCaptionChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleUrlChange(event) {
        this.setState({picture_url: event.target.value});
    }

    handleCaptionChange(event) {
        this.setState({picture_caption: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        const p = this.state.page;
        p.picture_url = this.state.picture_url;
        p.picture_caption = this.state.picture_caption;

        let postData = {
            page: p
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/update_page/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.props.setPage(response.data.page)
                    this.props.togglePictureDone()
                }
            )
    }

    handleCancel(event) {
        event.preventDefault();
        this.props.togglePictureDone()
    }

    render() {

        return (
            <div className='page_text'>
                <h4 className='mb-5'> Edit picture url</h4>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <table width="100%" className='mt-2'>
                            <tbody>
                            <tr>
                                <td>url: <input
                                    type="text"
                                    className="form-control text"
                                    id="picture"
                                    placeholder="url"
                                    value={this.state.picture_url}
                                    onChange={this.handleUrlChange}
                                /></td>
                            </tr>
                            <tr>
                                <td>caption: <input
                                    type="text"
                                    className="form-control text"
                                    id="picture"
                                    placeholder="caption"
                                    value={this.state.picture_caption}
                                    onChange={this.handleCaptionChange}
                                /></td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="button"
                                        onClick={this.handleSubmit}
                                        className="btn btn-outline-success mybutton mt-3 mr-3"
                                        value="Submit"
                                    />
                                    <input
                                        type="button"
                                        onClick={this.handleCancel}
                                        className="btn btn-outline-danger mybutton mt-3"
                                        value="Cancel"
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </form>
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

        if (this.state.editDone === true) {
            this.setState({
                editDone: false
            })
            this.props.toggleEditDoneParam(this.state.page);
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
                                    className="form-control "
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
                                    className="form-control "
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
                                    className="form-control "
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

export default Page
