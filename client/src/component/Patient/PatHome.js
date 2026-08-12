import React, { Component } from 'react';
import Mandate from '../Mandate'
import Navber from './PatientNavbar';
import '../Home/Home.css';
import HomeQuote from '../HomeQuote';
import Homeimage from '../Homeimage';
import Footer from '../Footer';
import Mission from '../Mission';

class PatHome extends Component {
    render() {
        return (
            <div className="bg-dark">
                <Navber />
                <Homeimage/>
                <Mission/>
                <br>
                </br>
                <br>
                </br>
                <h1 className="head text-white" align="center"> Our Mandate </h1>
                <br>
                
                </br>
                <br>
                
                </br>
                <br/>
                <br/>
                <Mandate/>
                <br></br>
                <br></br>
                <h1 className="text-white" align="center">Latest News</h1>
                <br/>
                <br/>
                <HomeQuote/>
                <br/>
                <br/>
                  
                <Footer/>
               
            </div>
        );
    }
}

export default PatHome;
