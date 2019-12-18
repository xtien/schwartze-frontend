import React, {Component} from 'react'
import axios from "axios";
import _ from "lodash";
import {Link} from "react-router-dom";
import ReactTable from "react-table";

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

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post('https://pengo.christine.nl:8443/get_people/',
            postData,
            axiosConfig
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