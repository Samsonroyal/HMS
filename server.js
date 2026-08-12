const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: ['.env.local', '.env'] });

if (!process.env.SECRET_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('SECRET_KEY is not set. Configure .env.local before starting in production.');
}

const Patient = require('./routes/users/Patient/patient');
const Doctor = require('./routes/users/Doctor/docter');
const Admin = require('./routes/users/Administrator/admin');
const Appointment = require('./routes/users/Patient/appointment');
const Prescription = require('./routes/users/Doctor/prescription');
const api = require('./routes/api/api');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/patient', Patient);
app.use('/doctor' , Doctor);
app.use('/admin', Admin);
app.use('/appointment', Appointment);
app.use('/prescription', Prescription);
app.use('/api', api);

app.use(express.static(path.join(__dirname + '/client/build')));

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));