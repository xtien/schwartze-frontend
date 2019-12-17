import React, {Component} from 'react'
import './App.css'
import './css/bootstrap.css'
import AuthenticationService from './service/AuthenticationService';

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
            AuthenticationService.registerSuccessfulLogin(this.state.username, this.state.password)
            this.props.history.push(`/get_letters/`)
        })
    }

    handleUserNameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePwChange(event) {
        this.setState({password: event.target.value});
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleLinkSubmit}>
                    <div className="form-group">
                        <label htmlFor="status">User name</label>
                        <textarea
                            type="text"
                            className="form-control textarea"
                            id="username"
                            value={this.state.username}
                            onChange={this.handleUserNameChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Password</label>
                        <textarea
                            type="password"
                            className="form-control textarea"
                            id="password"
                            value={this.state.password}
                            onChange={this.handlePwChange}
                        />
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