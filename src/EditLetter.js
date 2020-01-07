import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import AuthenticationService from './service/AuthenticationService';
import {Redirect} from "react-router";

class EditLetter extends Component {

    constructor(props) {
        super(props)

        this.state = {
            letter: {},
            editDone: false,
            sender: {},
            recipient: {},
            senders: [[]],
            recipients: [{}]
        }

        this.handleSenderFirstname = this.handleSenderFirstname.bind(this);
        this.handleSenderMiddlename = this.handleSenderMiddlename.bind(this);
        this.handleSenderLastname = this.handleSenderLastname.bind(this);
        this.handleSenderId = this.handleSenderId.bind(this);
        this.handleRecipientId = this.handleRecipientId.bind(this);
        this.handleRecipientFirstname = this.handleRecipientFirstname.bind(this);
        this.handleRecipientMiddlename = this.handleRecipientMiddlename.bind(this);
        this.handleRecipientLastname = this.handleRecipientLastname.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        let postData = {
            number: props.match.params.number
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_letter_details/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    letter: response.data.letter,
                    senders: response.data.letter.senders,
                    recipients: response.data.letter.recipients,
                    sender: response.data.letter.senders[0],
                    recipient: response.data.letter.recipients[0]
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    handleSenderId(event) {
        const value = event.target.value;
        this.setState(prevState => ({
            sender: {
                ...prevState.sender,
                id: value
            }
        }))
    }

    handleSenderFirstname(event) {
        const value = event.target.value;
        this.setState(prevState => ({
            sender: {
                ...prevState.sender,
                first_name: value
            }
        }))
    }

    handleSenderMiddlename(event) {
        const value = event.target.value;
        this.setState(prevState => ({
            sender: {
                ...prevState.sender,
                middle_name: value
            }
        }))
    }

    handleSenderLastname(event) {
        const value = event.target.value;
        this.setState(prevState => ({
            sender: {
                ...prevState.sender,
                last_name: value
            }
        }))
    }

    handleRecipientId(event) {
        const value = event.target.value;
        this.setState({
            recipient: value
        })
    }

    handleRecipientFirstname(event) {
        const value = event.target.value;
        this.setState({
            recipient: value
        })
    }

    handleRecipientMiddlename(event) {
        const value = event.target.value;
        this.setState({
            recipient: value
        })
    }

    handleRecipientLastname(event) {
        const value = event.target.value;
        this.setState({
            recipient: value
        })
    }

    handleSubmit(event) {

        let updated_letter = this.state.letter;
        updated_letter.senders = [this.state.sender];
        updated_letter.recipients = [this.state.recipient];

        let postData = {
            letter: updated_letter
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/update_letter/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    editDone: true
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    render() {

        if (this.state.editDone === true) {
            return <Redirect to={'/get_letter_details/1'}></Redirect>
        }

        return (
            <div className='w-50'>
                <p>Brief nummer {this.state.letter.number}</p>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="status">Afzender</label>
                        <textarea
                            type="text"
                            className="form-control textarea mt-1"
                            id="sender.id"
                            value={this.state.sender.id}
                            onChange={this.handleSenderId}
                        />
                        <textarea
                            type="text"
                            className="form-control textarea mt-1"
                            id="senderfirst_name"
                            value={this.state.sender.first_name}
                            onChange={this.handleSenderFirstname}
                        />
                        <textarea
                            type="text"
                            className="form-control textarea mt-1"
                            id="sendermiddle_name"
                            value={this.state.sender.middle_name}
                            onChange={this.handleSenderMiddlename}
                        />
                        <textarea
                            type="text"
                            className="form-control textarea mt-1"
                            id="senderlast_name"
                            value={this.state.sender.last_name}
                            onChange={this.handleSenderLastname}
                        />
                    </div>
                    <div className="form-group mt-5">
                        <label htmlFor="status">Ontvanger</label>
                        <textarea
                            type="text"
                            className="form-control textarea mt-1"
                            id="recipientid"
                            value={this.state.recipient.id}
                            onChange={this.handleRecipientId}
                        />
                        <textarea
                            type="text"
                            className="form-control textarea mt-1"
                            id="recipientfirst_name"
                            value={this.state.recipient.first_name}
                            onChange={this.handleRecipientFirstname}
                        />
                        <textarea
                            type="text"
                            className="form-control textarea mt-1"
                            id="recipientmiddle_name"
                            value={this.state.recipient.middle_name}
                            onChange={this.handleRecipientMiddlename}
                        />
                        <textarea
                            type="text"
                            className="form-control textarea mt-1"
                            id="recipientlast_name"
                            value={this.state.recipient.last_name}
                            onChange={this.handleRecipientLastname}
                        />
                    </div>
                    <input
                        type="submit"
                        className="btn btn-outline-success mybutton"
                        value="Submit"
                    />
                </form>
            </div>
        )
    }
}

export default EditLetter