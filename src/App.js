import React, {Component} from 'react'
import './App.css'
import 'react-table/react-table.css'
import './css/bootstrap.css'
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import Person from './Person'
import Letters from './Letters'
import Letter from './Letter'
import Landing from './Landing'
import Location from './Location'

class App extends Component {

    // https://medium.com/@thejasonfile/basic-intro-to-react-router-v4-a08ae1ba5c42

    constructor() {
        super()
    }

    render() {

        return (

            <Router>
                <div className='container'>
                    <div className='jumbotron'>
                        <h1>Het nichtje van tante Therèse</h1>
                        <p><Link to='/'>Home</Link> <Link to='/get_letters/'>Letters</Link></p>
                    </div>
                    <div>
                        <Route exact path="/" component={Landing}/>
                        <Route path="/get_letters/" component={Letters}/>
                        <Route path="/get_location/:id" component={Location}/>
                        <Route path="/get_person_details/:id" component={Person}/>
                        <Route path="/get_letter_details/:number" component={Letter}/>
                    </div>
                </div>
            </Router>

        )
    }
}

export default App