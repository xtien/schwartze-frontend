import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
export const VISITOR = 'visitor'
export const ADMIN = 'admin'
export const AUTH1 = 'auth1'
export const AUTH2 = 'auth2'

class AuthenticationService {

    constructor(props) {
        this.registerSuccessfulLogin = this.registerSuccessfulLogin.bind(this);
    }

    executeLogin(username, password) {
        return axios.post(`${API_URL}/login`,
            {
                auth: {
                    username: username,
                    password: password
                }
            })
    }

    setAuthorities(authorities) {
        sessionStorage.setItem(VISITOR, authorities.includes("READ_PRIVILIGE"))
        sessionStorage.setItem(ADMIN, authorities.includes("WRITE_PRIVILIGE"))
    }

    isAdmin() {
        return sessionStorage.getItem(ADMIN);
    }

    setAuth(username, password) {
        sessionStorage.setItem(AUTH1, username)
        sessionStorage.setItem(AUTH2, password)
    }

    getAuth1() {
        return sessionStorage.getItem(AUTH1)
    }

    getAuth2() {
        return sessionStorage.getItem(AUTH2)
    }

    getAuth() {
        return {
            authorization: this.createBasicAuthToken(this.getAuth1(), this.getAuth2())
        }
    }

    getAxiosConfig() {
        return {
            headers: {
                "Content-Type": "application/json",
            },
            auth: ((this.getAuth1() != null && this.getAuth2() != null) ? this.getAuth() : null
            )
        }
    }

    createBasicAuthToken(username, password) {
        return window.btoa(username + ":" + password)
    }

    registerSuccessfulLogin(username, password) {
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
        this.setupAxiosInterceptors(this.createBasicAuthToken(username, password))
        this.setAuth(username, password)
    }

    logout() {
        sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        sessionStorage.removeItem(AUTH1);
        sessionStorage.removeItem(AUTH2);
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