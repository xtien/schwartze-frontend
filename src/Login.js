import React from 'react'
import './App.css'
import './css/bootstrap.css'
import AuthenticationService from './service/AuthenticationService';
import {Redirect} from "react-router";

class Login extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            auth: false
        }

        this.handleLinkSubmit = this.handleLinkSubmit.bind(this);
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handlePwChange = this.handlePwChange.bind(this);
    }

    handleLinkSubmit(event) {
        event.preventDefault();

        AuthenticationService
            .executeLogin(this.state.username, this.state.password)
            .then(response => {
                AuthenticationService.registerSuccessfulLogin(this.state.username, this.state.password);
                AuthenticationService.setAuthorities(response.data.authorities);
                this.setState({
                    auth: true
                })
            })
    }

    handleUserNameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePwChange(event) {
        this.setState({password: event.target.value});
    }

    render() {

        if (this.state.auth === true) {
            return (
                <Redirect to={"/get_letters/"}/>
            )
        }

        return (
            <div>
                <form onSubmit={this.handleLinkSubmit}>
                    <div className="form-group">
                        <table>
                            <tr>
                                <td>
                                    <div className="field">
                                        <label htmlFor="status">User name</label>
                                    </div>
                                </td>
                                <td>
                        <textarea
                            type="text"
                            className="form-control textarea ml-5"
                            id="username"
                            value={this.state.username}
                            onChange={this.handleUserNameChange}
                        />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="form-group">
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <div className="field">
                                        <label htmlFor="status">Password</label></div>
                                </td>
                                <td>
                       <textarea
                           type="password"
                           className="form-control textarea ml-5"
                           id="password"
                           value={this.state.password}
                           onChange={this.handlePwChange}
                       />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <input
                        type="submit"
                        className="btn btn-outline-success mybutton"
                        value="Submit"
                    />
                </form>
            </div>
        );
    }
}

export default Login