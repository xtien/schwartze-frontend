import React, {Component} from 'react'
import './css/bootstrap.css'
import AuthenticationService from "./service/AuthenticationService";
import {Redirect} from "react-router-dom";

class Admin extends Component {

    constructor(props) {
        super(props)

        const isAuthenticated = AuthenticationService.isUserLoggedIn();

        this.state = {
            isAuthenticated: isAuthenticated,
            addLetter: false,
            addPerson: false,
            addLocation: false
        }
        this.add_location = this.add_location.bind(this);
        this.add_person = this.add_person.bind(this);
        this.add_letter = this.add_letter.bind(this);
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

    render() {

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
                            </tr>
                        </table>
                        : null}
            </div>

        )
    }
}

export default Admin