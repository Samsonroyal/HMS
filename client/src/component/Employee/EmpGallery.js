import React, { Component } from 'react';
import DashboardLayout from '../DashboardLayout';
import { employeeNav } from '../dashboardNav';
import GalleryCarousel from '../GalleryCarousel';


class EmpGallery extends Component {
    
   
    render() { 
        return ( 
        <DashboardLayout title="Employee" items={employeeNav}>
        <div className="dash-role-page">

            <br>
            </br>
            <GalleryCarousel/>
            
            
</div>
</DashboardLayout>

);
    }
}
 
export default EmpGallery;
