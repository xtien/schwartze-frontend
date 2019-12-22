import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL + ''

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
export const VISITOR = 'visitor'
export const ADMIN = 'admin'

class AuthenticationService {

    constructor(props) {
        this.registerSuccessfulLogin = this.registerSuccessfulLogin.bind(this);
    }

    executeLogin(username, password) {
        return axios.post(`${API_URL}/login`,
            { headers: {
                    'Content-Type': 'application/json',
                    authorization: this.createBasicAuthToken(username, password)
            } })
    }

    setAuthorities(authorities) {
        sessionStorage.setItem(VISITOR, authorities.includes("READ_PRIVILIGE"))
        sessionStorage.setItem(ADMIN, authorities.includes("WRITE_PRIVILIGE"))
    }

    isAdmin(){
        return sessionStorage.getItem(ADMIN);
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