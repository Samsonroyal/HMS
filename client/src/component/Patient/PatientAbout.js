import React, { Component } from 'react';
import Navber from './PatientNavbar';
import { MDBContainer } from 'mdbreact';
import Homeimage from '../Homeimage';
import Footer from '../Footer';

class PatientAbout extends Component {
    
    render() { 
        return ( 
            <div className = "bg-dark">
                <Navber/>
                <Homeimage/>

                <br>
                
                </br>
                <br>
                
                </br>
                <h1 className="head text-white" align="center"> About Us </h1>
                <br>
                
                </br>
                <br>
                
                </br>

            <MDBContainer>  
            <blockquote className="blockquote">
            <p className="text-white"> Kiruddu National Referral Hospital is in the neighborhood of Kiruddu, on Buziga Hill, in Makindye Division, one of the five administrative units of the Kampala Capital City Authority. The hospital opened to the public on 16 May 2016.
            </p>
            </blockquote>

           
            </MDBContainer> 
            
            <br>
            
            
            </br>
            <Footer/>
        
            </div>
         );
    }
}
 
export default PatientAbout;