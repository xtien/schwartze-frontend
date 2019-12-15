import React, {Component} from 'react'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import './css/bootstrap.css'

class Text extends Component {

    constructor(props) {
        super(props)

        this.state = {
            person_id: props.person_id,
            location_id: props.location.location_id,
            id: props.match.params.id,
            person: {},
            location: {},
            text: {},
            text_string: '',
            cancel: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);

        let postData = {
            id: this.state.id,
            location_id: this.state.location_id,
            person_id: this.state.person_id,

        };
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post('https://pengo.christine.nl:8443/get_text/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    text: response.data.location.text,
                    location: response.data.location,
                    person: response.data.person
                })
            )
    }

    handleTextChange(event) {
        this.setState({text_string: event.target.value});
    }

    handleCancel(event) {
        event.preventDefault();

        this.setState(
            {cancel: true}
        )
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            location_id: this.state.location_id,
            person_id: this.state.person_id,
            text_id: this.state.text_id,
            text_string: this.state.text_string,
        };

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            }
        };

        axios.post('https://pengo.christine.nl:8443/edit_link/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    location: response.data.location,
                    editDone: true
                })
            );
    }

    render() {

        const location = this.state.location;
        const person = this.state.person;
        let text = location.text != null ? location.text : person.text;
        const redirectTo = (location != null && location.text != null) ? '/get_location/' + location.id : '/get_person/' + person.id;

        return (
            <div className='container'>
                <div>
                    {
                        this.state.cancel  ?
                            <Redirect to={redirectTo}/> :
                            <div>

                                <div>
                                    {this.state.person != null ?
                                        <Link
                                            to={'get_person' + person.id}> {person.first_name} {person.last_name}</Link>
                                        : null
                                    }</div>
                                <div>
                                    {this.state.location != null ?
                                        <Link to={'get_location' + location.id}> {location.location_name}</Link>
                                        : null
                                    }
                                </div>

                                <form onSubmit={this.handleSubmit} oncancel={this.handleCancel} className='mt-5'>
                                    <div className="form-group">
                        <textarea
                            type="text"
                            className="form-control textarea"
                            id="text_string"
                            value={this.state.text_string}
                            onChange={this.handleTextChange}
                        />
                                    </div>
                                    <table className='mt-5'>
                                        <tr>
                                            <td>
                                                <input
                                                    type="submit"
                                                    className="btn btn-outline-success mybutton"
                                                    value="Save"
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger mybutton ml-5"
                                                    onClick={() => {
                                                        this.props.history.push(redirectTo)
                                                    }}
                                                >Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    </table>
                                </form>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default Text