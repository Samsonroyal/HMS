import React, { Component } from 'react';
import DashboardLayout from '../DashboardLayout';
import { doctorNav } from '../dashboardNav';
import Footer from '../Footer';
import Homeimage from '../Homeimage';

class DocContact extends Component {
 
    render() { 
        return (
            
            <DashboardLayout title="Doctor" items={doctorNav}>
            <div className="dash-role-page">
                <Homeimage/>
                <Footer/>
                </div>
            </DashboardLayout>
                );
    }
}
 
export default DocContact;
