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
            auth: false,
         }

        this.handleLinkSubmit = this.handleLinkSubmit.bind(this);
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handlePwChange = this.handlePwChange.bind(this);
    }

    handleLinkSubmit(event) {
        event.preventDefault();

        const username = this.state.username
        const password = this.state.password
        const self = this

        AuthenticationService
            .executeLogin(username, password)
            .then(response => {
                AuthenticationService.registerSuccessfulLogin(username, password);
                AuthenticationService.setAuthorities(response.data.authorities);
                self.setState({
                    auth: true
                })

                this.props.location.state.toggle()

            })
            .catch(error => {
                console.log(error)
            });
    }

    handleUserNameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePwChange(event) {
        this.setState({password: event.target.value});
    }

    render() {

        if (this.state.auth === true) {
            /*  toggle is used to render App.js to make the Admin menu option show  */
            this.props.location.toggle()

            return (
                <Redirect to={"/get_letters/"}/>
            )
        }

        return (
            <div>
                <form onSubmit={this.handleLinkSubmit}>
                    <div className="form-group">
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <div className="field">
                                        <label htmlFor="status">User name</label>
                                    </div>
                                </td>
                                <td>
                        <input
                            type="text"
                            className="form-control textarea ml-5"
                            id="username"
                            value={this.state.username}
                            onChange={this.handleUserNameChange}
                        />
                                </td>
                            </tr>
                            </tbody>
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
                       <input
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