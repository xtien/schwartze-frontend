import React, {Component} from 'react'
import './App.css'
import './css/bootstrap.css'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";

class Person extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultCode: -1,
            data: {},
            showEdit: false,
            person: {}
        }

        this.edit = this.edit.bind(this);
        this.combine = this.combine.bind(this);
        this.delete = this.delete.bind(this);
        this.add_text = this.add_text.bind(this);
        this.add_link = this.add_link.bind(this);
        this.update_link = this.update_link.bind(this);

        var id;

        if (props.match.params.id != null) {
            id = props.match.params.id;
        }

        let postData = {
            requestCode: 0,
            id: id
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post('https://pengo.christine.nl:8443/get_person_details/',
            postData,
            axiosConfig
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

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post('https://pengo.christine.nl:8443/delete_person/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    deleted: true
                })
            )
    }

    add_text(event) {
        event.preventDefault();

        this.setState(
            {
                add_text: true
            }
        )

        let postData = {
            id: this.state.person.id
        }
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        axios.post('https://pengo.christine.nl:8443/add_person_text/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    person: response.data.person
                })
            )

    }

    update_link(event) {
        event.preventDefault();

        this.setState(
            {
                add_link: false
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

    render() {

        const person = this.state.person;

        if (this.state.combine === true) {
            return <Redirect to={'/combine_person/' + person.id}/>
        }

        if (this.state.deleted === true) {
            return <Redirect to={'/get_letters/'}/>
        }

        var links = []
        if (person.links != null) {
            links = person.links.map(function (link, i) {
                return (
                    <div key={i}><a href={link.link_url}>{link.link_name}</a></div>
                );
            });
        }

        return (
            <div>
                <div className='container'>
                    {this.state.showEdit ? null : (
                        <div className="letter text-black-50">
                            <div>
                                <p>
                                    {person.id} {person.first_name} {person.middle_name} {person.last_name}
                                </p>
                                <p>{person.comment}</p>
                                <p><Link to={'/get_letters_from_person/${person.id}'}> Brieven
                                    van {person.first_name} </Link>
                                </p>
                                <p><Link to={'/get_letters_to_person/${person.id}'}> Brieven
                                    aan {person.first_name} </Link>
                                </p>


                                <div>
                                    {this.state.person.text != null ?
                                        <div>
                                            <p>
                                                <Link to={'/get_person_text/${person.id'}>
                                                    Meer
                                                </Link>
                                            </p>
                                        </div> : null}
                                </div>

                            </div>

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
                                )}
                            </div>

                            <div id='linkcontainer'>
                                <div id='linkContainer'>
                                    <h3 className='mt-5'>Links</h3>
                                        {links}

                                </div>
                                <form onSubmit={this.add_link} className='mt-5'>
                                    <input
                                        type="submit"
                                        className="btn btn-outline-success mybutton"
                                        value="Link toevoegen"
                                    />
                                </form>

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
                            toggleEditDone={this.toggleEditDone}
                        />
                    ) : null
                    }

                    <div className="mt-5">
                        {this.state.showLinkEdit ? (
                            <EditLinkForm
                                person_id={this.state.person.id}
                                toggleLinkEditDone={this.togglelinkEditDone}
                            />
                        ) : null
                        }
                    </div>

                    <form onSubmit={this.combine}>
                        <input
                            type="submit"
                            className="btn btn-outline-success mybutton"
                            value="Combineren"
                        />

                    </form>
                    <form onSubmit={this.delete} className="mt-5">
                        <input
                            type="submit"
                            className="btn btn-outline-danger mybutton"
                            value="Verwijderen"
                        />

                    </form>
                    <form onSubmit={this.add_text} className="mt-5">
                        <input
                            type="submit"
                            className="btn btn-outline-success mybutton"
                            value="Add text"
                        />

                    </form>

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
            links: this.props.links,
            redirect: false,
            person: {}
        };

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleMiddleNameChange = this.handleMiddleNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleLinksChange = this.handleLinksChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCommentChange(event) {
        this.setState({comment: event.target.value});
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
                links: this.state.links,
            }
        };

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            }
        };

        axios.post('https://pengo.christine.nl:8443/update_person_details/',
            postData,
            axiosConfig
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
            this.state.editDone = false;
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
                    <label htmlFor="status">Text</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="comments"
                        value={this.state.comment}
                        onChange={this.handleCommentChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="header">Links</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="links"
                        value={this.state.links}
                        onChange={this.handleLinksChange}
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
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            person_id: this.state.person_id,
            link_id: this.state.link_id,
            link_name: this.state.link_name,
            link_url: this.state.link_url,
        };

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            }
        };

        axios.post('https://pengo.christine.nl:8443/edit_link/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    person: response.data.person,
                    linkEditDone: true
                })
            );
    }

    handleLinkSubmit(event) {
        event.preventDefault();

        let postData = {
            person_id: this.state.person_id,
            link_id: this.state.link_id,
            link_name: this.state.link_name,
            link_url: this.state.link_url,
        };

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            }
        };

        axios.post('https://pengo.christine.nl:8443/edit_link/',
            postData,
            axiosConfig
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

        if (this.state.linkEditDone === true) {
            this.state.linkEditDone = false;
            this.props.toggleLinkEditDone(this.state.person);
        }

        return (
            <form onSubmit={this.handleLinkSubmit}>
                <div className="form-group">
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
                <input
                    type="submit"
                    className="btn btn-outline-success mybutton"
                    value="Submit"
                />
            </form>
        );
    }
}

export default Person
