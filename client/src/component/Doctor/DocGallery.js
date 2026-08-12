import React, { Component } from 'react';
import DashboardLayout from '../DashboardLayout';
import { doctorNav } from '../dashboardNav';
import GalleryCarousel from '../GalleryCarousel';


class DocGallery extends Component {
    
   
    render() { 
        return ( 
        <DashboardLayout title="Doctor" items={doctorNav}>
        <div className="dash-role-page">

            <br>
            </br>
            <GalleryCarousel/>
            
            
</div>
</DashboardLayout>

);
    }
}
 
export default DocGallery;
