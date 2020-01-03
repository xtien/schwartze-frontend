import React, {Component} from 'react'
import axios from "axios";
import {Link} from "react-router-dom";
import AuthenticationService from "./service/AuthenticationService";

class Subjects extends Component {

    constructor() {
        super()

        this.state = {
            resultCode: -1,
            data: ['a', 'b'],
            subjects: [{}],
        }

        this.delete_subject = this.delete_subject.bind(this);
        this.add_subject = this.add_subject.bind(this);
        this.edit_subject = this.edit_subject.bind(this);

        axios.get(process.env.REACT_APP_API_URL + '/get_subjects/',
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    subjects: response.data.subjects
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    add_subject() {
        this.setState({
            show_add_subject: true
        })
    }

    delete_subject(id) {

        let postData = {
            subject_id: id,
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/remove_subject/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    subjects: response.data.subjects
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    edit_subject(id) {

        this.setState({
            edit_subject: true,
            subject_id: id
        })
    }

    render() {

        const subjects = this.state.subjects;
        const delete_subject = this.delete_subject;
        const edit_subject = this.edit_subject;

        let links = []
        if (subjects != null) {
            links = subjects.map(function (subject, i) {
                return (
                    <div key={i}>
                        <table width="100%">
                            <tbody>
                            <tr>
                                <td>
                                    <Link to={'/get_text/subject/' + subject.id}> {subject.name} </Link>
                                </td>
                                <td width="20%">
                                    {AuthenticationService.isAdmin() === "true" ?
                                        <div>
                                            <button
                                                className="btn btn-outline-success mybutton ml-2 mt-2"
                                                onClick={edit_subject.bind(this, subject.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-outline-danger mybutton ml-2 mt-2"
                                                onClick={delete_subject.bind(this, subject.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        : null}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                );
            });
        }

        return (
            <div className='container letter'>
                <h3>Subjects</h3>

                <div className='mt-5'>
                    <div id='linkContainer'>
                        {links}
                    </div>

                    {this.state.show_add_subject ?
                        <AddSubjectForm
                            subjects={this.state.subjects}
                        />
                        : null
                    }

                    <div>
                        {
                            AuthenticationService.isAdmin() === "true" ?
                                <div>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <form onSubmit={this.add_subject} className='mt-5 ml-5 mb-5'>
                                                    <input
                                                        type="submit"
                                                        className="btn btn-outline-success mybutton"
                                                        value="Onderwerp toevoegen"
                                                    />

                                                </form>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                : null
                        }
                    </div>

                </div>
            </div>
        )
    }
}

class AddSubjectForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            subject_name: this.props.subject_name,
            subjects: this.props.subjects,
        };

        this.handleLinkSubmit = this.handleLinkSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleLinkSubmit(event) {
        event.preventDefault();
    }

    handleNameChange(event) {
        this.setState({subject_name: event.target.value});
    }

    render() {

        return (
            <form onSubmit={this.handleLinkSubmit}>
                <div className="form-group">
                    <label htmlFor="status">Onderwerp naam</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="link_name"
                        value={this.state.subject_name}
                        onChange={this.handleNameChange}
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

export default Subjects
