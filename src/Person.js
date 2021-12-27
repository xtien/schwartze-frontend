/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import './App.css'
import './css/bootstrap.css'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import AuthenticationService from './service/AuthenticationService';
import Util from './service/Util';
import strings from './strings.js'
import language from "./language";

// https://medium.com/better-programming/building-basic-react-authentication-e20a574d5e71

class Person extends Component {

    constructor(props) {
        super(props)

        this.state = {
            data: {},
            showEdit: false,
            showLinkEdit: false,
            showTextEdit: false,
            text_id: '',
            person: {},
            textString: '',
        }
        language()

        if (this.state.person != null && this.state.person.text != null) {
            this.setState({
                textString: this.state.person.text.textString
            })
        }

        this.edit = this.edit.bind(this);
        this.combine = this.combine.bind(this);
        this.delete = this.delete.bind(this);
        this.add_link = this.add_link.bind(this);
        this.edit_link = this.edit_link.bind(this);
        this.delete_link = this.delete_link.bind(this);
        this.post = this.post.bind(this);

        let id;

        if (props.match.params.id != null) {
            id = props.match.params.id;
        }

        this.post(id)
    }

    toggleEditDone = (person) => {
        this.setState({
            showEdit: false,
        })
        this.post(person.id)
    }

    post(id) {
        let postData = {
            id: id
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_person_details/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    person: response.data.person
                })
            )

    }

    toggleEditDone = () => {
        this.setState({
            showEdit: false,
        })
    }

    setPerson = (person) => {
        this.setState({
            showLinkEdit: false,
            person: person
        })
    }

    edit(event) {

        this.setState({
            showEdit: true,
        });
    }

    link(event) {

        this.setState({
            showLinkEdit: true,
        });
    }

    combine(event) {
        event.preventDefault();

        this.setState(
            {
                combine: true
            }
        )
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
            id: this.state.person.id
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/delete_person/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    deleted: true
                })
            )
    }

    delete_link(id) {

        let postData = {
            link_id: id,
            person_id: this.state.person.id
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/delete_link/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    person: response.data.person
                })
            )
    }

    edit_link(id) {

        const link = this.state.person.links.find(link => {
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

    handleTextChange(event) {
        this.setState({text: event.target.value});
    }

    render() {

        const brieven_aan = strings.brieven_aan;
        const brieven_van = strings.brieven_van;
        const meer = strings.meer;

        if (this.state.person == null) {
            return "Person is null";
        }

        const person = this.state.person;
        const edit_link = this.edit_link;
        const delete_link = this.delete_link;
        let linkTo = '';
        if (person != null) {
            linkTo = '/get_text/person/' + person.id;
        }

        let brievenVan = '';
        if (person.brieven_van === true) {
            brievenVan = <Link
                to={`/get_letters_from_person/${person.id}`}> {brieven_van} {person.nick_name} </Link>
        }
        let brievenAan = '';
        if (person.brieven_aan === true) {
            brievenAan = <Link to={`/get_letters_to_person/${person.id}`}> {brieven_aan} {person.nick_name} </Link>
        }

        if (this.state.combine === true) {
            return <Redirect to={'/combine_person/' + person.id}/>
        }

        if (this.state.deleted === true) {
            return <Redirect to={'/get_people/'}/>
        }

        let links = [];
        if (person != null && person.links != null) {
            links = person.links.map(function (link, i) {
                return (
                    <div key={i}>
                        <table width="100%">
                            <tbody>
                            <tr>
                                <td>
                                    <a href={link.link_url} target="_blank"
                                       rel="noopener noreferrer">{link.link_name}</a>
                                </td>
                                <td width="20%">
                                    {
                                        AuthenticationService.isAdmin() === "true" ?
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
                                            : null
                                    }
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                );
            });
        }

        let fullname = '';
        if (person.full_name != null && person.full_name.length > 0) {
            fullname = '(' + person.full_name + ')'
        }

        return (
            <div>
                <div className='container letter'>
                    {this.state.showEdit ? null : (
                        <div>
                            <div>
                                <div className="person_image">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <img className="person_image" alt="" src={person.image_url}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><p className="person_caption">{person.image_caption}</p>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p>
                                    {person.id} {person.nick_name} {fullname} {person.tussenvoegsel} {person.last_name}
                                </p>
                                <p>{strings.geboren}: {person.date_of_birth} {person.place_of_birth === null ? null : ' te'} {person.place_of_birth} </p>
                                <p>{strings.overleden}: {person.date_of_death} {person.place_of_death === null ? null : 'te'} {person.place_of_death}</p>
                                <p>{person.comment}</p>
                                <p className='mt-5'>
                                    {brievenVan}
                                </p>
                                <p>{brievenAan}
                                </p>
                                {
                                    AuthenticationService.isAdmin() === "true" ?
                                        <div>
                                            {this.state.showEdit ? null : (
                                                <div>
                                                    <div>
                                                        <button
                                                            className="btn btn-outline-success mybutton"
                                                            onClick={this.edit}
                                                            value={this.state.id}
                                                        >
                                                            edit
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                            }
                                        </div> : null
                                }

                                <div className='textpage mt-5 ml-5'>
                                    {person.text != null && Util.isNotEmpty(person.text.text_string) ?
                                        <div>
                                            {/* TODO: this needs to change when others than myself get access to data entry */}
                                            <p>
                                                <div
                                                    dangerouslySetInnerHTML={{__html: person.text.text_string.substr(0, 300)}}/>
                                            </p>
                                            {person.text.text_string.length > 300 ?
                                                <p>
                                                    <Link to={linkTo} className='mt-5 mb-5'> {meer} </Link>
                                                </p>
                                                : null}
                                        </div> : null}
                                </div>

                            </div>

                            <div id='linkContainer'>
                                <h3 className='mt-5'>Links</h3>
                                {links}
                            </div>


                        </div>
                    )}
                    {this.state.showEdit ? (
                        <EditPersonForm
                            comment={this.state.person.comment}
                            links={this.state.person.links}
                            id={this.state.person.id}
                            nick_name={this.state.person.nick_name}
                            full_name={this.state.person.full_name}
                            tussenvoegsel={this.state.person.tussenvoegsel}
                            last_name={this.state.person.last_name}
                            date_of_birth={this.state.person.date_of_birth}
                            date_of_death={this.state.person.date_of_death}
                            place_of_birth={this.state.person.place_of_birth}
                            place_of_death={this.state.person.place_of_death}
                            image_url={this.state.person.image_url}
                            image_caption={this.state.person.image_caption}
                            person={this.state.person}
                            toggleEditDone={this.toggleEditDone}
                        />
                    ) : null
                    }

                    {AuthenticationService.isAdmin() === "true" ?

                        <div className="mt-5">
                            {this.state.showLinkEdit ? (
                                    <EditLinkForm
                                        person_id={this.state.person.id}
                                        link_id={this.state.link_id}
                                        link_name={this.state.link_name}
                                        link_url={this.state.link_url}
                                        setPerson={this.setPerson}
                                    />
                                )
                                :
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div>
                                                <form onSubmit={this.add_link} className='ml-5 mb-5'>
                                                    <input
                                                        type="submit"
                                                        className="btn btn-outline-success mybutton"
                                                        value="Link toevoegen"
                                                    />
                                                </form>

                                            </div>
                                        </td>
                                        <td>
                                            <form onSubmit={this.combine} className="ml-5 mb-5">
                                                <input
                                                    type="submit"
                                                    className="btn btn-outline-success mybutton ml-5"
                                                    value="Combineren"
                                                />
                                            </form>
                                        </td>
                                        <td>
                                            <form onSubmit={this.delete} className="ml-5 mb-5">
                                                <input
                                                    type="submit"
                                                    className="btn btn-outline-danger mybutton"
                                                    value="Verwijderen"
                                                />

                                            </form>
                                        </td>
                                        <td>
                                            <div className="ml-5 mb-5">
                                                <Link to={{
                                                    pathname: '/edit_text/',
                                                    person_id: person.id,
                                                }}>
                                                    Edit text
                                                </Link>
                                            </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            }
                        </div>
                        : null
                    }
                </div>
            </div>

        )
    }
}


class EditPersonForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            nick_name: this.props.nick_name,
            full_name: this.props.full_name,
            tussenvoegsel: this.props.tussenvoegsel,
            last_name: this.props.last_name,
            date_of_birth: this.props.date_of_birth,
            place_of_birth: this.props.place_of_birth,
            date_of_death: this.props.date_of_death,
            place_of_death: this.props.place_of_death,
            comment: this.props.comment,
            image_url: this.props.image_url,
            image_caption: this.props.image_caption,
            links: this.props.links,
            redirect: false,
            person: {}
        };

        this.handleNickNameChange = this.handleNickNameChange.bind(this);
        this.handleFullNameChange = this.handleFullNameChange.bind(this);
        this.handleTussenvoegselChange = this.handleTussenvoegselChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handlecommentChange = this.handlecommentChange.bind(this);
        this.handleLinksChange = this.handleLinksChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImageUrlChange = this.handleImageUrlChange.bind(this);
        this.handleImageCaptionChange = this.handleImageCaptionChange.bind(this);
        this.handleDoBChange = this.handleDoBChange.bind(this);
        this.handleDoDChange = this.handleDoDChange.bind(this);
        this.handlePoBChange = this.handlePoBChange.bind(this);
        this.handlePoDChange = this.handlePoDChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handlecommentChange(event) {
        this.setState({comment: event.target.value});
    }

    handleImageUrlChange(event) {
        this.setState({image_url: event.target.value});
    }

    handleImageCaptionChange(event) {
        this.setState({image_caption: event.target.value});
    }

    handleNickNameChange(event) {
        this.setState({nick_name: event.target.value});
    }

    handleFullNameChange(event) {
        this.setState({full_name: event.target.value});
    }

    handleTussenvoegselChange(event) {
        this.setState({tussenvoegsel: event.target.value});
    }

    handleLastNameChange(event) {
        this.setState({last_name: event.target.value});
    }

    handleLinksChange(event) {
        this.setState({links: event.target.value});
    }

    handleDoBChange(event) {
        this.setState({date_of_birth: event.target.value});
    }

    handleDoDChange(event) {
        this.setState({date_of_death: event.target.value});
    }

    handlePoBChange(event) {
        this.setState({place_of_birth: event.target.value});
    }

    handlePoDChange(event) {
        this.setState({place_of_death: event.target.value});
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
            person: {
                id: this.state.id,
                nick_name: this.state.nick_name,
                full_name: this.state.full_name,
                tussenvoegsel: this.state.tussenvoegsel,
                last_name: this.state.last_name,
                comment: this.state.comment,
                image_url: this.state.image_url,
                image_caption: this.state.image_caption,
                links: this.state.links,
                date_of_birth: this.state.date_of_birth,
                date_of_death: this.state.date_of_death,
                place_of_birth: this.state.place_of_birth,
                place_of_death: this.state.place_of_death
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/update_person_details/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    person: response.data.person,
                    editDone: true
                })
            );
    }

    render() {

        if (this.state.editDone === true) {
            this.setState({
                editDone: false
            })
            this.props.toggleEditDone(this.state.person);
        }
        if (this.state.cancel === true) {
            this.setState({
                editDone: false
            })
            this.props.toggleEditDone();
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <p>{this.state.person.nick_name} {this.state.person.tussenvoegsel} {this.state.person.last_name}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Nick name</label>
                        <input
                            type="text"
                            className="form-control textarea"
                            id="nick_name"
                            value={this.state.nick_name}
                            onChange={this.handleNickNameChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Full name</label>
                        <input
                            type="text"
                            className="form-control textarea"
                            id="full_name"
                            value={this.state.full_name}
                            onChange={this.handleFullNameChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Tussenvoegsel</label>
                        <input
                            type="text"
                            className="form-control textarea"
                            id="tussenvoegsel"
                            value={this.state.tussenvoegsel}
                            onChange={this.handleTussenvoegselChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Last name</label>
                        <input
                            type="text"
                            className="form-control textarea"
                            id="last_name"
                            value={this.state.last_name}
                            onChange={this.handleLastNameChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Geboren</label>
                        <input
                            type="text"
                            className="form-control textarea"
                            id="last_name"
                            value={this.state.date_of_birth}
                            onChange={this.handleDoBChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Plaats</label>
                        <input
                            type="text"
                            className="form-control textarea"
                            id="last_name"
                            value={this.state.place_of_birth}
                            onChange={this.handlePoBChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Overleden</label>
                        <input
                            type="text"
                            className="form-control textarea"
                            id="last_name"
                            value={this.state.date_of_death}
                            onChange={this.handleDoDChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Plaats</label>
                        <input
                            type="text"
                            className="form-control textarea"
                            id="last_name"
                            value={this.state.place_of_death}
                            onChange={this.handlePoDChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Opmerkingen</label>
                        <input
                            type="text"
                            className="form-control textarea"
                            id="comments"
                            value={this.state.comment}
                            onChange={this.handlecommentChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Image URL</label>
                        <input
                            type="text"
                            className="form-control textarea"
                            id="image_url"
                            value={this.state.image_url}
                            onChange={this.handleImageUrlChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Image caption</label>
                        <input
                            type="text"
                            className="form-control textarea"
                            id="image_caption"
                            value={this.state.image_caption}
                            onChange={this.handleImageCaptionChange}
                        />
                    </div>
                    <table>
                        <tbody>
                        <tr>
                            <td></td>
                            <input
                                type="submit"
                                className="btn btn-outline-success mybutton"
                                value="Submit"
                            />
                            <td>
                                <input
                                    type="button"
                                    onClick={this.handleCancel}
                                    className="btn btn-outline-danger mybutton"
                                    value="Cancel"
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
}

class EditLinkForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            person: {},
            person_id: this.props.person_id,
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
            person_id: this.state.person_id,
            link_id: this.state.link_id,
            link_name: this.state.link_name,
            link_url: this.state.link_url,
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/edit_link/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.props.setPerson(response.data.person)
                }
            )
    }

    handleNameChange(event) {
        this.setState({link_name: event.target.value});
    }

    handleUrlChange(event) {
        this.setState({link_url: event.target.value});
    }

    render() {

        const redirectTo = '/get_person/' + this.state.person_id;

        if (this.state.linkEditDone === true) {
            return <Redirect to={redirectTo}/>
        }

        return (
            <form onSubmit={this.handleLinkSubmit}>
                <div className="form-group mt-5">
                    <label htmlFor="status">Link naam</label>
                    <input
                        type="text"
                        className="form-control textarea"
                        id="link_name"
                        value={this.state.link_name}
                        onChange={this.handleNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Link url</label>
                    <input
                        type="text"
                        className="form-control textarea"
                        id="link_url"
                        value={this.state.link_url}
                        onChange={this.handleUrlChange}
                    />
                </div>
                <table className='mt-5'>
                    <tbody>
                    <tr>
                        <td>
                            <input
                                type="submit"
                                className="btn btn-outline-success mybutton"
                                value="Submit"
                            />
                        </td>
                        <td>
                            <button
                                type="button"
                                className="btn btn-outline-danger mybutton ml-5"
                                onClick={() => {
                                    this.props.history.push(redirectTo)
                                }}>
                                Cancel
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        );
    }
}

export default Person
