import React, {Component} from 'react'
import axios from "axios";
import {Redirect, Link} from "react-router-dom";
import AuthenticationService from "./service/AuthenticationService";

class Subjects extends Component {

    constructor() {

        super()

        this.state = {
            subjects: [{}],
            linkEditDone: false
        }

        this.edit_link = this.edit_link.bind(this);
        this.delete_link = this.delete_link.bind(this);
        this.add_link = this.add_link.bind(this);

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

    add_link(event) {
        event.preventDefault();

        this.setState(
            {
                showLinkEdit: true,
                subject_name: '',
            }
        )
    }

    delete_link(id) {

        let postData = {
            subject_id: id
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

    edit_link(id) {

        this.setState(
            {
                editLink: true,
                subject_id: id,
            }
        )
    }

    setSubjects = (subjects) => {
        this.setState({
            showLinkEdit: false,
            subjects: subjects
        })
    }

    render() {

         if (this.state.editLink) {
           return <Redirect to={'/edit_text/subject/' + this.state.subject_id}/>
        }

        const subjects = this.state.subjects;
        const edit_link = this.edit_link;
        const delete_link = this.delete_link;

        let links = []
        if (subjects != null) {
            links = subjects.map(function (link, i) {
                return (
                    <div key={i}>
                        <table width="100%">
                            <tbody>
                            <tr>
                                <td>
                                    <Link to={'/get_text/subject/' +link.id}>  {link.name}</Link>
                                </td>
                                <td width="20%">
                                    {AuthenticationService.isAdmin() === "true" ?
                                        <div>
                                            <button
                                                className="btn btn-outline-success mybutton ml-2 mt-2"
                                                onClick={edit_link.bind(this, link.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-outline-danger mybutton ml-2 mt-2"
                                                onClick={delete_link.bind(this, link.id)}
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
                <h3>Onderwerpen</h3>

                <div className='mt-5'>
                    <div id='linkContainer'>
                        {links}
                    </div>
                    {this.state.showLinkEdit ? (
                            <EditLinkForm
                                subject_name={this.state.subject_name}
                                subjects={this.state.subjects}
                                setSubjects={this.setSubjects}
                            />
                        )
                        : null}
                    <div>
                        {
                            AuthenticationService.isAdmin() === "true" ?

                                <div>

                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <form onSubmit={this.add_link} className='mt-5 ml-5 mb-5'>
                                                    <input
                                                        type="submit"
                                                        className="btn btn-outline-success mybutton"
                                                        value="Link toevoegen"
                                                    />

                                                </form>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                : null}
                    </div>
                </div>
            </div>
        )
    }
}

class EditLinkForm extends React.Component {

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

        let postData = {
            subject_name: this.state.subject_name,
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/add_subject/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response => {
                    this.props.setSubjects(response.data.subjects)
                }
            )
            .catch(error => {
                console.log(error)
            });
    }

    handleNameChange(event) {
        this.setState({subject_name: event.target.value});
    }

    handleUrlChange(event) {
        this.setState({link_url: event.target.value});
    }

    render() {

        return (
            <form onSubmit={this.handleLinkSubmit}>
                <div className="form-group">
                    <label htmlFor="status">Link naam</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="subject_name"
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