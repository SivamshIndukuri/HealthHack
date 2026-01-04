-- run brew install postgresql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP SCHEMA IF EXISTS clinic CASCADE;

CREATE SCHEMA IF NOT EXISTS clinic;

-- NOTE: you named this table clinic.user (singular)
CREATE TABLE IF NOT EXISTS clinic.user (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  user_password TEXT NOT NULL,
  user_role VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- index must reference the actual table name: clinic.user
CREATE INDEX IF NOT EXISTS idx_username ON clinic.user(username);

-- NOTE: you named this table clinic.refresh_token (singular)
CREATE TABLE IF NOT EXISTS clinic.refresh_token (
  token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES clinic.user(user_id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- indexes must reference the actual table name: clinic.refresh_token
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON clinic.refresh_token(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON clinic.refresh_token(expires_at);

CREATE TABLE IF NOT EXISTS clinic.doctors (
  user_id UUID NOT NULL REFERENCES clinic.user(user_id) ON DELETE CASCADE,
  doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_first_name VARCHAR(50) NOT NULL,
  doctor_last_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS clinic.patients (
  user_id UUID NOT NULL REFERENCES clinic.user(user_id) ON DELETE CASCADE,
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

-- =========================
-- Row Level Security (RLS)
-- =========================
ALTER TABLE clinic.doctors  ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic.patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS docter_rls ON clinic.doctors;
CREATE POLICY docter_rls
ON clinic.doctors
FOR ALL
USING (user_id::text = current_setting('app.user_id', true))
WITH CHECK (user_id::text = current_setting('app.user_id', true));

DROP POLICY IF EXISTS patient_rls ON clinic.patients;
CREATE POLICY patient_rls
ON clinic.patients
FOR ALL
USING (user_id::text = current_setting('app.user_id', true))
WITH CHECK (user_id::text = current_setting('app.user_id', true));

CREATE TABLE IF NOT EXISTS clinic.hospitals (
  hospital_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name VARCHAR(500) NOT NULL,
  hospital_address VARCHAR(500) NOT NULL,
  hospital_phone_number VARCHAR(20) NOT NULL,
  ranking INT,
  call_status VARCHAR(50) NOT NULL,
  patient_id UUID NOT NULL REFERENCES clinic.patients(patient_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clinic.appointments (
  appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_date DATE NOT NULL,
  appointment_details VARCHAR(1000) NOT NULL,
  appointment_status VARCHAR(50),
  created_at DATE DEFAULT CURRENT_DATE,
  hospital_id UUID NOT NULL REFERENCES clinic.hospitals(hospital_id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES clinic.patients(patient_id) ON DELETE CASCADE
);

-- run:
-- psql "host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER password=$DB_PASSWORD sslmode=require" -f db/schema.sql
