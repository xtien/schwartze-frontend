import React, {Component} from 'react'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import './css/bootstrap.css'

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
            imageData: []
        }

        this.edit = this.edit.bind(this);

        let postData = {
            number: props.match.params.number
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };

        axios.post('https://pengo.christine.nl:8443/get_letter_details/',
            postData,
            axiosConfig
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

        axios.post('https://pengo.christine.nl:8443/get_letter_images/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    imageData: response.data.images

                })
            )
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
        const listItems = images.map((d) => parse("data:image/jpeg;base64, %s", d))
            .map((d) => (<div className='letter_image'><img width="1000" src={d}/></div>));
        const senders = this.state.senders;
        const recipients = this.state.recipients;
        const senderList = senders.map((s) => <span>{s.first_name} {s.last_name}  </span>);
        const recipientList = recipients.map((r) => <span>{r.first_name} {r.last_name}  </span>);

        return (
            <div className='container'>
                 <div>
                    {remarks}
                </div>
                <div>
                    <button onClick={this.edit} value={letterNumber}>
                        edit
                    </button>
                </div>
                <div>
                    {this.state.showEdit ?
                        <CommentForm letterId={this.state.letter.id} text={this.state.letter.remarks}/> : null}
                </div>
                <div className='letter'>
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

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function () {
        return args[i++];
    });
}

class CommentForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            letterId: this.props.letterId,
            text: this.props.text,
            resultCode: 0,
            editDone: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({text: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            number: this.state.letterId,
            comment: this.state.text
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };

        axios.post('https://pengo.christine.nl:8443/update_letter_details/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    editDone: true
                })
            )

    }

    render() {

        if (this.state.editDone === true) {
            return <Redirect to={'/get_letters/'}/>
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    <textarea value={this.state.text} onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}

export default Letter