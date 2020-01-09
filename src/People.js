import React, {Component} from 'react'
import axios from "axios";
import {Link} from "react-router-dom";
import ReactTable from "react-table";
import AuthenticationService from "./service/AuthenticationService";

class People extends Component {

    constructor() {
        super()

        this.state = {
            resultCode: -1,
            people: [{}],
            order_by: 'firstname',
        }

        this.sort = this.sort.bind(this);

        this.apiCall();
    }

    sort(event) {
        event.preventDefault();
        this.apiCall()
    }

    apiCall() {
        let postData = {
            requestCode: 0
        };

        let axiosConfig = AuthenticationService.getAxiosConfig();

        const url = process.env.REACT_APP_API_URL + (this.state.order_by === 'lastname' ? '/get_people_by_lastname/' : '/get_people/');
        const a = this.state.order_by;

        axios.post(url,
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    people: response.data.people,
                    order_by: a === 'lastname' ? 'firstname' : 'lastname'
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    render() {

        const columns = [{
            accessor: 'id',
            width: 40
        }, {
            id: 'name',
            accessor: data => {
                const id = data.id;
                const name = (data.first_name != null ? data.first_name : '') + " "
                    + (data.middle_name != null ? data.middle_name : '') + " "
                    + (data.tussenvoegsel != null ? data.tussenvoegsel : '') + " "
                    + (data.last_name != null ? data.last_name : '');
                const linkto = '/get_person_details/' + id;
                let result = <Link to={linkto}>{name}</Link>
                return result;
            },
            width: 300,
            className: 'text'
        }, {
            accessor: 'comment'

        }]

        return (

            <div>
                <form onSubmit={this.sort} className='ml-5 mb-2'>
                    <input
                        type="submit"
                        className="btn btn-outline-secondary mybutton"
                        value={this.state.order_by === 'lastname' ? 'op voornaam' : 'op achternaam'}
                    />

                </form>
                <div className='container'>
                    <ReactTable
                        data={this.state.people}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}

export default People