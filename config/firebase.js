const admin = require('firebase-admin');
require('dotenv').config();

var key = require('../config/niyya-notes-firebase-adminsdk-fggb6-c6a0155f93.json')

// Initialize Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.cert(key),
        storageBucket: "niyya-notes.appspot.com" // Replace with your Firebase project's storage bucket
    });
    console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };