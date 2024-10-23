const admin = require('firebase-admin');
require('dotenv').config();

var key = process.env.FB_KEY || ''

// Initialize Firebase Admin SDK
try {
    let temp = JSON.parse(key)
    admin.initializeApp({
        credential: admin.credential.cert(temp),
        storageBucket: "niyya-notes.appspot.com" // Replace with your Firebase project's storage bucket
    });
    console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };