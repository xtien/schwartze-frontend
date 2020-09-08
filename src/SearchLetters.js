import React, {Component} from 'react'
import './App.css'
import axios from "axios";
import './css/bootstrap.css'
import AuthenticationService from './service/AuthenticationService';
import {Link} from "react-router-dom";
import _ from "lodash";
import ReactTable from "react-table";

class SearchLetters extends Component {

    constructor(props) {
        super(props)

        this.state ={
            letters: [{}]
        }

        let postData = {
            search_term: props.match.params.search_term,
         };

        axios.post(process.env.REACT_APP_API_URL + '/search_letters/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    letters: response.data.letters,
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    render() {

        const columns = [{
            id: 'number',
            Header: '',
            accessor: data => {
                const nr = data.number;
                const linkto = '/get_letter_details/' + nr + '/0';
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
                    names.push(sender.nick_name + ' ' + sender.last_name);
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
                _.map(data.sender_location, location => {
                    const locationName = location.name;
                    locations.push(locationName);
                });
                const location_content = locations.join(', ');
                const linkTo = '/get_location_details/' + location_content;
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
                    names.push(recipient.nick_name + ' ' + recipient.last_name);
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
                let cell_ids = [];
                _.map(data.recipient_location, location => {
                    locations.push(location.name);
                    cell_ids.push(location.id);
                });
                const location_content = locations.join(', ');
                const id_content = cell_ids;
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

export default SearchLetters