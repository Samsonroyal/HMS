import React, { Component } from 'react';
import DashboardLayout from '../DashboardLayout';
import { adminNav } from '../dashboardNav';
import Footer from '../Footer';
import Homeimage from '../Homeimage';

class AdminContact extends Component {
 
    render() { 
        return (
            
            <DashboardLayout title="Admin" items={adminNav}>
            <div className="dash-role-page">
                <Homeimage/>
                <Footer/>
                </div>
            </DashboardLayout>
                );
    }
}
 
export default AdminContact;
