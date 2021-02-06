import React, {Component} from 'react'
import './css/bootstrap.css'
import axios from "axios";
import AuthenticationService from "./service/AuthenticationService";

class Landing extends Component {

    // https://medium.com/@thejasonfile/basic-intro-to-react-router-v4-a08ae1ba5c42

    constructor() {
        super()

        this.state = {
            home_text: '',
            blog_text: ''
        }

        let postData = {
            text_id: 'home',
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_page_text/',
            postData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    home_text: response.data.text,
                })
            )
            .catch(error => {
                console.log(error)
            });

        let pData = {
            text_id: 'blog',
        };

        axios.post(process.env.REACT_APP_API_URL + '/get_page_text/',
            pData,
            AuthenticationService.getAxiosConfig()
        )
            .then(response =>
                this.setState({
                    blog_text: response.data.text,
                })
            )
            .catch(error => {
                console.log(error)
            });

    }

    render() {

        const home_text = this.state.home_text;
        const blog_text = this.state.blog_text;

        return (

            <div className='container'>
                <div className='photo'>
                    <img alt="briefkaart lizzy" src="https://www.lizzyansingh.nl/pics/32-1.jpg"
                    />
                </div>
                <div className='textpage mt-5 ml-5'>
                    {/* TODO: this needs to change when others than myself get access to data entry */}

                    <div dangerouslySetInnerHTML={{__html: home_text}}/>
                </div>
                <div className='textpage mt-5 ml-5'>
                    <div>
                        {/* TODO: this needs to change when others than myself get access to data entry */}
                            <div dangerouslySetInnerHTML={{__html: blog_text}}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Landing
