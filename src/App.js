/*
 * Copyright (c) 2018 - 2024, Zaphod Consulting BV, Christine Karman
 * This project is free software: you can redistribute it and/or modify it under the terms of
 * the Apache License, Version 2.0. You can find a copy of the license at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {Component} from 'react'
import './App.css'
import './css/bootstrap.css'
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import Person from './Person'
import AddPerson from './AddPerson'
import AddLetter from './AddLetter'
import DeleteLetter from "./DeleteLetter";
import EditLetter from './EditLetter'
import AddLocation from './AddLocation'
import Letters from './Letters.tsx'
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
import Topics from "./Topics"
import References from "./References";
import twitli from './images/logo.png'
import SearchLetters from "./SearchLetters";
import strings from './strings.js'
import Content from './Content.js'
import language from "./language";
import AuthenticationService from "./service/AuthenticationService";
import {About} from "./About";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            refreshPage: this.refreshPage,
            refresh: false,
        }
        language()
    }

    refreshPage = () => {
        this.setState({
            refresh: true
        })
    }


    render() {

        return (

            <Router>
                <div className='container'>
                    <div className="d-block d-sm-none">
                        <h1 className='px-5'>{strings.titel}</h1>
                        <table>
                            <tr>
                                <td>
                                    <p className='navbar-nav'><Link to='/'
                                                                    className='linkStyle'>{strings.home}</Link>
                                    </p>
                                </td>
                                <td>
                                    <p className='navbar-nav textStyle'><Link to='/get_letters/0'
                                                                              className='linkStyle'>{strings.letters}</Link>
                                    </p>
                                </td>
                                <td>
                                    <p className='navbar-nav textStyle'><Link to='/get_people/'
                                                                              className='linkStyle'>{strings.people}</Link>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className='navbar-nav textStyle'><Link to='/get_locations/'
                                                                              className='linkStyle'>{strings.locations}</Link>
                                    </p>
                                </td>
                                <p className='navbar-nav textStyle'><Link to='/references/'
                                                                          className='linkStyle'>{strings.references}</Link>
                                </p>
                                <td>
                                    <p className='navbar-nav textStyle'><Link to='/topics/'
                                                                              className='linkStyle'>{strings.topics}</Link>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className='navbar-nav textStyle'><Link to='/get_page/1/1'
                                                                              className='linkStyle'>{strings.pages}</Link>
                                    </p>
                                </td>
                                <td>
                                    {/* Admin should only be visible after login. toggle enables Login.js
                                               to render App.js by setting its state  */}
                                    {AuthenticationService.isAdmin() === 'true' ?
                                        <p className='navbar-nav textStyle'><Link to={'/admin/'}
                                                                                  className='linkStyle'>{strings.admin}</Link>
                                        </p>
                                        : null}
                                </td>
                                <td>
                                    <p className='navbar-nav textStyle'><Link to='/about/'
                                                                              className='linkStyle'>{strings.about}</Link>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="d-none d-sm-block">
                        <div className='jumbotron pb-2 pt-2'>
                            <table width="100%">
                                <tbody>
                                <tr>
                                    <td>
                                        <h1 className='px-5'>{strings.titel}</h1>
                                        <nav className="navbar navbar-expand-lg navbar-light px-5">
                                            <p className='navbar-nav'><Link to='/'
                                                                            className='linkStyle'>{strings.home}</Link>
                                            </p>
                                            <p className='navbar-nav textStyle'><Link to='/get_letters/0'
                                                                                      className='linkStyle'>{strings.letters}</Link>
                                            </p>
                                            <p className='navbar-nav textStyle'><Link to='/get_people/'
                                                                                      className='linkStyle'>{strings.people}</Link>
                                            </p>
                                            <p className='navbar-nav textStyle'><Link to='/get_locations/'
                                                                                      className='linkStyle'>{strings.locations}</Link>
                                            </p>
                                            <p className='navbar-nav textStyle'><Link to='/references/'
                                                                                      className='linkStyle'>{strings.references}</Link>
                                            </p>
                                            <p className='navbar-nav textStyle'><Link to='/topics/'
                                                                                      className='linkStyle'>{strings.topics}</Link>
                                            </p>
                                            <p className='navbar-nav textStyle'><Link to='/get_page/1/1'
                                                                                      className='linkStyle'>{strings.pages}</Link>
                                            </p>
                                            {/* Admin should only be visible after login. toggle enables Login.js
                                               to render App.js by setting its state  */}
                                            {AuthenticationService.isAdmin() === 'true' ?
                                                <p className='navbar-nav textStyle'><Link to={'/admin/'}
                                                                                          className='linkStyle'>{strings.admin}</Link>
                                                </p>
                                                : null}
                                            <p className='navbar-nav textStyle'><Link to='/about/'
                                                                                      className='linkStyle'>{strings.about}</Link>
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
                    </div>
                    <div className='content-container'>
                        <Routes>
                            <Route exact path="/" element={<Landing/>}/>
                            <Route path="/admin/" element={<Admin/>}/>
                            <Route path="/login/" element={<Login/>}/>
                            <Route path="/signup/" element={<Signup/>}/>
                            <Route path="/get_letters/:page" element={<Letters/>}/>
                            <Route path="/add_person/" element={<AddPerson/>}/>
                            <Route path="/add_letter/" element={<AddLetter/>}/>
                            <Route path="/edit_letter/:number" element={<EditLetter/>}/>
                            <Route path="/delete_letter/:number" element={<DeleteLetter/>}/>
                            <Route path="/add_location/" element={<AddLocation/>}/>
                            <Route path="/combine_person/:id" element={<CombinePerson/>}/>
                            <Route path="/combine_location/:id" element={<CombineLocation/>}/>
                            <Route path="/get_location_details/:id" element={<Location/>}/>
                            <Route path="/get_letters_for_location/:id" element={<LettersForLocation/>}/>
                            <Route path="/get_person_details/:id" element={<Person/>}/>
                            <Route path="/get_letter_details/:number/:pagenumber" element={<Letter/>}/>
                            <Route path="/get_letters_from_person/:id" element={<PersonFromLetters/>}/>
                            <Route path="/get_letters_to_person/:id" element={<PersonToLetters/>}/>
                            <Route path="/get_text/:entity/:id" element={<Text/>}/>
                            <Route path="/get_page/:chapterNumber/:pageNumber" element={<Page/>}/>
                            <Route path="/edit_text/:type/:id" element={<TextEdit/>}/>
                            <Route path="/get_locations/" element={<Locations/>}/>
                            <Route path="/get_people/" element={<People/>}/>
                            <Route path="/references/" element={<References/>}/>
                            <Route path="/topics/" element={<Topics/>}/>
                            <Route path="/search_letters/:search_term" element={<SearchLetters/>}/>
                            <Route path="/get_content/" element={<Content/>}/>
                            <Route path="/about/" element={<About/>}/>
                        </Routes>
                    </div>
                </div>
            </Router>
        )
    }
}

export default App
