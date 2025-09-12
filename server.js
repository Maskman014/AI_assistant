const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// IMPORTANT: The path is now a relative path, meaning it looks for the file
// in the same folder as this server.js file. This is the correct way
// to fix the "Cannot find module" error.
const serviceAccountKeyPath = './appointment-booking-app-1188e-firebase-adminsdk-fbsvc-12af8e6c65.json';

// Initialize Firebase Admin SDK
try {
  const serviceAccount = require(serviceAccountKeyPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error("Failed to load Firebase service account key. Please check the path and file.");
  console.error("Error:", error);
  // Exit the process if the key is not found, as the app cannot function.
  process.exit(1);
}

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// NEW: A simple test route to confirm the server is working.
app.get('/', (req, res) => {
  res.send('<h1>Server is running!</h1><p>The backend is live and ready for API requests.</p>');
});

// Hardcoded doctor data (you can fetch this from Firestore in a real app)
const doctors = [
  { name: 'Dr. Evelyn Reed', degree: 'MD, PhD', experience: 15, specialty: ['cardiology', 'heart disease', 'hypertension', 'arrhythmia'], rating: 4.8 },
  { name: 'Dr. Liam Chen', degree: 'MBBS, FRCS', experience: 10, specialty: ['oncology', 'cancer', 'tumors', 'chemotherapy', 'radiation'], rating: 4.9 },
  { name: 'Dr. Sofia Garcia', degree: 'DO', experience: 7, specialty: ['pediatrics', 'child health', 'infant care', 'immunizations', 'growth'], rating: 5.0 },
  { name: 'Dr. Michael Adebayo', degree: 'MD', experience: 20, specialty: ['neurology', 'brain', 'nervous system', 'headaches', 'migraines', 'stroke'], rating: 4.7 },
  { name: 'Dr. Anya Petrova', degree: 'MD, FACS', experience: 12, specialty: ['dermatology', 'skin', 'rashes', 'acne', 'eczema', 'psoriasis'], rating: 4.6 },
  { name: 'Dr. Noah Patel', degree: 'MBBS', experience: 8, specialty: ['gastroenterology', 'stomach', 'digestive issues', 'intestines', 'acid reflux', 'IBS'], rating: 4.9 },
  { name: 'Dr. Chloe Dubois', degree: 'MD', experience: 18, specialty: ['orthopedics', 'bones', 'joints', 'fractures', 'arthritis', 'sports injuries'], rating: 4.5 },
  { name: 'Dr. David Lee', degree: 'MD, MPH', experience: 14, specialty: ['endocrinology', 'diabetes', 'hormones', 'thyroid', 'metabolism', 'adrenal'], rating: 4.8 },
  { name: 'Dr. Isabelle Rossi', degree: 'MD', experience: 11, specialty: ['gynecology', 'women\'s health', 'prenatal care', 'menstruation'], rating: 5.0 },
  { name: 'Dr. Ethan Miller', degree: 'MD', experience: 9, specialty: ['urology', 'urinary tract', 'kidneys', 'bladder', 'prostate'], rating: 4.6 },
  { name: 'Dr. Olivia Kim', degree: 'MBBS, DTMH', experience: 16, specialty: ['infectious diseases', 'HIV', 'AIDS', 'COVID', 'flu', 'viruses', 'bacteria'], rating: 4.9 },
  { name: 'Dr. Benjamin Carter', degree: 'MD', experience: 13, specialty: ['pulmonology', 'lungs', 'respiratory', 'asthma', 'bronchitis', 'COPD', 'cold', 'cough', 'sinus'], rating: 4.7 },
  { name: 'Dr. Maya Singh', degree: 'DO', experience: 6, specialty: ['ophthalmology', 'eyes', 'vision', 'cataracts', 'glaucoma'], rating: 4.8 },
  { name: 'Dr. Jacob Williams', degree: 'MD', experience: 10, specialty: ['rheumatology', 'arthritis', 'autoimmune diseases', 'lupus', 'fibromyalgia'], rating: 4.9 },
  { name: 'Dr. Chloe Green', degree: 'MD', experience: 5, specialty: ['general practice', 'family medicine', 'check-up', 'general health', 'fever', 'cold', 'flu', 'sinus'], rating: 4.7 },
  { name: 'Dr. Daniel Rodriguez', degree: 'MD', experience: 17, specialty: ['ent', 'ear', 'nose', 'throat', 'sinus', 'allergies'], rating: 4.6 },
  { name: 'Dr. Hannah Foster', degree: 'MD, PhD', experience: 22, specialty: ['psychiatry', 'mental health', 'anxiety', 'depression', 'bipolar'], rating: 5.0 },
  { name: 'Dr. Mark Thompson', degree: 'MD', experience: 9, specialty: ['nephrology', 'kidneys', 'kidney stones', 'kidney disease'], rating: 4.7 },
  { name: 'Dr. Jessica Lee', degree: 'MD', experience: 14, specialty: ['allergy and immunology', 'allergies', 'asthma', 'immune system', 'hives'], rating: 4.9 },
  { name: 'Dr. Peter Jones', degree: 'MD', experience: 25, specialty: ['general surgery', 'surgery', 'appendectomy', 'gallbladder'], rating: 4.8 },
];

// Route to get a list of all doctors
app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

// Route to create a new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const appointmentData = req.body;

    // Validate incoming data
    if (!appointmentData.patientName || !appointmentData.doctorName || !appointmentData.date) {
      return res.status(400).send({ error: 'Missing required appointment data.' });
    }

    // Save appointment to Firestore
    const docRef = await db.collection('appointments').add({
      ...appointmentData,
      createdAt: new Date()
    });
    
    console.log(`Appointment booked with ID: ${docRef.id}`);
    res.status(201).send({ message: 'Appointment booked successfully!', appointmentId: docRef.id });

  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).send({ error: 'Failed to book appointment.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
