import strings from './strings.js'
import language from "./language";
import {Link} from "react-router-dom";

export function About() {

    language()

    return (
        <div>
            <div className="mt4 m-lg-5">{strings.aboutText}</div>
            <div className="m-lg-5">{strings.siteVersion} {process.env.REACT_APP_VERSION}</div>
            <div className="m-lg-5"><Link to={"/get_page/1/1"}>{strings.more}</Link></div>
        </div>
    )
}
