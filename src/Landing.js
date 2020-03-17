import React, {Component} from 'react'
import './css/bootstrap.css'

class Landing extends Component {

    // https://medium.com/@thejasonfile/basic-intro-to-react-router-v4-a08ae1ba5c42

    constructor() {
        super()

        this.state = {}
    }

    render() {

        return (

            <div className='container'>
                <div className='photo'>
                    <img alt="schilderij lizzy" src="https://www.lizzyansingh.nl/pics/32-1.jpg" height="400" />
                 </div>
                 <div className='text'><p >
                    Thérèse Schwartze was de eerste vrouw in ons land die met portretschilderen
                    de kost kon verdienen. Haar nichtje, Lizzy Ansingh, leerde al snel tekenen en schilderen
                    van haar tante. Thérèse's zuster, Georgina, was beelhouwster, hun broer George Washington
                    tekende en schilderde, maar raakte al jong in een psychiatrische inrichting verzeild waar
                    hij verder geen werken van belang meer maakte.</p>

                   <p> Mijn vader kocht jaren geleden op een postzegelveiling twee doosjes met brieven van de
                    familie Schwartze-Ansingh. Hij begon er een studie van te maken, en na zijn dood heb ik de doosjes
                    gekregen en ben ik verder gegaan met de studie. Op deze site vind je mijn bevindingen,
                    en mijn weergave van het leven van de families Schwartze en Ansingh van 1880 tot 1940.
                </p></div>
            </div>
        )
    }
}

export default Landing