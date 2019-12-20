import React, {Component} from 'react'
import axios from "axios";
import _ from "lodash";
import {Link} from "react-router-dom";
import ReactTable from "react-table";

class Letters extends Component {

    constructor() {
        super()

        this.state = {
            resultCode: -1,
            data: ['a', 'b'],
            letters: [{}]
        }

        let postData = {
            requestCode: 0
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_letters/',
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    letters: response.data.letters
                })
            )
    }

    render() {

        const columns = [{
            id: 'number',
            Header: '',
            accessor: data => {
                const nr = data.number;
                const linkto = '/get_letter_details/' + nr;
                let result = <Link to={linkto}>{nr}</Link>
                return result;
            },
            width: 50,
            className: 'text-right'
        }, {
            Header: 'sender ',
            id: 'senders',
            accessor: data => {
                let names = [];
                let cell_ids = [];
                _.map(data.senders, sender => {
                    names.push(sender.first_name + ' ' + sender.last_name);
                    cell_ids.push(sender.id);
                });
                const name_content = names[0];
                const id_content = cell_ids[0];
                const linkto = '/get_person_details/' + id_content;
                let result = <Link to={linkto}>{name_content}</Link>
                return result;
            },
        }, {
            Header: 'location',
            id: 'sender_location',
            accessor: data => {
                let locations = [];
                let ids = [];
                _.map(data.sender_location, location => {
                     locations.push(location.location_name);
                     ids.push(location.id);
                });
                const location_content = locations[0];
                const id_content = ids[0];
                const linkTo = '/get_location_details/' + id_content;
                let result = <Link to={linkTo}>{location_content}</Link>
                return result;
            },
        }, {
            Header: 'recipient ',
            id: 'recipients',
            accessor: data => {
                let names = [];
                let cell_ids = [];
                _.map(data.recipients, recipient => {
                    names.push(recipient.first_name + ' ' + recipient.last_name);
                    cell_ids.push(recipient.id);
                });
                const name_content = names.join(', ');
                const id_content = cell_ids;
                const linkto = '/get_person_details/' + id_content;
                let result = <Link to={linkto}>{name_content}</Link>
                return result;
            },
        }, {
            Header: 'location',
            id: 'recipient_location',
            accessor: data => {
                let locations = [];
                let ids = [];
                _.map(data.recipient_location, location => {
                    locations.push(location.location_name);
                    ids.push(location.id);
                });
                const location_content = locations[0];
                const id_content = ids[0];
                const linkTo = '/get_location_details/' + id_content;
                let result = <Link to={linkTo}>{location_content}</Link>
                return result;
            },
        }, {
            Header: 'remarks',
            accessor: 'remarks',
        }, {
            Header: 'date',
            accessor: 'date'
        }]

        return (
            <div className='container'>
                <ReactTable
                    data={this.state.letters}
                    columns={columns}
                />
            </div>
        )
    }
}

export default Letters