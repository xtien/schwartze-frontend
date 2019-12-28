import React, {Component} from 'react'
import './App.css'
import './css/bootstrap.css'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import AuthenticationService from './service/AuthenticationService';
import Util from './service/Util';

// https://medium.com/better-programming/building-basic-react-authentication-e20a574d5e71

class Person extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultCode: -1,
            data: {},
            showEdit: false,
            showLinkEdit: false,
            showTextEdit: false,
            text_id: '',
            person: {},
            textString: '',
        }

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

        let id;

        if (props.match.params.id != null) {
            id = props.match.params.id;
        }

        let postData = {
            requestCode: 0,
            id: id
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_person_details/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    person: response.data.person
                })
            )
    }

    toggleEditDone = (person) => {
        this.setState({
            showEdit: false,
            person: person
        })
    }

    toggleLinkEditDone = (person) => {
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
            link_id: id
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/delete_link/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
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

    togglelinkEditDone = (person) => {
        this.setState({
            showLinkEdit: false,
            person: person
        })
    }

    handleTextChange(event) {
        this.setState({text: event.target.value});
    }

    render() {

        const person = this.state.person;
        const edit_link = this.edit_link;
        const delete_link = this.delete_link;
        let linkTo = '';
        if (person != null) {
            linkTo = '/get_text/person/' + person.id;
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
                            <tr>
                                <td>
                                    <a href={link.link_url}>{link.link_name}</a>
                                </td>
                                <td width="20%">
                                    {
                                        AuthenticationService.isAdmin() === true ?
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
                        </table>
                    </div>
                );
            });
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
                                    {person.id} {person.first_name} {person.middle_name} {person.last_name}
                                </p>
                                <p>{person.comment}</p>
                                <p className='mt-5'><Link to={`/get_letters_from_person/${person.id}`}> Brieven
                                    van {person.first_name} </Link>
                                </p>
                                <p><Link to={`/get_letters_to_person/${person.id}`}> Brieven
                                    aan {person.first_name} </Link>
                                </p>
                                {
                                    AuthenticationService.isAdmin() === true ?
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
                                            <p>  {person.text.text_string.substr(0, 300)}</p>
                                            {person.text.text_string.length > 300 ?
                                                <p>
                                                    <Link to={linkTo} className='mt-5 mb-5'> Meer </Link>
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
                            first_name={this.state.person.first_name}
                            middle_name={this.state.person.middle_name}
                            last_name={this.state.person.last_name}
                            image_url={this.state.person.image_url}
                            image_caption={this.state.person.image_caption}
                            person={this.state.person}
                            toggleEditDone={this.toggleEditDone}
                        />
                    ) : null
                    }

                    {AuthenticationService.isAdmin() === true ?

                        <div className="mt-5">
                            {this.state.showLinkEdit ? (
                                    <EditLinkForm
                                        person_id={this.state.person.id}
                                        link_id={this.state.link_id}
                                        link_name={this.state.link_name}
                                        link_url={this.state.link_url}
                                        togglelinkEditDone={this.togglelinkEditDone}
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
                                                    className="btn btn-outline-success mybutton"
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
            first_name: this.props.first_name,
            middle_name: this.props.middle_name,
            last_name: this.props.last_name,
            comment: this.props.comment,
            image_url: this.props.image_url,
            image_caption: this.props.image_caption,
            links: this.props.links,
            redirect: false,
            person: {}
        };

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleMiddleNameChange = this.handleMiddleNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handlecommentChange = this.handlecommentChange.bind(this);
        this.handleLinksChange = this.handleLinksChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImageUrlChange = this.handleImageUrlChange.bind(this);
        this.handleImageCaptionChange = this.handleImageCaptionChange.bind(this);
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

    handleFirstNameChange(event) {
        this.setState({first_name: event.target.value});
    }

    handleMiddleNameChange(event) {
        this.setState({middle_name: event.target.value});
    }

    handleLastNameChange(event) {
        this.setState({last_name: event.target.value});
    }

    handleLinksChange(event) {
        this.setState({links: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            person: {
                id: this.state.id,
                first_name: this.state.first_name,
                middle_name: this.state.middle_name,
                last_name: this.state.last_name,
                comment: this.state.comment,
                image_url: this.state.image_url,
                image_caption: this.state.image_caption,
                links: this.state.links,
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/update_person_details/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
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

        return (
            <form onSubmit={this.handleSubmit}>
                <div><p>{this.state.person.first_name} {this.state.person.last_name}</p></div>
                <div className="form-group">
                    <label htmlFor="status">First name</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="first_name"
                        value={this.state.first_name}
                        onChange={this.handleFirstNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Middle name</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="middle_name"
                        value={this.state.middle_name}
                        onChange={this.handleMiddleNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Last name</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="last_name"
                        value={this.state.last_name}
                        onChange={this.handleLastNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Opmerkingen</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="comments"
                        value={this.state.comment}
                        onChange={this.handlecommentChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Image URL</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="image_url"
                        value={this.state.image_url}
                        onChange={this.handleImageUrlChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Image caption</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="image_caption"
                        value={this.state.image_caption}
                        onChange={this.handleImageCaptionChange}
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
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    person: response.data.person,
                    linkEditDone: true
                })
            );
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
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="link_name"
                        value={this.state.link_name}
                        onChange={this.handleNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Link url</label>
                    <textarea
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
