import React from 'react';
import DashboardHome from '../DashboardHome';
import { employeeNav } from '../dashboardNav';

export default function EmpHome() { return <DashboardHome title="Employee" items={employeeNav} />; }
