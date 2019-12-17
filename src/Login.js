import './App.css'
import './css/bootstrap.css'
import axios from "axios";
import {Link} from "react-router-dom";
import {Card, Logo, Form, Input, Button} from '../components/AuthForms';

class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {}

    }

    render() {
        return (
            <Card>
                <Logo src={logoImg}/>
                <Form>
                    <Input type="email" placeholder="email"/>
                    <Input type="password" placeholder="password"/>
                    <Input type="password" placeholder="password again"/>
                    <Button>Sign Up</Button>
                </Form>
                <Link to="/signup">Don't have an account?</Link>
            </Card>
        );
    }
}

export default Login