const admin = require('firebase-admin');
require('dotenv').config();

import {niyyaFBKey} from './env'

// Initialize Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.cert(niyyaFBKey),
        storageBucket: "niyya-notes.appspot.com" // Replace with your Firebase project's storage bucket
    });
    console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };