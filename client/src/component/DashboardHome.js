import React from 'react';
import DashboardLayout from './DashboardLayout';
import './Dashboard.css';

const stats = [
  { label: 'Patients', value: '1,284', change: '+12.8%', icon: 'users' },
  { label: 'Appointments', value: '248', change: '+8.4%', icon: 'calendar' },
  { label: 'Doctors', value: '64', change: '+4.2%', icon: 'user' },
  { label: 'Prescriptions', value: '892', change: '+16.1%', icon: 'clipboard' }
];

const appointments = [
  ['Sarah Kato', 'Dr. Miriam Namusoke', '09:30 AM', 'Confirmed'],
  ['Robert Ssekandi', 'Dr. James Okello', '11:00 AM', 'Pending'],
  ['Grace Achieng', 'Dr. Miriam Namusoke', '02:15 PM', 'Confirmed'],
  ['Daniel Ouma', 'Dr. Peter Mukiibi', '04:00 PM', 'Completed']
];

function DashboardHome({ title, items }) {
  const appointmentItem = items.find(item => item.icon === 'calendar');
  const primaryPath = appointmentItem ? appointmentItem.path : items[0].path;

  return (
    <DashboardLayout title={title} items={items}>
      <header className="dash-header">
        <div>
          <p className="dash-eyebrow">Overview</p>
          <h1 className="dash-title">Good morning, {title}</h1>
          <p className="dash-subtitle">Here’s what’s happening at Kiruddu National Referral Hospital today.</p>
        </div>
        <a className="dash-primary-button" href={primaryPath}>
          {appointmentItem ? '+ New appointment' : 'Open workspace'}
        </a>
      </header>

      <section className="dash-kpis" aria-label="Hospital statistics">
        {stats.map(stat => (
          <article className="dash-kpi" key={stat.label}>
            <div className={`dash-kpi-icon ${stat.icon}`}>{stat.label.slice(0, 1)}</div>
            <span className="dash-kpi-label">{stat.label}</span>
            <strong className="dash-kpi-value">{stat.value}</strong>
            <span className="dash-kpi-trend">↗ {stat.change} <small>this month</small></span>
          </article>
        ))}
      </section>

      <div className="dash-grid">
        <section className="dash-section">
          <div className="dash-section-heading">
            <div><p className="dash-eyebrow">Today</p><h2 className="dash-section-title">Appointment schedule</h2></div>
            <a className="dash-section-link" href={primaryPath}>View all</a>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table"><thead><tr><th>Patient</th><th>Doctor</th><th>Time</th><th>Status</th></tr></thead>
              <tbody>{appointments.map(row => <tr key={`${row[0]}-${row[2]}`}><td className="dash-patient">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td><span className={`dash-badge ${row[3].toLowerCase()}`}>{row[3]}</span></td></tr>)}</tbody>
            </table>
          </div>
        </section>
        <aside className="dash-section dash-side-card">
          <div className="dash-section-heading"><div><p className="dash-eyebrow">Updates</p><h2 className="dash-section-title">Recent activity</h2></div><span className="dash-live-dot" /></div>
          <div className="dash-activity"><div className="dash-activity-mark">✓</div><div><strong>New patient registered</strong><span>Sarah Kato · 12 min ago</span></div></div>
          <div className="dash-activity"><div className="dash-activity-mark blue">+</div><div><strong>Appointment booked</strong><span>Robert Ssekandi · 34 min ago</span></div></div>
          <div className="dash-activity"><div className="dash-activity-mark amber">$</div><div><strong>Invoice paid</strong><span>Invoice #INV-2048 · 1 hr ago</span></div></div>
        </aside>
      </div>
    </DashboardLayout>
  );
}

export default DashboardHome;
