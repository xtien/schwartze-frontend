import React, {Component} from 'react'
import './App.css'
import 'react-table/react-table.css'
import './css/bootstrap.css'
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import Person from './Person'
import AddPerson from './AddPerson'
import AddLetter from './AddLetter'
import AddLocation from './AddLocation'
import Letters from './Letters'
import Letter from './Letter'
import Landing from './Landing'
import Location from './Location'
import PersonToLetters from './PersonToLetters'
import PersonFromLetters from './PersonFromLetters'
import CombinePerson from './CombinePerson'
import CombineLocation from './CombineLocation'
import Text from './Text'
import TextEdit from './TextEdit'
import Login from "./Login";
import Signup from "./Signup";
import Admin from "./Admin";
import Locations from "./Locations"
import People from "./People"
import AuthenticationService from "./service/AuthenticationService";

class App extends Component {

    constructor(props) {
        super(props)

        const isAuthenticated = AuthenticationService.isUserLoggedIn();

        this.state = {
            isAuthenticated: isAuthenticated
        }
    }

    render() {

        return (

            <Router>
                <div className='container'>
                    <div className='jumbotron'>
                        <h1>Het nichtje van tante Therèse</h1>
                        <nav className="navbar navbar-expand-lg navbar-light">
                            <p className="navbar-nav"><Link to='/'>Home</Link></p>
                            <p className="navbar-nav"><Link to='/get_letters/'>Brieven</Link></p>
                            <p className="navbar-nav"><Link to='/get_people/'>Personen</Link></p>
                            <p className="navbar-nav"><Link to='/get_locations/'>Locaties</Link></p>
                            {this.state.isAuthenticated ?
                                <p className="navbar-nav"><Link to='/admin/'>Admin</Link></p>
                                :
                                <p className="navbar-nav"><Link to='/login/'>Login</Link></p>
                            }
                        </nav>
                    </div>
                    <div>
                        <Route exact path="/" component={Landing}/>
                        <Route path="/admin/" component={Admin}/>
                        <Route path="/login/" component={Login}/>
                        <Route path="/signup/" component={Signup}/>
                        <Route path="/get_letters/" component={Letters}/>
                        <Route path="/add_person/" component={AddPerson}/>
                        <Route path="/add_letter/" component={AddLetter}/>
                        <Route path="/add_location/" component={AddLocation}/>
                        <Route path="/combine_person/:id" component={CombinePerson}/>
                        <Route path="/combine_location/:id" component={CombineLocation}/>
                        <Route path="/get_location/:id" component={Location}/>
                        <Route path="/get_person_details/:id" component={Person}/>
                        <Route path="/get_letter_details/:number" component={Letter}/>
                        <Route path="/get_letters_from_person/:id" component={PersonFromLetters}/>
                        <Route path="/get_letters_to_person/:id" component={PersonToLetters}/>
                        <Route path="/get_text/:id" component={Text}/>
                        <Route path="/edit_text/" component={TextEdit}/>
                        <Route path="/get_locations/" component={Locations}/>
                        <Route path="/get_people/" component={People}/>
                    </div>
                </div>
            </Router>
        )
    }
}

export default App