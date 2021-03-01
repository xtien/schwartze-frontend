/*
 * Copyright (c) 2018 - 2021, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import './App.css'
import 'react-table/react-table.css'
import './css/bootstrap.css'
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import Person from './Person'
import AddPerson from './AddPerson'
import AddLetter from './AddLetter'
import DeleteLetter from "./DeleteLetter";
import EditLetter from './EditLetter'
import AddLocation from './AddLocation'
import Letters from './Letters'
import Letter from './Letter'
import Landing from './Landing'
import Location from './Location'
import PersonToLetters from './PersonToLetters'
import PersonFromLetters from './PersonFromLetters'
import CombinePerson from './CombinePerson'
import CombineLocation from './CombineLocation'
import LettersForLocation from "./LettersForLocation";
import Text from './Text'
import Page from './Page'
import TextEdit from './TextEdit'
import Login from "./Login";
import Signup from "./Signup";
import Admin from "./Admin";
import Locations from "./Locations"
import People from "./People"
import Subjects from "./Subjects"
import References from "./References";
import twitli from './images/logo.png'
import AuthenticationService from "./service/AuthenticationService";
import SearchLetters from "./SearchLetters";
import detectBrowserLanguage from 'detect-browser-language'
import strings from './strings.js'
import NotFound from "./NotFound";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            refreshPage: this.refreshPage,
            refresh: false,
         }
        strings.setLanguage(detectBrowserLanguage().substring(0,2));
    }

    refreshPage = () => {
        this.setState({
            refresh: true
        })
    }


    render() {

        let home = strings.home;
        const refreshPage = this.refreshPage;

        return (

            <Router>
                <div className='container '>
                    <div className='jumbotron'>
                        <table width="100%">
                            <tbody>
                            <tr>
                                <td>
                                    <h1>Het nichtje van tante Thérèse</h1>
                                    <nav className="navbar navbar-expand-lg navbar-light">
                                        <p className="navbar-nav"><Link to='/'>{strings.home}</Link></p>
                                        <p className="navbar-nav"><Link to='/get_letters/0'>{strings.letters}</Link></p>
                                        <p className="navbar-nav"><Link to='/get_people/'>{strings.people}</Link></p>
                                        <p className="navbar-nav"><Link to='/get_locations/'>{strings.locations}</Link></p>
                                        <p className="navbar-nav"><Link to='/references/'>{strings.references}</Link></p>
                                        <p className="navbar-nav"><Link to='/subjects/'>{strings.subjects}</Link></p>
                                        <p className="navbar-nav"><Link to='/get_page/1/1'>{strings.pages}</Link></p>
                                        {/* Admin should only be visible after login. toggle enables Login.js
                                               to render App.js by setting its state  */}
                                        {AuthenticationService.isAdmin() === 'true' ?
                                            <p className="navbar-nav"><Link to={'/admin/'}>Admin</Link>
                                            </p>
                                            : null}
                                        <p className="navbar-nav"><Link to={{
                                            pathname: '/login/',
                                            toggle: refreshPage
                                        }}>Login</Link>
                                        </p>
                                    </nav>
                                </td>
                                <td>
                                    <img src={twitli} className="logo" alt="logo"/>
                                 </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <Route exact path="/" component={Landing}/>
                        <Route path="/admin/" component={Admin}/>
                        <Route path="/login/" component={Login}/>
                        <Route path="/signup/" component={Signup}/>
                        <Route path="/get_letters/:page" component={Letters}/>
                        <Route path="/add_person/" component={AddPerson}/>
                        <Route path="/add_letter/" component={AddLetter}/>
                        <Route path="/edit_letter/:number" component={EditLetter}/>
                        <Route path="/delete_letter/:number" component={DeleteLetter}/>
                        <Route path="/add_location/" component={AddLocation}/>
                        <Route path="/combine_person/:id" component={CombinePerson}/>
                        <Route path="/combine_location/:id" component={CombineLocation}/>
                        <Route path="/get_location_details/:id" component={Location}/>
                        <Route path="/get_letters_for_location/:id" component={LettersForLocation}/>
                        <Route path="/get_person_details/:id" component={Person}/>
                        <Route path="/get_letter_details/:number/:pagenumber" component={Letter}/>
                        <Route path="/get_letters_from_person/:id" component={PersonFromLetters}/>
                        <Route path="/get_letters_to_person/:id" component={PersonToLetters}/>
                        <Route path="/get_text/:entity/:id" component={Text}/>
                        <Route path="/get_page/:chapterNumber/:pageNumber" component={Page}/>
                        <Route path="/edit_text/" component={TextEdit}/>
                        <Route path="/get_locations/" component={Locations}/>
                        <Route path="/get_people/" component={People}/>
                        <Route path="/references/" component={References}/>
                        <Route path="/subjects/" component={Subjects}/>
                        <Route path="/search_letters/:search_term" component={SearchLetters}/>
                    </div>
                </div>
            </Router>
        )
    }
}

export default App
