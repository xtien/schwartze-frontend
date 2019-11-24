import React, {Component} from 'react'
import './App.css'
import './css/bootstrap.css'
import axios from "axios";
import {Link} from "react-router-dom";

class CombinePerson extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultCode: -1,
            data: {},
            showEdit: false,
            first_id: props.match.params.id,
            second_id: 0
        }
    }

    handleFirstPersonChange(event) {
        this.setState({first_id: event.target.value});
    }

    handleSecondPersonChange(event) {
        this.setState({second_id: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        let postData = {
            person1: this.state.first_id,
            person2: this.state.second_id
        };

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            }
        };

        axios.post('https://pengo.christine.nl:8443/get_combine_person/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    person1: response.data.person1,
                    person2: response.data.person2,
                    editDone: true
                })
            );
    }

    render() {

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group row">
                    <label htmlFor="status" class="col-sm-2 col-form-label">Persoon nummer</label>
                    <div className="col-sm-2"><input
                        type="text"
                        pattern="[0-9]*"
                        className="form-control textarea"
                        id="first_person"
                        value={this.state.first_id}
                        onChange={this.handleFirstPersonChange}
                    /></div>
                </div>
                <div className="form-group row">
                    <label htmlFor="status"class="col-sm-2 col-form-label">Te combineren met</label>
                    <div className="col-sm-2"><input
                        type="text"
                        pattern="[0-9]*"
                        className="form-control textarea"
                        id="first_person"
                        value={this.state.second_id}
                        onChange={this.handleSecondPersonChange}
                    /></div>
                </div>
            </form>
        )

    }

}

class CombinePersonForm
    extends React
        .Component {

    constructor(props) {
        super(props);

        this.state = {
            id1: this.props.id1,
            id2: this.props.id2,
            redirect: false
        }

    }

    combine() {

        let postData = {
            requestCode: 0,
            id1: this.state.person1.id,
            id2: this.state.person2.id
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post('https://pengo.christine.nl:8443/put_combine_person/',
            postData,
            axiosConfig
        )
            .then(response => {
                    this.setState({
                        redirect: true
                    })
                }
            )

    }

    not() {
        this.setState({redirect: true})
    }

    render() {

        if (this.state.redirect) {
            return (
                <Link to={"get_person/" + this.state.person1.id}/>
            )
        }

        const person1 = this.state.person1
        const person2 = this.state.person2

        return (
            <form className="letter text-black-50">
                <div>
                    <p>
                        {person1.id} {person1.first_name} {person1.middle_name} {person1.last_name}
                    </p>
                </div>
                <div>
                    <p>
                        {person2.id} {person2.first_name} {person2.middle_name} {person2.last_name}
                    </p>
                </div>

                <div>
                    <button
                        className="btn btn-outline-success mybutton"
                        onClick={this.combine}
                        value="Combineren">
                    </button>
                    <button
                        className="btn btn-outline-danger mybutton"
                        onClick={this.not}
                        value="Niet doen">
                    </button>

                </div>
            </form>

        )
    }
}

export default CombinePerson