import React, {Component} from 'react'
import './App.css'
import './css/bootstrap.css'
import axios from "axios";
import EditPersonForm from './EditPersonForm'
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";

class Person extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultCode: -1,
            data: {},
            showEdit: false,
            person: {}
        }

        this.edit = this.edit.bind(this);

        var id;

        if (props.match.params.id != null) {
            id = props.match.params.id;
        }

        let postData = {
            requestCode: 0,
            id: id
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post('https://pengo.christine.nl:8443/get_person_details/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    person: response.data.person
                })
            )
    }

    edit(event) {

        this.setState({
            showEdit: true,
        });
    }

    render() {

        const person = this.state.person;

        return (
            <div className='container'>
                {this.state.showEdit ? null : (
                    <div className="letter text-black-50">
                        <div>
                            <p>
                                {person.first_name} {person.last_name}
                            </p>
                            <p>{person.comment}</p>
                            <p>{person.links}</p>
                        </div>
                        <div>
                            {this.state.showEdit ?
                                <CommentForm personId={this.state.person.id} text={this.state.person.comment}/> : null}
                        </div>
                        <div>
                            {this.state.showEdit ? null : (
                                <div>
                                    <div>
                                        <button
                                            className="btn btn-outline-success mybutton"
                                            onClick={this.edit}
                                            value={this.state.id}
                                        >
                                            edit
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {this.state.showEdit ? (
                    <EditPersonForm
                        comment={this.state.person.comment}
                        links={this.state.person.links}
                        id={this.state.person.id}
                        first_name={this.state.person.first_name}
                        last_name={this.state.person.last_name}
                    />
                ) : null
                }
            </div>
        )
    }
}

class CommentForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            personId: this.props.personId,
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
            id: this.state.personId,
            comment: this.state.text
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };

        axios.post('https://pengo.christine.nl:8443/update_person_details/',
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

export default Person
