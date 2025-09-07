const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Doctors data
const doctors = [
    { department: 'Cardiology', doctor: 'Dr. Emily Carter', contact: '0987654321', room: 'C-201', keywords: ['heart', 'cardiac', 'chest', 'circulation'] },
    { department: 'Dermatology', doctor: 'Dr. Alex Johnson', contact: '1234567890', room: 'D-302', keywords: ['skin', 'rash', 'acne', 'dermatitis'] },
    { department: 'Neurology', doctor: 'Dr. Sarah Patel', contact: '2345678901', room: 'N-405', keywords: ['headache', 'migraine', 'nerve', 'brain'] },
    { department: 'Orthopedics', doctor: 'Dr. Michael Chen', contact: '3456789012', room: 'O-110', keywords: ['bone', 'joint', 'fracture', 'sprain'] },
    { department: 'Pediatrics', doctor: 'Dr. Jessica Lee', contact: '4567890123', room: 'P-222', keywords: ['child', 'pediatric', 'kid', 'infant'] },
    { department: 'Gastroenterology', doctor: 'Dr. James Rodriguez', contact: '5678901234', room: 'G-501', keywords: ['stomach', 'digestive', 'gastro', 'intestine'] },
    { department: 'General Practice', doctor: 'Dr. David Kim', contact: '6789012345', room: 'GP-101', keywords: ['fever', 'cold', 'flu', 'general', 'cough'] }
];

// Middleware to parse JSON bodies
app.use(express.json());

// Serve the HTML file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint for booking an appointment
app.post('/api/book', (req, res) => {
    const { name, issue, date } = req.body;

    if (!name || !issue || !date) {
        return res.status(400).json({ error: 'Missing required fields: name, issue, or date' });
    }

    const lowerCaseIssue = issue.toLowerCase();
    const assignedDoctor = doctors.find(d => d.keywords.some(keyword => lowerCaseIssue.includes(keyword))) || doctors.find(d => d.department === 'General Practice');

    const appointment = {
        name,
        issue,
        date,
        department: assignedDoctor.department,
        doctor: assignedDoctor.doctor,
        contact: assignedDoctor.contact,
        room: assignedDoctor.room
    };

    res.status(200).json({
        message: 'Appointment booked successfully',
        appointment: appointment
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
