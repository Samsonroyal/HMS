import React, { Component } from 'react';

import DashboardLayout from '../DashboardLayout';
import { employeeNav } from '../dashboardNav';
import Footer from '../Footer';
import Homeimage from '../Homeimage';

class EmpContact extends Component {
 
    render() { 
        return (
            
            <DashboardLayout title="Employee" items={employeeNav}>
            <div className="dash-role-page">
                <Homeimage/>
                <Footer/>
                </div>
            </DashboardLayout>
                );
    }
}
 
export default EmpContact;
