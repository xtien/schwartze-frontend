import React, {Component} from 'react'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import './css/bootstrap.css'
import AuthenticationService from "./service/AuthenticationService";
import Util from './service/Util';

class Location extends Component {

    constructor(props) {
        super(props)

        const isAuthenticated = AuthenticationService.isAdmin();

        this.state = {
            resultCode: -1,
            data: {},
            locationText: '',
            location: {},
            showLinkEdit: false,
            link_id: '',
            link_name: '',
            link_url: '',
            isAuthenticated: isAuthenticated
        }

        this.add_link = this.add_link.bind(this);
        this.edit_link = this.edit_link.bind(this);
        this.delete_link = this.delete_link.bind(this);
        this.combine = this.combine.bind(this);
        this.delete = this.delete.bind(this);

        let id;

        if (props.match.params.id != null) {
            id = props.match.params.id;
        }

        let postData = {
            id: id
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_location/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    location: response.data.location
                })
            )
    }

    togglelinkEditDone = (location) => {
        this.setState({
            showLinkEdit: false,
            location: location
        })
    }

    delete(event) {
        event.preventDefault();

        this.setState(
            {
                delete: true
            }
        )

        let postData = {
            requestCode: 0,
            id: this.state.location.id
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/delete_location/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    deleted: true
                })
            )
    }

    delete_link(id) {

        let postData = {
            link_id: id,
            location_id: this.state.location.id
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/delete_link/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    location: response.data.location
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

    edit_link(id) {

        const link = this.state.location.links.find(link => {
            return link.id === id
        });

        this.setState(
            {
                showLinkEdit: true,
                link_name: link.link_name,
                link_url: link.link_url,
                link_id: link.id
            }
        )
    }

    combine(event) {
        event.preventDefault();

        this.setState(
            {
                combine: true
            }
        )
    }

    render() {

        const auth = this.state.isAuthenticated;
        const location = this.state.location;
        const edit_link = this.edit_link;
        const delete_link = this.delete_link;
        let linkTo = '';
        if (location != null) {
            linkTo = '/get_text/location/' + location.id;
        }

        if (this.state.combine === true) {
            return <Redirect to={'/combine_location/' + location.id}/>
        }

        if (this.state.deleted === true) {
            return <Redirect to={'/get_locations/'}/>
        }

        let links = []
        if (location.links != null) {
            links = location.links.map(function (link, i) {
                return (
                    <div key={i}>
                        <table width="100%">
                            <tr>
                                <td>
                                    <a href={link.link_url}>{link.link_name}</a>
                                </td>
                                <td width="20%">
                                    { auth ?
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
                                        : null }
                                </td>
                            </tr>
                        </table>
                    </div>
                );
            });
        }

        return (

            <div className='container letter'>
                <h3>{location.location_name}</h3>
                <p>{location.comment}</p>
                <p>{location.description}</p>

                <div className='textpage mt-5 ml-5'>
                {location.text != null && Util.isNotEmpty(location.text.text_string) ?
                    <div>
                        <p>  {location.text.text_string.substr(0, 300)}</p>
                        {location.text.text_string.length > 300 ?
                            <p>
                                <Link to={linkTo} className='mt-5 mb-5'> Meer </Link>
                            </p>
                            : null}
                    </div> : null}
                </div>

                <div>
                    <div id='linkContainer'>
                        {links}
                    </div>
                    {this.state.showLinkEdit ? (
                            <EditLinkForm
                                location_id={this.state.location.id}
                                link_id={this.state.link_id}
                                link_name={this.state.link_name}
                                link_url={this.state.link_url}
                                togglelinkEditDone={this.togglelinkEditDone}
                            />
                        )
                        :
                        <div>
                            {
                                this.state.isAuthenticated ?

                                    <div>
                                        <div className='mb-5 mt-5 ml-5'>
                                            <Link to={{
                                                pathname: '/edit_text/',
                                                location_id: location.id
                                            }}>
                                                Edit text
                                            </Link>
                                        </div>

                                        <table>
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
                                            <td>
                                                <form onSubmit={this.combine} className="mt-5 ml-5 mb-5">
                                                    <input
                                                        type="submit"
                                                        className="btn btn-outline-success mybutton"
                                                        value="Combineren"
                                                    />
                                                </form>
                                            </td>
                                            <td>
                                                <form onSubmit={this.delete} className="mt-5 ml-5 mb-5">
                                                    <input
                                                        type="submit"
                                                        className="btn btn-outline-danger mybutton"
                                                        value="Verwijderen"
                                                    />

                                                </form>
                                                </td>
                                        </tr>
                                    </table>
                                    </div>
                                    : null }
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
            location: {},
            location_id: this.props.location_id,
            link_id: this.props.link_id,
            link_name: this.props.link_name,
            link_url: this.props.link_url,
        };

        this.handleLinkSubmit = this.handleLinkSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
    }

    handleLinkSubmit(event) {
        event.preventDefault();

        let postData = {
            location_id: this.state.location_id,
            link_id: this.state.link_id,
            link_name: this.state.link_name,
            link_url: this.state.link_url,
        };

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/admin/edit_link/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    location: response.data.location,
                    linkEditDone: true
                })
            );
    }

    handleNameChange(event) {
        this.setState({link_name: event.target.value});
    }

    handleUrlChange(event) {
        this.setState({link_url: event.target.value});
    }

    render() {

        const redirectTo = '/get_location_details/' + this.state.location_id;

        if (this.state.linkEditDone == true) {
            if (this.state.linkEditDone == true) {
                return <Redirect to={redirectTo}/>
            }
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
                <div className="form-group">
                    <label htmlFor="status">Link url</label>
                    <textarea
                        type="text"
                        className="form-control textarea"
                        id="link_url"
                        value={this.state.link_url}
                        onChange={this.handleUrlChange}
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

export default Location