/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import axios from "axios";
import AuthenticationService from "./service/AuthenticationService";
import strings from './strings.js'
import language from "./language";

class References extends Component {

    constructor() {

        super()

        this.state = {
            references: {},
            linkEditDone: false
        }
        language()

        this.edit_link = this.edit_link.bind(this);
        this.delete_link = this.delete_link.bind(this);
        this.add_link = this.add_link.bind(this);

        let postData = {
            type: 'site'
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_references/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    references: response.data.references
                })
            )
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

    delete_link(id) {

        let postData = {
            link_id: id,
            type: this.state.references.type
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/remove_reference_link/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    references: response.data.references
                })
            )
    }

    edit_link(id) {

        const link = this.state.references.links.find(link => {
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

    setReferences = (references) => {
        this.setState({
            showLinkEdit: false,
            references: references
        })
    }

    render() {

        const reftext = strings.references;
        const references = this.state.references;
        const edit_link = this.edit_link;
        const delete_link = this.delete_link;

        let links = []
        if (references.links != null) {
            links = references.links.map(function (link, i) {
                return (
                    <div key={i}>
                        <table width="100%">
                            <tbody>
                            <tr>
                                <td>
                                    <div className='mt-3'>
                                        <a href={link.link_url} target="blank"
                                           className='linkStyle'>{link.link_name}</a>
                                    </div>
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
                                            &nbsp;&nbsp;
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
                            </tbody>
                        </table>
                    </div>
                );
            });
        }

        return (

            <div className='container'>

                <div className='mt-5 topics'>
                    <h3>{reftext}</h3>
                    {this.state.showLinkEdit ? null :
                        <div id='linkContainer'>
                            {links}
                        </div>
                    }
                    {this.state.showLinkEdit ? (
                            <EditLinkForm
                                type={this.state.references.type}
                                link_id={this.state.link_id}
                                link_name={this.state.link_name}
                                link_url={this.state.link_url}
                                setReferences={this.setReferences}
                            />
                        )
                        :
                        <div>
                            {
                                AuthenticationService.isAdmin() === "true" ?

                                    <div>

                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <form onSubmit={this.add_link} className='mt-5 ml-5 mb-5'>
                                                        <input
                                                            type="submit"
                                                            className="btn btn-outline-success mybutton"
                                                            value="Link toevoegen"
                                                        />

                                                    </form>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    : null}
                        </div>
                    }
                </div>
            </div>
        )
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
            type: this.props.type,
        };

        this.handleLinkSubmit = this.handleLinkSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
    }

    handleLinkSubmit(event) {
        event.preventDefault();

        let postData = {
            link_id: this.state.link_id,
            link_name: this.state.link_name,
            link_url: this.state.link_url,
            type: this.state.type
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/edit_reference_link/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.props.setReferences(response.data.references)
                }
            )
            .catch(error => {
                console.log(error)
            });
    }

    handleNameChange(event) {
        this.setState({link_name: event.target.value});
    }

    handleUrlChange(event) {
        this.setState({link_url: event.target.value});
    }

    render() {

        return (
            <form onSubmit={this.handleLinkSubmit}>
                <div className="form-group mt-3">
                    <label htmlFor="status">Link naam</label>
                    <input
                        type="text"
                        className="form-control "
                        id="link_name"
                        value={this.state.link_name}
                        onChange={this.handleNameChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="status">Link url</label>
                    <input
                        type="text"
                        className="form-control"
                        id="link_url"
                        value={this.state.link_url}
                        onChange={this.handleUrlChange}
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-outline-success mybutton mt-5"
                    value="Submit"
                />
            </form>
        );
    }
}

export default References
