import React, { Component } from 'react';
import DashboardLayout from '../DashboardLayout';
import { patientNav } from '../dashboardNav';
import { MDBContainer } from 'mdbreact';
import Homeimage from '../Homeimage';

class PatientAbout extends Component {
    
    render() { 
        return ( 
            <DashboardLayout title="Patient" items={patientNav}>
            <div className = "dash-role-page">
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
        
            </div>
            </DashboardLayout>
         );
    }
}
 
export default PatientAbout;
