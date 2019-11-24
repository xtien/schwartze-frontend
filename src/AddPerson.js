import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import {Redirect} from "react-router-dom";

class AddPerson extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            first_name: this.props.first_name,
            middle_name: this.props.middle_name,
            last_name: this.props.last_name,
            comment: this.props.comment,
            links: this.props.links,
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

        axios.post('https://pengo.christine.nl:8443/add_person/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    editDone: true,
                    id: response.data.person.id
                })
            );
    }

    render() {

        if (this.state.editDone === true) {
            return (
                <Redirect to={"/get_person_details/" + this.state.id}/>
            )
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

export default AddPerson
