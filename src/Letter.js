import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import AuthenticationService from './service/AuthenticationService';

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
                    recipients: response.data.letter.recipients
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

        const images = this.state.imageData;
        const remarks = this.state.letter.comment;
        const letterNumber = this.state.letter.number;
        const listItems = images.map((d) => (
            <div className='letter_image'><img width="1000" alt="original letter" src={d}/></div>));
        const senders = this.state.senders;
        const recipients = this.state.recipients;
        const senderList = senders.map((s) => <span>{s.first_name} {s.last_name}  </span>);
        const recipientList = recipients.map((r) => <span>{r.first_name} {r.last_name}  </span>);

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
                    <tr>
                        <td>
                            Nummer: {this.state.letter.number}
                        </td>
                    </tr>
                    <tr>
                        <td>From:</td>
                        <td>{senderList}</td>
                    </tr>
                    <tr>
                        <td>To:</td>
                        <td>{recipientList}</td>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>{this.state.letter.date}</td>
                    </tr>
                </div>

                <div className='letter'>
                    <div dangerouslySetInnerHTML={{__html: this.state.lettertext}}/>
                </div>
                <div className='list_of_letters'>
                    {listItems}
                </div>
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