import React, {Component} from 'react'
import axios from "axios";
import _ from "lodash";
import {Link} from "react-router-dom";
import ReactTable from "react-table";

class Locations extends Component {

    constructor() {
        super()

        this.state = {
            resultCode: -1,
            data: ['a', 'b'],
            locations: [{}]
        }

        let postData = {
            requestCode: 0
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_locations/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    locations: response.data.locations
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
                const name = data.location_name;
                const linkto = '/get_location_details/' + id;
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
                    data={this.state.locations}
                    columns={columns}
                />
            </div>
        )



    }
}

export default Locations