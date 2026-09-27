// Mock API layer.
//
// This simulates a real backend (like the JSON Server resources described
// in the project spec: /users, /doctors, /patients, /appointments,
// /prescriptions, /medicalHistory, /notifications, /specializations) while
// running entirely in the browser via localStorage. Every function returns
// a Promise and has an artificial delay + the same shape you'd get from
// axios, so swapping this out for real axios calls to a JSON Server or
// REST API later is a drop-in change — you'd just replace the bodies of
// these functions with `axios.get('/api/doctors')` etc.

import {
  users as seedUsers,
  doctors as seedDoctors,
  patients as seedPatients,
  appointments as seedAppointments,
  prescriptions as seedPrescriptions,
  medicalHistory as seedMedicalHistory,
  notifications as seedNotifications,
  specializations as seedSpecializations,
} from '../data/mockData';

const STORE_KEY = 'meridian_health_db_v1';
const DELAY = 350;

function loadDb() {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through to reseed
    }
  }
  const seeded = {
    users: seedUsers,
    doctors: seedDoctors,
    patients: seedPatients,
    appointments: seedAppointments,
    prescriptions: seedPrescriptions,
    medicalHistory: seedMedicalHistory,
    notifications: seedNotifications,
    specializations: seedSpecializations,
  };
  localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveDb(db) {
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
}

function delay(value, ms = DELAY) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function nextId(list) {
  return list.length ? Math.max(...list.map((i) => i.id)) + 1 : 1;
}

export function resetDatabase() {
  localStorage.removeItem(STORE_KEY);
  return loadDb();
}

/* ---------------- Auth ---------------- */

export async function login({ email, password, role }) {
  const db = loadDb();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role
  );
  if (!user) {
    return delay({ ok: false, error: 'Invalid email, password, or role.' });
  }
  const { password: _pw, ...safeUser } = user;
  return delay({ ok: true, user: safeUser });
}

export async function register({ name, email, phone, password, role }) {
  const db = loadDb();
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return delay({ ok: false, error: 'An account with this email already exists.' });
  }
  const id = `u-${role}-${Date.now()}`;
  const newUser = { id, name, email, phone, password, role };

  if (role === 'patient') {
    const patientId = nextId(db.patients);
    db.patients.push({
      id: patientId,
      userId: id,
      name,
      email,
      phone,
      age: null,
      gender: '',
      bloodGroup: '',
      address: '',
      status: 'active',
    });
    newUser.patientId = patientId;
  }
  if (role === 'doctor') {
    const doctorId = nextId(db.doctors);
    db.doctors.push({
      id: doctorId,
      userId: id,
      name,
      specialization: 'General Physician',
      experience: 0,
      qualification: '',
      rating: 0,
      reviews: 0,
      fee: 0,
      available: true,
      status: 'pending',
      about: '',
      hospital: '',
      slots: [],
    });
    newUser.doctorId = doctorId;
  }

  db.users.push(newUser);
  saveDb(db);
  const { password: _pw, ...safeUser } = newUser;
  return delay({ ok: true, user: safeUser });
}

/* ---------------- Doctors ---------------- */

export async function getDoctors() {
  const db = loadDb();
  return delay(db.doctors);
}

export async function getDoctorById(id) {
  const db = loadDb();
  return delay(db.doctors.find((d) => d.id === Number(id)) || null);
}

export async function addDoctor(doctor) {
  const db = loadDb();
  const newDoctor = { ...doctor, id: nextId(db.doctors), status: doctor.status || 'pending' };
  db.doctors.push(newDoctor);
  saveDb(db);
  return delay(newDoctor);
}

export async function updateDoctor(id, updates) {
  const db = loadDb();
  db.doctors = db.doctors.map((d) => (d.id === Number(id) ? { ...d, ...updates } : d));
  saveDb(db);
  return delay(db.doctors.find((d) => d.id === Number(id)));
}

export async function deleteDoctor(id) {
  const db = loadDb();
  db.doctors = db.doctors.filter((d) => d.id !== Number(id));
  saveDb(db);
  return delay({ ok: true });
}

