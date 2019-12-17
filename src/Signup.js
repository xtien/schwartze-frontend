import React, {Component} from 'react'
import './App.css'
import './css/bootstrap.css'
import {Link} from "react-router-dom";

class Signup extends Component {

    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <div>
                <form>
                    <input type="email" placeholder="email"/>
                    <input type="password" placeholder="password"/>
                    <input type="password" placeholder="password again"/>
                    <button>Sign Up</button>
                </form>
                <Link to="/login">Already have an account?</Link>
            </div>
        );

    }
}

export default Signup