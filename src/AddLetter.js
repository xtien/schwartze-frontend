import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import {Redirect} from "react-router-dom";
import AuthenticationService from "./service/AuthenticationService";

class AddLetter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sender: '',
            sender_location: '',
            recipient: '',
            recipient_location: '',
            date: '',
            letter: {}
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
                sender: this.state.sender,
                sender_location: this.state.sender_location,
                recipient: this.state.recipient,
                recipient_location: this.state.recipient_location,
                date: this.state.date,
            }
        };

        axios.post(process.env.REACT_APP_API_URL + process.env.REACT_APP_API_URL + '/admin/add_letter/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    editDone: true,
                    number: response.data.letter.number
                })
            );
    }

    render() {

        if (this.state.editDone === true) {
            return (
                <Redirect to={"/get_letter_details/" + this.state.number + '/0'}/>
            )
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="status">Afzender</label>
                    <input
                        type="text"
                        className="form-control textarea"
                        id="first_name"
                        value={this.state.sender}
                        onChange={this.handleFirstNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Locatie afzender</label>
                    <input
                        type="text"
                        className="form-control textarea"
                        id="middle_name"
                        value={this.state.sender_location}
                        onChange={this.handleMiddleNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Ontvanger</label>
                    <input
                        type="text"
                        className="form-control textarea"
                        id="last_name"
                        value={this.state.recipient}
                        onChange={this.handleLastNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Locatie ontvanger</label>
                    <input
                        type="text"
                        className="form-control textarea"
                        id="comments"
                        value={this.state.recipient_location}
                        onChange={this.handleCommentChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="header">Datum</label>
                    <input
                        type="text"
                        className="form-control textarea"
                        id="links"
                        value={this.state.date}
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

export default AddLetter