/* ---------------- Patients ---------------- */

export async function getPatients() {
  const db = loadDb();
  return delay(db.patients);
}

export async function getPatientById(id) {
  const db = loadDb();
  return delay(db.patients.find((p) => p.id === Number(id)) || null);
}

export async function updatePatient(id, updates) {
  const db = loadDb();
  db.patients = db.patients.map((p) => (p.id === Number(id) ? { ...p, ...updates } : p));
  saveDb(db);
  return delay(db.patients.find((p) => p.id === Number(id)));
}

export async function deletePatient(id) {
  const db = loadDb();
  db.patients = db.patients.filter((p) => p.id !== Number(id));
  saveDb(db);
  return delay({ ok: true });
}

/* ---------------- Appointments ---------------- */

export async function getAppointments() {
  const db = loadDb();
  return delay(db.appointments);
}

export async function getAppointmentsForPatient(patientId) {
  const db = loadDb();
  return delay(db.appointments.filter((a) => a.patientId === Number(patientId)));
}

export async function getAppointmentsForDoctor(doctorId) {
  const db = loadDb();
  return delay(db.appointments.filter((a) => a.doctorId === Number(doctorId)));
}

export async function createAppointment(appt) {
  const db = loadDb();
  const newAppt = { ...appt, id: nextId(db.appointments), status: appt.status || 'requested' };
  db.appointments.push(newAppt);
  saveDb(db);
  return delay(newAppt);
}

export async function updateAppointment(id, updates) {
  const db = loadDb();
  db.appointments = db.appointments.map((a) => (a.id === Number(id) ? { ...a, ...updates } : a));
  saveDb(db);
  return delay(db.appointments.find((a) => a.id === Number(id)));
}

export async function deleteAppointment(id) {
  const db = loadDb();
  db.appointments = db.appointments.filter((a) => a.id !== Number(id));
  saveDb(db);
  return delay({ ok: true });
}

/* ---------------- Prescriptions ---------------- */

export async function getPrescriptions() {
  const db = loadDb();
  return delay(db.prescriptions);
}

export async function getPrescriptionsForPatient(patientId) {
  const db = loadDb();
  return delay(db.prescriptions.filter((p) => p.patientId === Number(patientId)));
}

export async function addPrescription(prescription) {
  const db = loadDb();
  const newRx = { ...prescription, id: nextId(db.prescriptions) };
  db.prescriptions.push(newRx);
  saveDb(db);
  return delay(newRx);
}

export async function updatePrescription(id, updates) {
  const db = loadDb();
  db.prescriptions = db.prescriptions.map((p) => (p.id === Number(id) ? { ...p, ...updates } : p));
  saveDb(db);
  return delay(db.prescriptions.find((p) => p.id === Number(id)));
}

export async function deletePrescription(id) {
  const db = loadDb();
  db.prescriptions = db.prescriptions.filter((p) => p.id !== Number(id));
  saveDb(db);
  return delay({ ok: true });
}

/* ---------------- Medical history ---------------- */

export async function getMedicalHistoryForPatient(patientId) {
  const db = loadDb();
  return delay(db.medicalHistory.filter((m) => m.patientId === Number(patientId)));
}

export async function addMedicalHistoryEntry(entry) {
  const db = loadDb();
  const newEntry = { ...entry, id: nextId(db.medicalHistory) };
  db.medicalHistory.push(newEntry);
  saveDb(db);
  return delay(newEntry);
}

/* ---------------- Notifications ---------------- */

export async function getNotificationsForUser(userId) {
  const db = loadDb();
  return delay(db.notifications.filter((n) => n.userId === userId));
}

export async function markNotificationRead(id) {
  const db = loadDb();
  db.notifications = db.notifications.map((n) => (n.id === Number(id) ? { ...n, read: true } : n));
  saveDb(db);
  return delay({ ok: true });
}

/* ---------------- Specializations ---------------- */

export async function getSpecializations() {
  const db = loadDb();
  return delay(db.specializations);
}
