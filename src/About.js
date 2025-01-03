import strings from './strings.js'
import language from "./language";
import {Link} from "react-router-dom";

export function About() {

    language()

    return (
        <div>
            <div className="textpage mt-5 m-lg-5"><p>{strings.aboutText}</p></div>
            <div className="textpage m-lg-5">{strings.siteVersion} {process.env.REACT_APP_VERSION}</div>
            <div className="textpage m-lg-5"><Link to={"/get_page/1/1"}>{strings.more_about_site}</Link></div>
            <div className="textpage m-lg-5"><a href="https://christine.nl/about">{strings.aboutChristine}</a></div>
        </div>
    )
}
