import React, {Component} from 'react'
import './css/bootstrap.css'
import AuthenticationService from "./service/AuthenticationService";
import {Redirect} from "react-router-dom";
import axios from "axios";

class Admin extends Component {

    constructor(props) {
        super(props)

        const isAuthenticated = AuthenticationService.isAdmin();

        this.state = {
            isAuthenticated: isAuthenticated,
            addLetter: false,
            addPerson: false,
            addLocation: false,
            logout: false
        }
        this.add_location = this.add_location.bind(this);
        this.add_person = this.add_person.bind(this);
        this.add_letter = this.add_letter.bind(this);
        this.logout = this.logout.bind(this);
    }

    add_person() {
        this.setState(
            {
                addPerson: true
            })
    }

    add_location() {
        this.setState(
            {
                addLocation: true
            })
    }

    add_letter() {
        this.setState(
            {
                addLetter: true
            })
    }

    logout() {
        let postData = {
            requestCode: 0
        };

        let axiosConfig = AuthenticationService.getAxiosConfig();

        const url = process.env.REACT_APP_API_URL + '/logout/';

        axios.post(url,
            postData,
            axiosConfig
        )
            .then(response => {
                    this.setState({
                        logout: true
                    })
                    AuthenticationService.logout()
                }
            )
            .catch(error => {
                console.log(error)
            });

    }

    render() {

        if (this.state.logout === true) {
            return (
                <Redirect to={"/"}/>
            )
        }
        if (this.state.addPerson === true) {
            return (
                <Redirect to={"/add_person/" + this.state.id}/>
            )
        }

        if (this.state.addLocation === true) {
            return (
                <Redirect to={"/add_location/" + this.state.id}/>
            )
        }

        if (this.state.addLetter === true) {
            return (
                <Redirect to={"/add_letter/" + this.state.id}/>
            )
        }

        return (
            <div className='container letter'>
                {
                    this.state.isAuthenticated ?
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <form onSubmit={this.add_person} className='mt-5'>
                                        <input
                                            type="submit"
                                            className="btn btn-outline-success mybutton"
                                            value="Persoon toevoegen"
                                        />

                                    </form>
                                </td>
                                <td>
                                    <form onSubmit={this.add_letter} className='mt-5'>
                                        <input
                                            type="submit"
                                            className="btn btn-outline-success mybutton"
                                            value="Brief toevoegen"
                                        />

                                    </form>
                                </td>
                                <td>
                                    <form onSubmit={this.add_location} className='mt-5'>
                                        <input
                                            type="submit"
                                            className="btn btn-outline-success mybutton"
                                            value="Locatie toevoegen"
                                        />

                                    </form>
                                </td>
                                <td>
                                    <form onSubmit={this.logout} className='mt-5'>
                                        <input
                                            type="submit"
                                            className="btn btn-outline-success mybutton"
                                            value="Logout"
                                        />

                                    </form>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        : null}
            </div>

        )
    }
}

export default Admin