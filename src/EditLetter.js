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

        this.handleSenderId = this.handleSenderId.bind(this);
        this.handleRecipientId = this.handleRecipientId.bind(this);
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

    handleRecipientId(event) {
        const value = event.target.value;
        this.setState(prevState => ({
            recipient: {
                ...prevState.recipient,
                id: value
            }
        }))
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
            return <Redirect to={'/get_letter_details/' + this.state.letter.number}></Redirect>
        }

        return (
            <div className='w-50'>
                <p>Brief nummer {this.state.letter.number}</p>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="status">Afzender</label>
                        <p>{this.state.sender.id} {this.state.sender.first_name} {this.state.sender.middle_name} {this.state.sender.last_name}</p>
                        <textarea
                            type="text"
                            className="form-control textarea mt-1"
                            id="sender.id"
                            value={this.state.sender.id}
                            onChange={this.handleSenderId}
                        />
                     </div>
                    <div className="form-group mt-5">
                        <label htmlFor="status">Ontvanger</label>
                        <p>{this.state.recipient.id} {this.state.recipient.first_name} {this.state.recipient.middle_name} {this.state.recipient.last_name}</p>
                        <textarea
                            type="text"
                            className="form-control textarea mt-1"
                            id="recipientid"
                            value={this.state.recipient.id}
                            onChange={this.handleRecipientId}
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