import React from "react";
import axios from "axios";
import {Redirect} from "react-router-dom";

class EditPersonForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            first_name: this.props.first_name,
            last_name: this.props.last_name,
            comment: this.props.comment,
            links: this.props.links,
            redirect: false,
            person: {}
        };

        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleLinksChange = this.handleLinksChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCommentChange(event) {
        this.setState({comment: event.target.value});
    }

    handleLinksChange(event) {
        this.setState({links: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            person: {
                id: this.state.id,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                comment: this.state.comment,
                links: this.state.links,
            }
        };

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .post(
                window.url + "/update_person_details/",
                postData,
                axiosConfig
            )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    person:response.data.person,
                    redirect: true
                })
            );
    }

    render() {

        if (this.state.redirect) {
            this.state.redirect = false;
            let linkTo = "/getLetters";
            return <Redirect push to={linkTo}/>;
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <div><p>{this.state.person.first_name} {this.state.person.last_name}</p></div>
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
                <div className="form-group">
                    <label htmlFor="header">Links</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="links"
                        value={this.state.links}
                        onChange={this.handleLinksChange}
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

export default EditPersonForm;
