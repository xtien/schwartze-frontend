import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import {Redirect} from "react-router-dom";
import AuthenticationService from "./service/AuthenticationService";

class AddLocation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            locationName: '',
            comment: '',
            location: {}
        };

        this.handleLocationNameChange = this.handleLocationNameChange.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCommentChange(event) {
        this.setState({comment: event.target.value});
    }

    handleLocationNameChange(event) {
        this.setState({location_name: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            location: {
                location_name: this.state.location_name,
                text: this.state.text,
                last_name: this.state.last_name,
                comment: this.state.comment,
                links: this.state.links,
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/add_location/',
            postData,
            AuthenticationService.getAxiosConfig(),
        )
            .then(response =>
                this.setState({
                    editDone: true,
                    id: response.data.location.id
                })
            )
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    }

    render() {

        if (this.state.editDone === true) {
            return (
                <Redirect to={"/get_location_details/" + this.state.id}/>
            )
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="status">Location</label>
                    <input
                        type="text"
                        className="form-control textarea"
                        id="first_name"
                        value={this.state.location_name}
                        onChange={this.handleLocationNameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Text</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="comments"
                        value={this.state.comment}
                        onChange={this.handleCommentChange}
                    />
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


export default AddLocation
