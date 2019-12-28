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
            people: [{}]
        }

        let postData = {
            requestCode: 0
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_people/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    people: response.data.people
                })
            )
    }

    render() {

        const columns = [{
            accessor: 'id',
            width: 40
        }, {
            id: 'name',
            accessor: data => {
                const id = data.id;
                const name = data.first_name + " " + data.middle_name + " " + data.last_name;
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
            <div className='container'>
                <ReactTable
                    data={this.state.people}
                    columns={columns}
                />
            </div>
        )


    }
}

export default People