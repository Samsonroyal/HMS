import React from 'react';
import DashboardHome from '../DashboardHome';
import { adminNav } from '../dashboardNav';

function AdHome() { return <DashboardHome title="Admin" items={adminNav} />; }

export default AdHome;
