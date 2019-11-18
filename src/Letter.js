import React, {Component} from 'react'
import './App.css'
import axios from "axios";
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
        const listItems = images.map((d) => (<div className='letter_image'><img width="1000" src={d}/></div>));
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
                            <button
                                className="btn btn-outline-success mybutton"
                                onClick={this.edit}
                                value={letterNumber}>
                                edit
                            </button>
                        </div>
                    </div>
                )}
                <div>
                    {this.state.showEdit ?
                        <div className='remark'>
                            <div>
                                <CommentForm
                                    letterId={this.state.letter.id}
                                    text={this.state.letter.remarks}
                                    toggleEditDone={this.toggleEditDone}
                                />
                            </div>
                        </div> : null}
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
                    letter: response.data.letter,
                    editDone: true
                })
            )

    }

    render() {

        if (this.state.editDone === true) {
            this.state.editDone = false;
            this.props.toggleEditDone(this.state.letter);
        }

        return (
             <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                     <textarea
                        type="text"
                        id="text"
                        value={this.state.text}
                        className="form-control textarea"
                        onChange={this.handleChange}/>
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