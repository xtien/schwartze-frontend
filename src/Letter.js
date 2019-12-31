import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import AuthenticationService from './service/AuthenticationService';
import {Link} from "react-router-dom";
import Util from "./service/Util";

class Letter extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultCode: -1,
            data: {},
            lettertext: 'no text',
            letter: {},
            showEdit: false,
            senders: [],
            recipients: [],
            imageData: [],
            sender_locations: [],
            recipient_locations: []
        }

        this.edit = this.edit.bind(this);

        let postData = {
            number: props.match.params.number
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_letter_details/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    lettertext: response.data.lettertext,
                    letter: response.data.letter,
                    senders: response.data.letter.senders,
                    recipients: response.data.letter.recipients,
                    sender_locations: response.data.letter.sender_location,
                    recipient_locations: response.data.letter.recipient_location
                })
            )

        axios.post(process.env.REACT_APP_API_URL + '/get_letter_images/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    imageData: response.data.images

                })
            )
    }

    toggleEditDone = (letter) => {
        this.setState({
            showEdit: false,
            letter: letter
        })
    }

    edit(event) {

        var letterNumber = event.target.value;
        const letter = this.state.letter;
        this.setState({
            showEdit: true,
            letter: letter,
            letterNumber: letterNumber
        })
    }

    render() {

        let linkTo = '';
        if (letter != null) {
            linkTo = '/get_text/letter/' + letter.id;
        }

        const letter = this.state.letter;
        const images = this.state.imageData;
        const remarks = this.state.letter.comment;
        const letterNumber = this.state.letter.number;
        const letterId = this.state.letter.id;
        const listItems = images.map((d) => (
            <div className='letter_image'><img width="1000" alt="original letter" src={d}/></div>));
        const senders = this.state.senders;
        const recipients = this.state.recipients;
        const senderList = senders.map((s) => <span><Link
            to={`/get_person_details/${s.id}`}>{s.first_name} {s.last_name} </Link> </span>);
        const recipientList = recipients.map((r) => <span><Link
            to={`/get_person_details/${r.id}`}>{r.first_name} {r.last_name} </Link> </span>);

        const sender_locations = this.state.sender_locations;
        const senderLocationList = sender_locations.map((s) => <span><Link
            to={`/get_location_details/${s.id}`}>{s.location_name} </Link> </span>);
        const recipient_locations = this.state.recipient_locations;
        const recipientLocationList = recipient_locations.map((s) => <span><Link
            to={`/get_location_details/${s.id}`}>{s.location_name} </Link> </span>);

        return (
            <div className='container'>
                {this.state.showEdit ? null : (

                    <div className='remark'>
                        <div className='space'>
                            {remarks}
                        </div>
                        <div>
                            {
                                AuthenticationService.isAdmin() === "true" ?
                                    <button
                                        className="btn btn-outline-success mybutton"
                                        onClick={this.edit}
                                        value={letterNumber}>
                                        edit
                                    </button> : null}
                        </div>
                    </div>
                )}
                <div>
                    {this.state.showEdit ?
                        <div className='remark'>
                            <div>
                                <CommentForm
                                    letter_number={this.state.letter.number}
                                    text={this.state.letter.remarks}
                                    date={this.state.letter.date}
                                    toggleEditDone={this.toggleEditDone}
                                />
                            </div>
                        </div> : null}
                </div>
                <div className='letter'>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                Nummer: {this.state.letter.number}
                            </td>
                        </tr>
                        <tr>
                            <td>From:</td>
                            <td>{senderList}</td>
                            <td>
                                <div className='ml-3'>{senderLocationList}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>To:</td>
                            <td>{recipientList}</td>
                            <td>
                                <div className='ml-3'>{recipientLocationList}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td>{this.state.letter.date}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className='letter'>
                    <div dangerouslySetInnerHTML={{__html: this.state.lettertext}}/>
                </div>
                <div className='list_of_letters'>
                    {listItems}
                </div>
                <div className='textpage mt-5 ml-5'>
                    {letter.text != null && Util.isNotEmpty(letter.text.text_string) ?
                        <div>
                            <p>  {letter.text.text_string.substr(0, 300)}</p>
                            {letter.text.text_string.length > 300 ?
                                <p>
                                    <Link to={linkTo} className='mt-5 mb-5'> Meer </Link>
                                </p>
                                : null}
                        </div> : null}
                </div>

                {AuthenticationService.isAdmin() === "true" ?
                    <div className='mb-5 mt-5 ml-5'>
                        <Link to={{
                            pathname: '/edit_text/',
                            letter_id: letterId
                        }}>
                            Edit tekst
                        </Link>
                    </div>
                    : null}

            </div>
        )
    }
}

class CommentForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            letter_number: this.props.letter_number,
            text: this.props.text,
            date: this.props.date,
            resultCode: 0,
            editDone: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({text: event.target.value});
    }

    handleDateChange(event) {
        this.setState({date: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            number: this.state.letter_number,
            comment: this.state.text,
            date: this.state.date
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/update_letter_details/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    letter: response.data.letter,
                    editDone: true
                })
            )

    }

    render() {

        if (this.state.editDone === true) {
            this.setState({
                editDone: false
            })
            this.props.toggleEditDone(this.state.letter);
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="status"></label>
                    <textarea
                        type="text"
                        id="text"
                        value={this.state.text}
                        className="form-control textarea mb-5"
                        onChange={this.handleChange}/>
                    <label htmlFor="status">Datum</label>
                    <textarea
                        type="text"
                        id="date"
                        value={this.state.date}
                        className="form-control textarea"
                        onChange={this.handleDateChange}/>
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

export default Letter