/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

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
