-- run brew install postgresql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- DROP SCHEMA clinic 

CREATE SCHEMA IF NOT EXISTS clinic;

CREATE TABLE IF NOT EXISTS clinic.doctors(
  doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_first_name VARCHAR(50) NOT NULL,
  doctor_last_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS clinic.patients(
  patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_first_name VARCHAR(50) NOT NULL,
  patient_last_name VARCHAR(50) NOT NULL,
  insurance VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  score INT,
  patient_phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  doctor_id UUID NOT NULL REFERENCES clinic.doctors(doctor_id),
  created_at DATE DEFAULT CURRENT_DATE,
  patient_status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS clinic.hospitals(
  hospital_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name VARCHAR(500) NOT NULL,
  hospital_address VARCHAR(500) NOT NULL,
  hospital_phone_number VARCHAR(20) NOT NULL,
  ranking INT,
  call_status VARCHAR(50) NOT NULL,
  patient_id UUID NOT NULL REFERENCES clinic.patients(patient_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clinic.appointments(
  appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_date DATE NOT NULL, 
  appointment_details VARCHAR(1000) NOT NULL,
  appointment_status VARCHAR(50),
  created_at DATE DEFAULT CURRENT_DATE,
  hospital_id UUID NOT NULL REFERENCES clinic.hospitals(hospital_id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES clinic.patients(patient_id) ON DELETE CASCADE
);


-- run psql \ "host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER password=$DB_PASSWORD sslmode=require" \ -f db/schema.sql
