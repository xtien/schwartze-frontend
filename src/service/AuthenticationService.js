import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL + ''

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
export const AUTHORITIES = 'authorities'

class AuthenticationService {

    constructor(props) {
        this.registerSuccessfulLogin = this.registerSuccessfulLogin.bind(this);
    }

    executeLogin(username, password) {

        let postData = {
            userName: username,
            password: password
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        return axios.post(process.env.REACT_APP_API_URL + '/login/',
            postData,
            axiosConfig
        )
            .then(response => {
                    this.registerSuccessfulLogin(username, password);
                    this.setAuthorities(response.data.authorities);
                }
            )
    }

    setAuthorities(authorities) {
        sessionStorage.setItem(AUTHORITIES, authorities)
    }

    createBasicAuthToken(username, password) {
        return 'Basic ' + window.btoa(username + ":" + password)
    }

    registerSuccessfulLogin(username, password) {
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
        this.setupAxiosInterceptors(this.createBasicAuthToken(username, password))
    }

    logout() {
        sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) {
            return false
        } else {
            return true
        }
    }

    getLoggedInUserName() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) {
            return ''
        } else {
            return user
        }
    }

    setupAxiosInterceptors(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                return config
            }
        )
    }
}

export default new AuthenticationService()