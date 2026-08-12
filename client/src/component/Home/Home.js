import React, { Component } from 'react';
import Homeimage from "../Homeimage"
import Navber from '../Navber/Navber';
import './Home.css';

import Mandate from '../Mandate';
import Services from '../Services';
import Footer from '../Footer';
import HomeQuote from '../HomeQuote';
import Mission from '../Mission';


class Home extends Component {
    

    render() {
        return (
            <div className = "bg-dark">
                <Navber />
                <Homeimage/>
                <Mission/>
                <br>
                
                </br>
                
                <Mandate/>
                <br></br>
                <br></br>
                <Services/>
                <br/>
                <br/>
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

export default Home;
