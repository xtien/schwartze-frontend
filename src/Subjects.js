import React, {Component} from 'react'
import axios from "axios";
import {Redirect} from "react-router-dom";
import AuthenticationService from "./service/AuthenticationService";

class Subjects extends Component {

    constructor() {
        super()

        this.state = {
            resultCode: -1,
            data: ['a', 'b'],
            subjects: [{}]
        }

        this.add_link = this.add_link.bind(this);

        let postData = {
            requestCode: 0
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_subjects/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    texts: response.data.texts
                })
            )
    }

    add_link(event) {
        event.preventDefault();

        this.setState(
            {
                showLinkEdit: true,
                link_name: '',
                link_url: '',
                link_id: ''
            }
        )
    }

    render() {

        const subjects = this.state.subjects;
        const edit_link = this.edit_link;
        const delete_link = this.delete_link;

        let links = []
        if (subjects.links != null) {
            links = subjects.links.map(function (link, i) {
                return (
                    <div key={i}>
                        <table width="100%">
                            <tr>
                                <td>
                                    <a href={link.link_url}>{link.link_name}</a>
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
                        </table>
                    </div>
                );
            });
        }

        return (

            <div className='container letter'>
                <h3>Onderwerpen</h3>

                <div>
                    <div id='linkContainer'>
                        {links}
                    </div>
                    {this.state.showLinkEdit ? (
                            <EditLinkForm
                                  togglelinkEditDone={this.togglelinkEditDone}
                            />
                        )
                        :
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
                                    : null
                            }
                        </div>
                    }
                </div>
            </div>
        )

    }
}

class EditLinkForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            link_name: this.props.link_name,
         };

        this.handleLinkSubmit = this.handleLinkSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
     }

    handleLinkSubmit(event) {
        event.preventDefault();

        let postData = {
            link_id: this.state.link_id,
            link_name: this.state.link_name,
            link_url: this.state.link_url,
            type: this.state.type
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/add_subject/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    linkEditDone: true
                })
            );
    }

    handleNameChange(event) {
        this.setState({link_name: event.target.value});
    }

    render() {

        const redirectTo = '/subjects/';

        if (this.state.linkEditDone === true) {
            return <Redirect to={redirectTo}/>
        }

        return (
            <form onSubmit={this.handleLinkSubmit}>
                <div className="form-group">
                    <label htmlFor="status">Link naam</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="link_name"
                        value={this.state.link_name}
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
