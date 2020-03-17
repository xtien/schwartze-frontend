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
            sender_location: {},
            recipient_location: {}
        }

        this.handleSenderId = this.handleSenderId.bind(this);
        this.handleRecipientId = this.handleRecipientId.bind(this);
        this.handleSenderLocation = this.handleSenderLocation.bind(this);
        this.handleRecipientLocation = this.handleRecipientLocation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDate = this.handleDate.bind(this);

        let postData = {
            number: props.match.params.number
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_letter_details/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.setState({
                        letter: response.data.letter,
                        sender: response.data.letter.senders[0],
                        recipient: response.data.letter.recipients[0],
                        sender_location: response.data.letter.sender_location[0],
                        recipient_location: response.data.letter.recipient_location[0]
                    })
                }
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

    handleSenderLocation(event) {
        const value = event.target.value;
        this.setState(prevState => ({
            sender_location: {
                ...prevState.sender_location,
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

    handleRecipientLocation(event) {
        const value = event.target.value;
        this.setState(prevState => ({
            recipient_location: {
                ...prevState.recipient_location,
                id: value
            }
        }))
    }

    handleDate(event) {
        const value = event.target.value;
        this.setState(prevState => ({
            letter: {
                ...prevState.letter,
                date: value
            }
        }))
    }

    handleSubmit(event) {
        event.preventDefault();

        let updated_letter = this.state.letter;
        updated_letter.senders = [this.state.sender];
        updated_letter.recipients = [this.state.recipient];
        updated_letter.sender_location = [this.state.sender_location];
        updated_letter.recipient_location = [this.state.recipient_location];

        let postData = {
            letter: updated_letter
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/update_letter/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    editDone: true,
                    letter: response.data.letter
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    render() {

        if (this.state.editDone === true) {
            return <Redirect to={'/get_letter_details/' + this.state.letter.number + '/0'}></Redirect>
        }

        const date = this.state.letter !=null ? this.state.letter.date : '';
        const sender = this.state.sender != null ? this.state.sender : {
            id: 0,
            first_name: '',
            middle_name: '',
            tussenvoegsel: '',
            last_name: ''
        };
        const recipient = this.state.recipient != null ? this.state.recipient : {
            id: 0,
            first_name: '',
            middle_name: '',
            tussenvoegsel: '',
            last_name: ''
        };

        const sender_location = this.state.sender_location != null ? this.state.sender_location : {
            id: 0,
            location_name: ''
        }
        const recipient_location = this.state.recipient_location != null ? this.state.recipient_location : {
            id: 0,
            location_name: ''
        }

        return (
            <div>
                <h3>Brief nummer {this.state.letter.number}</h3>

                <form onSubmit={this.handleSubmit}>
                    <div className='form-group mt-5'>
                        <table width="600px">
                            <tbody>
                            <tr>
                                <td width="150px"><div className='mb-5'>
                                    Datum:
                                </div>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className='form-control textarea mt-1 w-25 mb-5'
                                        id="sender.id"
                                        value={date}
                                        onChange={this.handleDate}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td width="150px">
                                    Afzender:
                                </td>
                                <td>
                                    {sender.first_name} {sender.middle_name} {sender.last_name} in {sender_location.name}
                                </td>
                            </tr>
                             <tr>
                                <td>
                                    <label className='mr-3' htmlFor="status">Persoon id</label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className='form-control textarea mt-1 w-25'
                                        id="sender.id"
                                        value={sender.id}
                                        onChange={this.handleSenderId}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="status">Locatie id</label></td>
                                <td>
                                    <input
                                        type="text"
                                        className='form-control textarea mt-1 w-25'
                                        id="sender_location.id"
                                        value={sender_location.id}
                                        onChange={this.handleSenderLocation}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='form-group mt-5'>
                        <table width="600px">
                            <tbody>
                            <tr>
                                <td width="150px">
                                    Ontvanger
                                </td>
                                <td>
                                    {recipient.first_name} {recipient.middle_name} {recipient.last_name} in {recipient_location.name}
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="status">Persoon id</label></td>
                                <td>
                                    <input
                                        type="text"
                                        className='form-control textarea mt-1 w-25'
                                        id="recipientid"
                                        value={recipient.id}
                                        onChange={this.handleRecipientId}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="status">Locatie id</label></td>
                                <td>
                                    <input
                                        type="text"
                                        className='form-control textarea mt-1 w-25'
                                        id="recipient_location.id"
                                        value={recipient_location.id}
                                        onChange={this.handleRecipientLocation}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
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