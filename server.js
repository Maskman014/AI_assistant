// This file sets up a simple Express.js server to handle OTP generation and sending.
//
// To run this server, you'll need to install the required packages:
// npm install express twilio cors

const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Twilio credentials from environment variables for security.
// Replace with your actual credentials.
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+15017122661'; // Your Twilio phone number

const client = new twilio(accountSid, authToken);

// In-memory store for demonstration purposes. In a production app, use a database.
const otpStore = {};

// Enable CORS for all routes to allow the frontend to access the server.
app.use(cors());
app.use(express.json());

// Endpoint to send an OTP to a phone number
app.post('/api/send-otp', async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required.' });
    }

    // Generate a 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP with the phone number
    otpStore[phone] = otp;
    console.log(`Generated OTP for ${phone}: ${otp}`);

    try {
        // In a real application, you would uncomment this to send the OTP via Twilio.
        // const message = await client.messages.create({
        //     body: `Your hospital appointment verification code is: ${otp}`,
        //     from: twilioPhoneNumber,
        //     to: phone,
        // });
        // console.log(`Message SID: ${message.sid}`);

        // For this demonstration, we just respond with the OTP
        res.status(200).json({ success: true, otp: otp, message: 'OTP sent (for development).' });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
