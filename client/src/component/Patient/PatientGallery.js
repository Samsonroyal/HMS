import React, { Component } from 'react';
import DashboardLayout from '../DashboardLayout';
import { patientNav } from '../dashboardNav';
import GalleryCarousel from '../GalleryCarousel';


class PatientGallery extends Component {
    
   
    render() { 
        return ( 
        <DashboardLayout title="Patient" items={patientNav}>
        <div className="dash-role-page">

            <br>
            </br>
            <GalleryCarousel/>
            
            
</div>
</DashboardLayout>

);
    }
}
 
export default PatientGallery;
