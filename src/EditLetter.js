import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import AuthenticationService from './service/AuthenticationService';
import {Redirect} from "react-router";
import {Link} from "react-router-dom";

class EditLetter extends Component {

    constructor(props) {
        super(props)

        this.state = {
            letter: {},
            editDone: false,
            senders: [],
            recipients: [],
            sender_location: {},
            recipient_location: {},
            recipientsString: '',
            sendersString: '',
            errorMessage: null
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
                        senders: response.data.letter.senders,
                        recipients: response.data.letter.recipients,
                        sender_location: response.data.letter.sender_location[0],
                        recipient_location: response.data.letter.recipient_location[0]
                    })

                    let senderIdList = ''
                    if (this.state != null && this.state.senders != null && this.state.senders.length > 0) {
                        senderIdList = this.state.senders.map((r) =>
                            r.id);
                    }
                    let senderIds = ''
                    let id
                    for (id in senderIdList) {
                        senderIds += senderIdList[id];
                        if (id < senderIdList.length - 1) {
                            senderIds += ','
                        }
                    }
                    let recipientIdList = ''
                    if (this.state != null && this.state.recipients != null && this.state.recipients.length > 0) {
                        recipientIdList = this.state.recipients.map((r) =>
                            r.id);
                    }
                    let recipientIds = ''
                    for (id in recipientIdList) {
                        recipientIds += recipientIdList[id];
                        if (id < recipientIdList.length - 1) {
                            recipientIds += ','
                        }
                    }

                    this.setState({
                        sendersString: senderIds,
                        recipientsString: recipientIds
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
            sendersString: value
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
            recipientsString: value
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

        let x
        let sendersList = []
        let splitSenders = this.state.sendersString.replace(/ /g, '').replace(/(^,)|(,$)/g, "").split(',')
        for (x in splitSenders) {
            sendersList.push(
                {
                    id: splitSenders[x]
                }
            )
        }
        let y
        let recipientList = []
        let splitRecipients = this.state.recipientsString.replace(' ', '').replace(/(^,)|(,$)/g, '').split(',')
        for (y in splitRecipients) {
            recipientList.push(
                {
                    id: splitRecipients[y]
                }
            )
        }

        let updated_letter = this.state.letter;
        updated_letter.senders = sendersList;
        updated_letter.recipients = recipientList;
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
                this.setState({
                    errorMessage: error
                })
            });
    }

    render() {

        if (this.state.editDone === true && this.state.letter != null) {
            return <Redirect to={'/get_letter_details/' + this.state.letter.number + '/0'}></Redirect>
        }

        const date = this.state.letter != null ? this.state.letter.date : '';

        let senderList = []
        if (this.state != null && this.state.senders != null) {
            senderList = this.state.senders.map((r) => <span>
                {r.nick_name} {r.tussenvoegsel} {r.last_name} </span>);
        } else {
            senderList = '';
        }


        let recipientList = []
        if (this.state != null && this.state.recipients != null) {
            recipientList = this.state.recipients.map((r) => <span>
                {r.nick_name} {r.tussenvoegsel} {r.last_name} </span>);
        } else {
            recipientList = '';
        }

        const sender_location = this.state.sender_location != null ? this.state.sender_location : {
            id: 0,
            location_name: ''
        }
        const recipient_location = this.state.recipient_location != null ? this.state.recipient_location : {
            id: 0,
            location_name: ''
        }

        const number = this.state.letter != null ? this.state.letter.number : ''

        const errorM = this.state.errorMessage;

        return (
            <div>
                <div>
                    {errorM != null ?
                        <div className="mb-5">
                            <div>{this.state.errorMessage.message}</div>
                            <div> {this.state.errorMessage.stack}</div>
                        </div> : null}

                    <div>
                        <h3>Brief nummer {number} </h3>

                        <form onSubmit={this.handleSubmit}>
                            <div className='form-group mt-5'>
                                <table width="600px">
                                    <tbody>
                                    <tr>
                                        <td width="150px">
                                            <div className='mb-5'>
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
                                            {senderList} in {sender_location.name}
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
                                                id="senderId"
                                                value={this.state.sendersString}
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
                                            {recipientList} in {recipient_location.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label htmlFor="status">Persoon id</label></td>
                                        <td>
                                            <input
                                                type="text"
                                                className='form-control textarea mt-1 w-25'
                                                id="recipientid"
                                                value={this.state.recipientsString}
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
                </div>
            </div>
        )
    }
}

export default EditLetter
