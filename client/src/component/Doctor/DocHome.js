import React from 'react';
import DashboardHome from '../DashboardHome';
import { doctorNav } from '../dashboardNav';

export default function DocHome() { return <DashboardHome title="Doctor" items={doctorNav} />; }
