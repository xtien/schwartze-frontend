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

    edit(event) {

        this.setState({
            showEdit: true,
        });
    }

    render() {

        const person = this.state.person;

        return (
            <div className='container'>
                {this.state.showEdit ? null : (
                    <div className="letter text-black-50">
                        <div>
                            <p>
                                {person.first_name} {person.last_name}
                            </p>
                            <p>{person.comment}</p>
                            <p>{person.links}</p>
                            <p><Link to={'/get_letters_from_person/${person.id}'}> Letters
                                from {person.first_name} </Link>
                            </p>
                            <p><Link to={'/get_letters_to_person/${person.id}'}> Letters to {person.first_name} </Link>
                            </p>
                        </div>
                        <div>
                            {this.state.showEdit ?
                                <CommentForm personId={this.state.person.id} text={this.state.person.comment}/> : null}
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
                    </div>
                )}
                {this.state.showEdit ? (
                    <EditPersonForm
                        comment={this.state.person.comment}
                        links={this.state.person.links}
                        id={this.state.person.id}
                        first_name={this.state.person.first_name}
                        last_name={this.state.person.last_name}
                    />
                ) : null
                }
            </div>
        )
    }
}

class CommentForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            personId: this.props.personId,
            text: this.props.text,
            resultCode: 0,
            editDone: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({text: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            id: this.state.personId,
            comment: this.state.text
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post('https://pengo.christine.nl:8443/update_person_details/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    editDone: true
                })
            )

    }

    render() {

        if (this.state.editDone === true) {
            return <Redirect to={'/get_letters/'}/>
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    <textarea value={this.state.text} onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}

class EditPersonForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            first_name: this.props.first_name,
            last_name: this.props.last_name,
            comment: this.props.comment,
            links: this.props.links,
            redirect: false,
            person: {}
        };

        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleLinksChange = this.handleLinksChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCommentChange(event) {
        this.setState({comment: event.target.value});
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
            return <Redirect to={'/get_letters/'}/>
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <div><p>{this.state.person.first_name} {this.state.person.last_name}</p></div>
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

export default Person
