import React, { Component } from 'react';
import DashboardLayout from '../DashboardLayout';
import { adminNav } from '../dashboardNav';
import { MDBContainer } from 'mdbreact';

import Homeimage from '../Homeimage';

class AdminAbout extends Component {
    
    render() { 
        return ( 
            <DashboardLayout title="Admin" items={adminNav}>
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

            The hospital is highly regarded for Nephrology &amp; Dialysis, with a kidney disease unit equipped with 30 functional dialysis machines executing 45-60 life-saving sessions daily; Burns and Plastic Surgery, home to Uganda's only specialized national ward dedicated explicitly to burn treatments; Infectious Diseases, housing the largest dedicated infectious disease ward in the nation; and Diagnostics &amp; Imaging, offering automated lab processing, CT scans, X-rays, fluoroscopy, ultrasound, and endoscopy services. As a public national facility, general consultations, treatments, and select medications are provided free of charge or at a very low subsidized cost for Ugandan citizens. The hospital is open 24 hours, 7 days a week, serving 300 to 500 patients daily across 200 inpatient beds and 14 specialized outpatient clinics.
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
 
export default AdminAbout;
