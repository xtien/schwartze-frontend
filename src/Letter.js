import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import AuthenticationService from './service/AuthenticationService';
import {Link} from "react-router-dom";
import Util from "./service/Util";
import {Redirect} from "react-router";
import arrow_left from "./images/arrow_left.png";
import arrow_right from "./images/arrow_right.png";

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
            recipient_locations: [],
            edit_letter: false,
            pageNumber: props.match.params.pagenumber
        }

        this.editLetter = this.editLetter.bind(this);
        this.editComment = this.editComment.bind(this);
        this.forward = this.forward.bind(this);
        this.back = this.back.bind(this);
        this.post = this.post.bind(this);
        this.back_to_letters = this.back_to_letters.bind(this);

        this.post(props.match.params.number)
    }

    toggleEditDone = (letter) => {
        this.setState({
            showEdit: false,
            letter: letter
        })
    }

    editComment(event) {

        let letterNumber = event.target.value;
        const letter = this.state.letter;
        this.setState({
            showEdit: true,
            letter: letter,
            letterNumber: letterNumber
        })
    }

    editLetter(event) {
        this.setState({
            edit_letter: true
        })
    }

    forward(event) {
        this.post(this.state.letter.number + 1)
    }

    back(event) {
        this.post(this.state.letter.number > 1 ? this.state.letter.number - 1 : 1)
    }

    back_to_letters(event) {
        this.setState({
            back_to_letters: true
        })

    }

    post(number) {

        let postData = {
            number: number
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
            .catch(error => {
                console.log(error)
            });

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

    render() {

        const search_term = this.state.search_term;
        const search_letters = '/search_letters/' + search_term;
        const pageNumber = this.state.pageNumber;
        const go_to_letters = '/get_letters/' + (pageNumber !='undefined' ? pageNumber : 0);

        if (this.state.go_search === true) {
            return <Redirect to={search_letters}/>
        }
        if(this.state.back_to_letters === true){
            return <Redirect to={go_to_letters}/>
        }

        let linkTo = '';

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
            to={`/get_person_details/${s.id}`}>{s.first_name} {s.tussenvoegsel} {s.last_name} </Link> </span>);
        const recipientList = recipients.map((r) => <span><Link
            to={`/get_person_details/${r.id}`}>{r.first_name} {r.tussenvoegsel} {r.last_name} </Link> </span>);

        const sender_locations = this.state.sender_locations;
        const senderLocationList = sender_locations.map((s) => <span><Link
            to={`/get_location_details/${s.id}`}>{s.location_name} </Link> </span>);
        const recipient_locations = this.state.recipient_locations;
        const recipientLocationList = recipient_locations.map((s) => <span><Link
            to={`/get_location_details/${s.id}`}>{s.location_name} </Link> </span>);

        if (letter != null) {
            linkTo = '/get_text/letter/' + letter.id;
        }

        if (this.state.edit_letter === true) {
            return <Redirect to={'/edit_letter/' + letter.number}/>
        }

        return (
            <div className='container'>
                {this.state.showEdit ? null : (

                    <div>
                        <table border="0" width="100%">
                            <tbody>
                            <tr>
                                <td align='left' width="30">
                                    <button type="button"
                                            className='btn btn-link'
                                            onClick={this.back}>
                                        <img src={arrow_left} alt="back"/>
                                    </button>
                                </td>
                                <td align='left' width="100">
                                    <button
                                        className="btn btn-outline-secondary mybutton"
                                        onClick={this.back_to_letters}>
                                        Back
                                    </button>
                                </td>

                                <td width="10">
                                    <div>
                                        {
                                            AuthenticationService.isAdmin() === "true" ?
                                                <button
                                                    className="btn btn-outline-success mybutton"
                                                    onClick={this.editComment}>
                                                    Edit commentaarregel
                                                </button> : null}
                                    </div>
                                </td>
                                <td width="1000">
                                    <div>
                                        {
                                            AuthenticationService.isAdmin() === "true" ?
                                                <button
                                                    className="btn btn-outline-warning mybutton ml-2"
                                                    onClick={this.editLetter}>
                                                    Edit afzender/ontvanger
                                                </button> : null}
                                    </div>
                                </td>
                                <td align="right" width="30">
                                    <button
                                        className="btn btn-link"
                                        onClick={this.forward}>
                                        <img src={arrow_right} alt="back"/>
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                <div className='remark'>
                    {remarks}
                </div>

                <div>
                    {this.state.showEdit ?
                        <div>
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
                                <div className='mb-3'>
                                    Nummer: {this.state.letter.number}
                                </div>
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
                            {/* TODO: this needs to change when others than myself get access to data entry */}
                            <p>
                                <div dangerouslySetInnerHTML={{__html: letter.text.text_string.substr(0, 300)}}/>
                            </p>
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

        axios.post(process.env.REACT_APP_API_URL + '/admin/update_letter_comment/',
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
                    <input
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