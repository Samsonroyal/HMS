-- Kiruddu National Referral Hospital - Hospital Patient Management System
-- Full MySQL schema. Run against a fresh `hmsproject` database:
--   CREATE DATABASE hmsproject; USE hmsproject; SOURCE schema.sql;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS patient (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address VARCHAR(255),
    email VARCHAR(100) UNIQUE,
    phone_no VARCHAR(20),
    password VARCHAR(255),
    disease VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address VARCHAR(255),
    email VARCHAR(100) UNIQUE,
    salary VARCHAR(100),
    specialisation VARCHAR(100),
    shift_time VARCHAR(100),
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone_no VARCHAR(20),
    designation VARCHAR(100),
    password VARCHAR(255),
    salary VARCHAR(100),
    address VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS superAdmin (
    superAdmin_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS bill (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    medicine_cost FLOAT DEFAULT 0,
    operation_charge FLOAT DEFAULT 0,
    room_charge FLOAT DEFAULT 0,
    misc_charge FLOAT DEFAULT 0,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);

CREATE TABLE IF NOT EXISTS assign_doctor (
    assign_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

CREATE TABLE IF NOT EXISTS appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE,
    appointment_time VARCHAR(10),
    reason VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

CREATE TABLE IF NOT EXISTS prescription (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    medicine_name VARCHAR(100),
    dosage VARCHAR(100),
    instructions VARCHAR(255),
    date DATE,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

CREATE TABLE IF NOT EXISTS activity_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('patient', 'doctor', 'admin') NOT NULL,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_user (user_type, user_id),
    INDEX idx_activity_created (created_at)
);
