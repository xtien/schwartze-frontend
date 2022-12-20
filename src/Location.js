/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import axios from "axios";
import {Link, Navigate} from "react-router-dom";
import './css/bootstrap.css'
import AuthenticationService from "./service/AuthenticationService";
import Util from './service/Util';
import language from "./language";
import strings from "./strings";

class Location extends Component {

    constructor(props) {
        super(props)

        const params = window.location.href.split('/')
        const number = params[4]

        this.state = {
            resultCode: -1,
            data: {},
            locationText: '',
            location: {},
            showLinkEdit: false,
            showNameEdit: false,
            link_id: '',
            link_name: '',
            link_url: '',
        }

        language()

        this.add_link = this.add_link.bind(this);
        this.edit_link = this.edit_link.bind(this);
        this.edit_name = this.edit_name.bind(this);
        this.delete_link = this.delete_link.bind(this);
        this.combine = this.combine.bind(this);
        this.delete = this.delete.bind(this);

        let id;

        if (number != null) {
            id = number;
        }

        let postData = {
            id: id
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_location/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    location: response.data.location
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    setLocation = (location) => {
        this.setState({
            showLinkEdit: false,
            location: location
        })
    }

    setLocationName = (location) => {
        this.setState({
            showNameEdit: false,
            location: location
        })
    }

    setLocationComment = (comment) => {
        this.setState({
            showNameEdit: false,
            comment: comment
        })
    }

    delete(event) {
        event.preventDefault();

        this.setState(
            {
                delete: true
            }
        )

        let postData = {
            requestCode: 0,
            id: this.state.location.id
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/delete_location/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    deleted: true
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    delete_link(id) {

        let postData = {
            link_id: id,
            location_id: this.state.location.id
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/delete_link/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    location: response.data.location
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    add_link(event) {
        event.preventDefault();

        this.setState(
            {
                showLinkEdit: true,
                link_name: '',
                link_url: '',
                link_id: ''
            }
        )
    }

    edit_link(id) {

        const link = this.state.location.links.find(link => {
            return link.id === id
        });

        this.setState(
            {
                showLinkEdit: true,
                link_name: link.link_name,
                link_url: link.link_url,
                link_id: link.id
            }
        )
    }

    edit_name(event) {
        event.preventDefault();

        this.setState(
            {
                showNameEdit: true
            }
        )
    }

    combine(event) {
        event.preventDefault();

        this.setState(
            {
                combine: true
            }
        )
    }

    render() {

        const location = this.state.location;
        const edit_link = this.edit_link;
        const delete_link = this.delete_link;
        let linkTo = '';
        if (location != null) {
            linkTo = '/get_text/location/' + location.id;
        }

        if (this.state.combine === true) {
            return <Navigate to={'/combine_location/' + location.id}/>
        }

        if (this.state.deleted === true) {
            return <Navigate to={'/get_locations/'}/>
        }

        let links = []
        if (location.links != null) {
            links = location.links.map(function (link, i) {
                return (
                    <div key={i}>
                        <table width="100%">
                            <tr>
                                <td>
                                    <a href={link.link_url} target="_blank"
                                       rel="noopener noreferrer">{link.link_name}</a>
                                </td>
                                <td width="20%">
                                    {AuthenticationService.isAdmin() === "true" ?
                                        <div>
                                            <button
                                                className="btn btn-outline-success mybutton ml-2 mt-2"
                                                onClick={edit_link.bind(this, link.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-outline-danger mybutton ml-2 mt-2"
                                                onClick={delete_link.bind(this, link.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        : null}
                                </td>
                            </tr>
                        </table>
                    </div>
                );
            });
        }

        return (

            <div>
                <div className='container letter'>
                    <h3>{location.id} {location.location_name}</h3>
                    <p className='mt-5'><Link
                        to={`/get_letters_for_location/${location.id}`}>{strings.letters} {strings.uit} {location.location_name}</Link>
                    </p>
                    <p className='mt-5'>{location.comment}</p>

                    <div className='textpage mt-5 ml-5'>
                        {location.text != null && Util.isNotEmpty(location.text.text_string) ?
                            <div>
                                {/* TODO: this needs to change when others than myself get access to data entry */}
                                <p>
                                    <div
                                        dangerouslySetInnerHTML={{__html: location.text.text_string.substr(0, 300)}}/>
                                </p>
                                {location.text.text_string.length > 300 ?
                                    <p>
                                        <Link to={linkTo} className='mt-5 mb-5'> {strings.meer} </Link>
                                    </p>
                                    : null}
                            </div> : null}
                    </div>
                </div>
                <div>
                    <div id='linkContainer'>
                        {links}
                    </div>

                    {AuthenticationService.isAdmin() === "true" ?

                        <div className="mt-5">

                            {this.state.showNameEdit ? (

                                <EditNameForm
                                    location_id={this.state.location.id}
                                    location_name={this.state.location.name}
                                    location_comment={this.state.location.comment}
                                    setLocationName={this.setLocationName}
                                    setLocationComment={this.setLocationComment}
                                />
                            ) : null}

                            {this.state.showLinkEdit ? (
                                    <EditLinkForm
                                        location_id={this.state.location.id}
                                        link_id={this.state.link_id}
                                        link_name={this.state.link_name}
                                        link_url={this.state.link_url}
                                        setLocation={this.setLocation}
                                    />
                                )
                                :

                                <div>
                                    <div className='mb-5 mt-5 ml-5'>
                                        <Link to={"/edit_text/location/" + location.id}>
                                            Edit tekst
                                        </Link>
                                    </div>

                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <form onSubmit={this.edit_name} className='mt-5 ml-5 mb-5'>
                                                    <input
                                                        type="submit"
                                                        className="btn btn-outline-success mybutton"
                                                        value="Edit"
                                                    />

                                                </form>
                                            </td>
                                            <td>
                                                <form onSubmit={this.add_link} className='mt-5 ml-5 mb-5'>
                                                    <input
                                                        type="submit"
                                                        className="btn btn-outline-success mybutton"
                                                        value="Link toevoegen"
                                                    />

                                                </form>
                                            </td>
                                            <td>
                                                <form onSubmit={this.combine} className="mt-5 ml-5 mb-5">
                                                    <input
                                                        type="submit"
                                                        className="btn btn-outline-success mybutton"
                                                        value="Combineren"
                                                    />
                                                </form>
                                            </td>
                                            <td>
                                                <form onSubmit={this.delete} className="mt-5 ml-5 mb-5">
                                                    <input
                                                        type="submit"
                                                        className="btn btn-outline-danger mybutton"
                                                        value="Verwijderen"
                                                    />
                                                </form>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                        : null}
                </div>
            </div>
        )
    }
}

class EditNameForm
    extends React
        .Component {

    constructor(props) {
        super(props);

        this.state = {
            location: {},
            location_id: this.props.location_id,
            location_name: this.props.location_name,
            location_comment: this.props.location_comment
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
    }

    render() {

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="status">{strings.location_name}</label>
                    <input
                        type="text"
                        className="form-control mb-3"
                        id="location_name"
                        value={this.state.location_name}
                        onChange={this.handleNameChange}
                    />
                    <label htmlFor="status">Comment</label>
                    <input
                        type="text"
                        className="form-control extratextarea"
                        id="location_description"
                        value={this.state.location_comment}
                        onChange={this.handleCommentChange}
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-outline-success mybutton mt-3"
                    value="Submit"
                />
            </form>
        );
    }

    handleNameChange(event) {
        this.setState({location_name: event.target.value});
    }

    handleCommentChange(event) {
        this.setState({location_comment: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            id: this.state.location_id,
            name: this.state.location_name,
            comment: this.state.location_comment
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/update_location/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.props.setLocationName(response.data.location)
                }
            )
            .catch(error => {
                console.log(error)
            });
    }

}

class EditLinkForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            location: {},
            location_id: this.props.location_id,
            link_id: this.props.link_id,
            link_name: this.props.link_name,
            link_url: this.props.link_url,
        };

        this.handleLinkSubmit = this.handleLinkSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
    }

    handleLinkSubmit(event) {
        event.preventDefault();

        let postData = {
            location_id: this.state.location_id,
            link_id: this.state.link_id,
            link_name: this.state.link_name,
            link_url: this.state.link_url,
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/edit_link/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.props.setLocation(response.data.location)
                }
            );
    }

    handleNameChange(event) {
        this.setState({link_name: event.target.value});
    }

    handleUrlChange(event) {
        this.setState({link_url: event.target.value});
    }

    render() {

        const redirectTo = '/get_location_details/' + this.state.location_id;

        if (this.state.linkEditDone === true) {
            return <Navigate to={redirectTo}/>
        }

        return (
            <form onSubmit={this.handleLinkSubmit}>
                <div className="form-group">
                    <label htmlFor="status">Link naam</label>
                    <input
                        type="text"
                        className="form-control "
                        id="link_name"
                        value={this.state.link_name}
                        onChange={this.handleNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Link url</label>
                    <input
                        type="text"
                        className="form-control "
                        id="link_url"
                        value={this.state.link_url}
                        onChange={this.handleUrlChange}
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-outline-success mybutton"
                    value="Submit"
                />
            </form>
        );
    }
}

export default Location
