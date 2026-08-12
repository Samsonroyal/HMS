import React, { Component } from 'react';
import DashboardLayout from '../DashboardLayout';
import { adminNav } from '../dashboardNav';
import GalleryCarousel from '../GalleryCarousel';


class AdminGallery extends Component {
    
   
    render() { 
        return ( 
        <DashboardLayout title="Admin" items={adminNav}>
        <div className="dash-role-page">

            <br>
            </br>
            <GalleryCarousel/>
            
            
</div>
</DashboardLayout>

);
    }
}
 
export default AdminGallery;
