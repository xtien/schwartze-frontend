import React, {Component} from 'react'
import axios from "axios";
import _ from "lodash";
import {Link} from "react-router-dom";
import ReactTable from "react-table";
import AuthenticationService from "./service/AuthenticationService";
import {Redirect} from "react-router";

class Letters extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultCode: -1,
            data: ['a', 'b'],
            letters: [{}],
            order_by: 'number',
            search_term: '',
            go_search: false
        }

        this.sort = this.sort.bind(this);
        this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);

        let postData = {
            requestCode: 0
        };

        let axiosConfig = AuthenticationService.getAxiosConfig();

        const url = process.env.REACT_APP_API_URL + (this.state.order_by === 'number' ? '/get_letters/' : '/get_letters_by_date/');

        axios.post(url,
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    letters: response.data.letters,
                    order_by: 'date'
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    sort(event) {
        event.preventDefault();

        let postData = {
            requestCode: 0
        };

        let axiosConfig = AuthenticationService.getAxiosConfig();

        const url = process.env.REACT_APP_API_URL + (this.state.order_by === 'date' ? '/get_letters_by_date/' : '/get_letters/');
        const a = this.state.order_by;

        axios.post(url,
            postData,
            axiosConfig
        )
            .then(response =>
                this.setState({
                    resultCode: response.data.resultCode,
                    letters: response.data.letters,
                    order_by: a === 'number' ? 'date' : 'number'
                })
            )
            .catch(error => {
                console.log(error)
            });
    }

    handleSearchTermChange(event) {
        this.setState({search_term: event.target.value});
    }

    handleSearchSubmit(event) {
        event.preventDefault();

        this.setState({
            go_search: true
        })

    }

    render() {

        const search_term = this.state.search_term;
        const search_letters = '/search_letters/' + search_term;

        if (this.state.go_search === true) {
            this.setState({
                go_search: false
            })
            return <Redirect to={search_letters}/>
        }

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
                    names.push(sender.first_name + ' ' + (sender.tussenvoegsel != null ? (sender.tussenvoegsel + ' ') : '') + sender.last_name);
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
                    names.push(recipient.first_name + ' ' + (recipient.tussenvoegsel != null ? (recipient.tussenvoegsel + ' ') : '') + recipient.last_name);
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

            <div>
                <table width="100%">
                    <tbody>
                    <tr>
                        <td>
                            <form onSubmit={this.sort} className='ml-5 mb-2'>
                                <input
                                    type="submit"
                                    className="btn btn-outline-secondary mybutton"
                                    value={this.state.order_by === 'date' ? 'op nummer' : 'op datum'}
                                />

                            </form>
                        </td>
                        <td align="right">
                            <form onSubmit={this.handleSearchSubmit}>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>
                                        <div className='form-group searchfield mb-2 mr-2'>
                                             <input
                                                 type="text"
                                                 id="text"
                                                 value={this.state.text}
                                                 onChange={this.handleSearchTermChange}
                                                 className="form-control textarea"
                                             />
                                </div>
                                        </td>
                                        <td>
                                        <input
                                    type="submit"
                                    className='btn btn-outline-success mybutton mb-2 mr-5'
                                    value="Zoek"
                                 />                      </td>
                                    </tr>
                                    </tbody>
                                </table>

                            </form>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div className='container'>
                    <ReactTable
                        data={this.state.letters}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}

export default Letters