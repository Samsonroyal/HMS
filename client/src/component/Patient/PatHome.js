import React from 'react';
import DashboardHome from '../DashboardHome';
import { patientNav } from '../dashboardNav';

export default function PatHome() { return <DashboardHome title="Patient" items={patientNav} />; }
