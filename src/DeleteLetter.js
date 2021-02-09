import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import AuthenticationService from './service/AuthenticationService';
import {Redirect} from "react-router";

class DeleteLetter extends Component {

    constructor(props) {
        super(props)

        this.state = {
            letter: {},
            senders: [],
            recipients: [],
            sender_location: {},
            recipient_location: {},
            recipientsString: '',
            sendersString: '',
            errorMessage: null,
            deleted: false,
            cancel: false
        }

        this.deleteLetter = this.deleteLetter.bind(this);
        this.cancel = this.cancel.bind(this);

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

    cancel(){
        this.setState({
            cancel: true
        })
    }

    deleteLetter(){

        const postData = {
            letter: this.state.letter
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/delete_letter/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.setState({
                        deleted: true
                    })
                    this.getLetterImages(response.data.letter.number)
                }
            )
            .catch(error => {
                console.log(error)
            });

    }

    render() {

        if (this.state.cancel === true && this.state.letter != null) {
            return <Redirect to={'/get_letter_details/' + this.state.letter.number + '/0'}></Redirect>
        }

        let pagenumber = Math.max(0,(this.state.letter.number/20) -1);
        if (this.state.deleted === true) {
            return <Redirect to={'/get_letters/' + [pagenumber]}></Redirect>
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
                                            {date}
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

                                    </tbody>
                                </table>
                            </div>
                         <td width="10">
                            <div className="mt-5">
                                {
                                    AuthenticationService.isAdmin() === "true" ?
                                        <button
                                            className="btn btn-outline-success mybutton"
                                            onClick={this.cancel}>
                                            Cancel
                                        </button> : null}
                            </div>
                        </td>
                        <td width="1000">
                            <div className="mt-5 ml-5">
                                {
                                    AuthenticationService.isAdmin() === "true" ?
                                        <button
                                            className="btn btn-outline-warning mybutton ml-2"
                                            onClick={this.deleteLetter}>
                                            Delete
                                        </button> : null}
                            </div>
                        </td>

                    </div>
                </div>
            </div>
        )
    }
}

export default DeleteLetter
