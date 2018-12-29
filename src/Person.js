import React, {Component} from 'react'
import './App.css'
import './css/bootstrap.css'
import axios from "axios";
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";

class Person extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultCode: -1,
            data: {},
            people: [{}],
            showEdit: false,
            person: {}
        }

        this.edit = this.edit.bind(this);

        var array;
        var intarray

        if (props.match.params.id != null) {
            array = props.match.params.id.split(',');
            intarray = array.map(Number)
        }

        let postData = {
            requestCode: 0,
            ids: intarray
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };

        axios.post('https://pengo.christine.nl:8443/get_people_details/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    people: response.data.people
                })
            )
    }

    edit(event) {

        var personId = event.target.value;
        const data = this.state.people;
        var i;
        for (i = 0; i < data.length; i++) {
            if (data[i].id == personId) {
                this.setState({person: data[i]});
                this.setState({showEdit: true})
            }
        }
    }

    render() {

        const data = this.state.people;
        const listItems = data.map((d) => <p key={d.id}>{d.first_name} {d.middle_name} {d.last_name}

            <button onClick={this.edit} value={d.id}>
                edit
            </button>
        </p>);

        const listComments = data.map((d) => <p key={d.comment}>{d.comment} </p>);

        return (
            <div className='container'>
                 <div className='list_of_letters'>
                    {listItems}
                </div>
                <div className='list_of_letters'>
                    {listComments}
                </div>
                <div>
                    {this.state.showEdit ?
                        <CommentForm personId={this.state.person.id} text={this.state.person.comment}/> : null}
                </div>

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
             return <Redirect to={'/get_letters/'} />
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
