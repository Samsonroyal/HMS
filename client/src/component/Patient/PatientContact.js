import React, { Component } from 'react';

import DashboardLayout from '../DashboardLayout';
import { patientNav } from '../dashboardNav';
import Footer from '../Footer';
import Homeimage from '../Homeimage';

class PatientContact extends Component {
 
    render() { 
        return (
            
            <DashboardLayout title="Patient" items={patientNav}>
            <div className="dash-role-page">
                <Homeimage/>
                <Footer/>
                </div>
            </DashboardLayout>
                );
    }
}
 
export default  PatientContact;
