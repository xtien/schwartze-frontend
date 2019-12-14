import React, {Component} from 'react'
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import './css/bootstrap.css'
import ReactTable from "react-table";

class Location extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultCode: -1,
            data: {},
            locationText: '',
            location: {},
            showLinkEdit: false,
            link_id:'',
            link_name: '',
            link_url: '',
        }

        this.add_link = this.add_link.bind(this);
        this.add_text = this.add_text.bind(this);
        this.edit_link = this.edit_link.bind(this);
        this.delete_link = this.delete_link.bind(this);

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

        axios.post('https://pengo.christine.nl:8443/get_location/',
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

    delete_link(id) {

        let postData = {
            link_id: id
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post('https://pengo.christine.nl:8443/delete_link/',
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

        const link = this.state.location.links.find(link => link.id = id);

        this.setState(
            {
                showLinkEdit: true,
                link_name: link.link_name,
                link_url: link.link_url,
                link_id: link.id
            }
        )
    }

    add_text(event) {
        event.preventDefault();

        this.setState(
            {
                showTextEdit: true
            }
        )

        let postData = {
            location_id: this.state.location.id
        }
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
                    text: response.data.text,
                    text_id: response.data.id,
                    showTextEdit: true
                })
            )

    }

    edit_text(event){
        event.preventDefault();

        let postData = {
            requestCode: 0,
            id: this.state.text.id
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post('https://pengo.christine.nl:8443/edit_text/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    showTextEdit: false
                })
            )
    }

    render() {

        const location = this.state.location;
        var edit_link = this.edit_link;
        var delete_link = this.delete_link;
        const linkto = '/get_location_text/' + location.id;
        const linktoedit = '/edit_location_text/' + location.id;

        var links = []
        if (location.links != null) {
            links = location.links.map(function (link, i) {
                return (
                    <div key={i}><a href={link.link_url}>{link.link_name}</a>
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
                );
            });
        }

        return (

            <div className='container'>
                <h3>{location.location_name}</h3>
                <p>{location.comment}</p>
                <p>{location.description}</p>

                <div>
                    {this.state.location.text != null ?
                        <div>
                            <p>
                                 <Link to={linkto}>
                                    Meer
                                </Link>
                            </p>
                        </div> : null}
                </div>

                <div id='linkcontainer'>
                    <div id='linkContainer'>
                        {links}
                    </div>
                    <form onSubmit={this.add_link} className='mt-5'>
                        <input
                            type="submit"
                            className="btn btn-outline-success mybutton"
                            value="Link toevoegen"
                        />

                    </form>

                </div>

                {this.state.showLinkEdit ? (
                    <EditLinkForm
                        location_id={this.state.location.id}
                        link_id={this.state.link_id}
                        link_name={this.state.link_name}
                        link_url={this.state.link_url}
                        togglelinkEditDone={this.togglelinkEditDone}
                    />
                ) : null
                }

                <div>
                    <Link to={linktoedit}>
                        Edit text
                    </Link>
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

        axios.post('https://pengo.christine.nl:8443/edit_link/',
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

        if (this.state.linkEditDone === true) {
            this.state.linkEditDone = false;
            this.props.togglelinkEditDone(this.state.location);
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